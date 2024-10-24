require('dotenv').config(); //Load environment variables
const path = require('path');

const { app, BrowserWindow, ipcMain } = require("electron");

const { beginSession, endSession } = require("./study-session/session-control");
// const { createWebsocket } = require('./api_recievers/create-websocket');
// const log = require('./util/logger');

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Optional if using preload script
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false
    }
  });

  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    win.loadURL(`http://localhost:8080`); // Load from webpack-dev-server
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html')); // Load the production build
  }
  
  ipcMain.on("begin-session", (...args) => {
    win.setSize(800, 600);
    beginSession(...args);
  });
  ipcMain.on("end-session", (...args) => {
    win.maximize();
    win.setResizable(false);
    endSession(...args); 
  });


  win.on('closed', () => {
    win = null;
  });
};
  
app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  endSession(null, true); //Can always pass in true for cleanup here
  //If the session isn't active, it doesn't do anything anyways
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// app.on('activate', () => {
//   if (mainWindow === null) {
//     createWindow();
//   }
// });