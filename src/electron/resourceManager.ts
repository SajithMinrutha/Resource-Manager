import osUtils from "os-utils";
import diskusage from "diskusage";
import os from "os";
import { BrowserWindow } from "electron";
import fs from "fs/promises";
import path from "path";

const POLLING_INTERVAL = 1000; // 1 second for smoother updates

interface Statistics {
  storage: number; // GB
  cpu: number; // %
  ram: number; // %
  diskIO: number; // MB/s (approximated)
  battery: number; // % (if available)
}

interface StorageData {
  total: number;
  free: number;
}

export function pollResources(mainWindow: BrowserWindow): () => void {
  const interval = setInterval(async () => {
    try {
      const cpuUsage = await getCpuUsage();
      const ramUsage = await getRamUsage();
      const storageData = await getStorageData();
      const diskIOData = await getDiskIO();
      const batteryLevel = await getBatteryLevel(mainWindow);

      const stats: Statistics = {
        cpu: Math.round(cpuUsage * 100),
        ram: Math.round(ramUsage * 100),
        storage: Math.round((storageData.total - storageData.free) / 1024 ** 3), // GB
        diskIO: Math.round(diskIOData), // MB/s (approximated)
        battery: Math.round(batteryLevel),
      };

      console.log("Stats:", stats); // Debug log
      mainWindow.webContents.send("statistics", stats);
    } catch (err) {
      console.error("Error polling resources:", err);
    }
  }, POLLING_INTERVAL);

  return () => clearInterval(interval);
}

function getCpuUsage(): Promise<number> {
  return new Promise((resolve, reject) => {
    osUtils.cpuUsage((value: number) => {
      if (typeof value !== "number" || isNaN(value)) {
        reject(new Error("Invalid CPU usage value"));
      } else {
        resolve(value);
      }
    });
  });
}

async function getRamUsage(): Promise<number> {
  const totalMem = os.totalmem(); // Bytes
  const freeMem = os.freemem(); // Bytes
  const usedMem = totalMem - freeMem;
  const ramUsage = usedMem / totalMem;
  console.log(
    "RAM - Total:",
    totalMem / 1024 ** 3,
    "GB, Free:",
    (freeMem / 1024 ** 3) * 100,
    "GB, Usage:",
    ramUsage * 100,
    "%"
  ); // Debug log
  return ramUsage;
}

async function getStorageData(): Promise<StorageData> {
  const path = process.platform === "win32" ? "C:\\" : "/";
  try {
    return await diskusage.check(path);
  } catch (err) {
    console.error("Error getting storage data:", err);
    return { total: 0, free: 0 };
  }
}

async function getDiskIO(): Promise<number> {
  const tempFile = path.join(os.tmpdir(), "test-io-file");
  try {
    const start = process.hrtime();
    const data = Buffer.alloc(1024 * 1024, "x"); // 1MB buffer
    await fs.writeFile(tempFile, data); // Write 1MB
    await fs.unlink(tempFile); // Clean up
    const end = process.hrtime(start);
    const durationMs = (end[0] * 1e9 + end[1]) / 1e6;
    const ioRate = 1 / (durationMs / 1000); // MB/s (1MB written over duration)
    console.log("Disk I/O raw:", ioRate); // Debug log
    return ioRate > 0 ? ioRate : 0; // Ensure non-negative
  } catch (err) {
    console.error("Error estimating disk I/O:", err);
    return 0;
  }
}

async function getBatteryLevel(mainWindow: BrowserWindow): Promise<number> {
  try {
    const battery = await mainWindow.webContents.executeJavaScript(
      "window.electron.getBattery()"
    );
    if (battery && typeof battery.level === "number") {
      const level = battery.level * 100;
      console.log("Battery level:", level); // Debug log
      return level;
    }
    console.log("Battery API unavailable or no battery detected");
    return -1; // Indicate unavailable
  } catch (err) {
    console.error("Error getting battery level:", err);
    return -1; // Indicate unavailable
  }
}

export async function getStaticData() {
  const storageData = await getStorageData();
  const cpuModel = os.cpus()[0].model;
  const totalMemory = Math.floor(os.totalmem() / 1024 ** 3); // GB
  return {
    totalStorage: storageData.total / 1024 ** 3, // GB
    cpuModel,
    totalMemory,
  };
}
