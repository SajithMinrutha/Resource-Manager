import { promises } from "dns";
import osUtils from "os-utils"; //instal @type as a dev dependancy
import { resolve } from "path";
import fs from "fs";
import diskusage from "diskusage"; // Install this package using npm or yarn
import os from "os";

const POLLING_INTERVAL = 500; // 1 second

export function pollResources() {
  setInterval(async () => {
    const cpuUsage: any = await getCpuUsage();
    const ramUsage = getRamUsage();
    const storageData = getStorageData();

    console.log(`Storage Total: ${storageData.total - storageData.free} bytes`);
    console.log(`CPU Usage: ${Math.round(cpuUsage * 100)}%`);
    console.log(`RAM Usage: ${Math.round(ramUsage * 100)}%`);
  }, POLLING_INTERVAL);
}
function getCpuUsage() {
  return new Promise((resolve) => {
    osUtils.cpuUsage(resolve);
  });
}
function getRamUsage() {
  return 1 - osUtils.freememPercentage();
}
function getStorageData() {
  const path = process.platform === "win32" ? "C:\\" : "/";
  const { total, free } = diskusage.checkSync(path);
  return { total, free };
}
export function getStaticData() {
  const totalStorage = getStorageData().total;
  const cpuModel = os.cpus()[0].model;
  const totalMemory = Math.floor(os.totalmem() / 1024);
  return {
    totalStorage,
    cpuModel,
    totalMemory,
  };
}
