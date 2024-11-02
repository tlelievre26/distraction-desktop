require('dotenv').config(); //Load environment variables
const path = require('path');

const { app, BrowserWindow, ipcMain } = require("electron");

const { beginSession, endSession } = require("./study-session/session-control");
const showErrorPopup = require('./util/error-popup');
const startInfluxDb = require('./api_recievers/start-influx-db');

const store = new Store();

const createWindow = async () => {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 1000,
    minHeight: 800,
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

  const influxPath = store.get("influxPath", '');
  //The API key should prob be stored in something more secure than electron-store
  //But bc it's only a key for a local DB that would be really easy to access for an attacker anyways, I'd rather save the hassle
  const apiKey = store.get("apiKey", '');

  win.webContents.on('did-finish-load', () => { 
    win.webContents.send('load-settings', influxPath, apiKey);
  });

  if(apiKey !== '' && influxPath !== '') { //Dont try to connect if the user hasn't input either field yet
    try {
      await startInfluxDb(influxPath, apiKey);
      win.webContents.send('db-conn-success');
    }
    catch(error) {
      showErrorPopup(`Failed to connect to InfluxDB: ${error.message}`);
      win.webContents.send('db-conn-failed');
    }
  }

  ipcMain.on("begin-session", (...args) => {
    win.setMinimumSize(800, 600);
    win.setSize(800, 600);
    beginSession(...args);
  });

  ipcMain.on("end-session", (...args) => {
    win.setMinimumSize(1200, 800);
    win.maximize();
    endSession(...args); 
  });
  ipcMain.on("attempt-reconnect", async (_event, influxPath, apiKey) => {
    try {
      await startInfluxDb(influxPath, apiKey);
      showErrorPopup({ //Using the error popup function to show an info popup but ehhhh whatever
        type: "info",
        title: "Success",
        message: "Successfully connected to InfluxDB",
        buttons: ['OK'],
        defaultId: 0 // 'OK' button   
      });
      store.set("apiKey", apiKey);
      store.set("influxPath", influxPath);
      win.webContents.send('db-conn-success');
    }
    catch(error) {
      showErrorPopup(`Failed to connect to InfluxDB: ${error.message}`);
      win.webContents.send('db-conn-failed');
    }
  });

  ipcMain.on('error-msg', (_event, msg) => { //Lets the frontend create error popups
    showErrorPopup(msg);
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

process.on('uncaughtException', (error) => { //Makes an error message popup whenever one occurs
  log.error('Uncaught Exception:', error);
  showErrorPopup("An Error Occurred", { message: error.message });
  //Probably close the app
});