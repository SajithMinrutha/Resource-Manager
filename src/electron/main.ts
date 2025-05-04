import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { getStaticData, pollResources } from "./resourceManager.js";
import { getPreloaderPath } from "./pathResolver.js";

let mainWindow: BrowserWindow | null = null;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloaderPath(),
      nodeIntegration: false,
      contextIsolation: true, // Enable for security
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123").catch((err) => {
      console.error("Failed to load URL:", err);
    });
  } else {
    mainWindow
      .loadFile(path.join(app.getAppPath(), "dist-react", "index.html"))
      .catch((err) => {
        console.error("Failed to load file:", err);
      });
  }

  pollResources(mainWindow);

  ipcMain.handle("getStaticData", () => {
    return getStaticData();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
