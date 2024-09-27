require('dotenv').config(); //Load environment variables
const path = require('path');

const { app, BrowserWindow, ipcMain } = require("electron");

const { beginSession, endSession } = require("./study-session/session-control");
const log = require('./util/logger');

const createWindow = () => {
  let win = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Optional if using preload script
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    win.loadURL('http://localhost:8080'); // Load from webpack-dev-server
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html')); // Load the production build
  }

  log.info("Testing logging", { sample: "data", sample2: "data2"});
  log.debug("Testing debug logging");
  
  ipcMain.on("begin-session", (...args) => {
    win.setSize(800, 600);
    beginSession(...args);
  });
  ipcMain.on("end-session", endSession);
};
  
app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// app.on('activate', () => {
//   if (mainWindow === null) {
//     createWindow();
//   }
// });
