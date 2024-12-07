require('dotenv').config(); //Load environment variables
const path = require('path');

const { app, BrowserWindow, ipcMain } = require("electron");

const { beginSession, endSession } = require("./study-session/session-control");
const showErrorPopup = require('./util/error-popup');
const { startInfluxDb, stopInfluxDb } = require('./api_recievers/start-influx-db');
const log = require('./util/logger');
const { grabAllPreviousStudySessionIDs, taskData, getTasksForSession, grabTimesForStudySession, deleteStudySession, sessionMetricsData, getAvgSessionMetrics, appData } = require('./api_recievers/influxqueries');
const version = require('../package.json').version;


//For whatever reason, the electron-store module doesn't support using require, so we have to do this to get i
const importElectronStore = async () => {
  const Store = (await import('electron-store')).default; // Use .default to access the ES module export
  const store = new Store();
  return store;
};

const createWindow = async () => {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 1000,
    minHeight: 800,
    title: `DistrAction v${version}`,
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

  const store = await importElectronStore();
  const influxPath = store.get("influxPath", '');
  //The API key should prob be stored in something more secure than electron-store
  //But bc it's only a key for a local DB that would be really easy to access for an attacker anyways, I'd rather save the hassle
  const apiKey = store.get("apiKey", '');

  win.webContents.on('did-finish-load', async () => { 
    win.webContents.send('load-settings', influxPath, apiKey);
    if(apiKey !== '' && influxPath !== '') { //Dont try to connect if the user hasn't input either field yet
      if(await startInfluxDb(influxPath, apiKey) === 0 ) {
        log.debug("Successfully connected to Influx DB on startup");
        win.webContents.send('db-conn-success');
      }
      else {
        log.error(`Failed to connect to InfluxDB on startup`);
        win.webContents.send('db-conn-failed');
      }

    }
    win.setAlwaysOnTop(false);
  });

  ipcMain.on("begin-session", (...args) => {
    win.setSize(1000, 800);
    win.setMinimumSize(1000, 800);
    beginSession(...args);
  });

  ipcMain.on("end-session", (...args) => {
    win.maximize();
    const [width, height] = win.getSize();
    win.setMinimumSize(width, height);
    endSession(...args); 
  });

  ipcMain.on("resize-window", (_event, screen) => {
    if(screen === "start") {
      win.setSize(1000, 800);
      win.setMinimumSize(1000, 800);
    }
    else if(screen === "timeline") {
      win.setAlwaysOnTop(false);
      win.setFullScreen(false);
      win.setMinimumSize(1200, 800);
      win.maximize();
    }
  });

  ipcMain.on('lock-app', (_event, sessionId) => {
    win.setAlwaysOnTop(true);
    win.focus();
    win.setFullScreen(true);
    appData("Windows", "AFK", sessionId);
  });
  
  ipcMain.on('unlock-app', () => {
    win.setAlwaysOnTop(false);
    win.setFullScreen(false);
  });
  
  ipcMain.on("attempt-reconnect", async (_event, influxPath, apiKey) => {
    store.set("apiKey", apiKey);
    store.set("influxPath", influxPath);

    if(await startInfluxDb(influxPath, apiKey) === 0) {
      log.debug("Successfully connected to InfluxDB");
      showErrorPopup({ //Using the error popup function to show an info popup is jank but ehhhh whatever
        type: "info",
        title: "Success",
        message: "Successfully connected to InfluxDB",
        buttons: ['OK'],
        defaultId: 0 // 'OK' button   
      });

      win.webContents.send('db-conn-success');
    }
    else {
      win.webContents.send('db-conn-failed');
    }

  });

  ipcMain.on('get-prev-sessions', async (event) => { //Lets the frontend create error popups
    const prevSessionData = await grabAllPreviousStudySessionIDs();
    event.sender.send('return-prev-sessions', prevSessionData);
  });

  ipcMain.on('record-task', async (_event, taskCompleted, taskName, sessionId) => { //Lets the frontend create error popups
    await taskData(taskCompleted, taskName, sessionId);
  });

  ipcMain.on('get-session-data', async (event, sessionId) => {
    const sessionData = await grabTimesForStudySession(sessionId);
    const taskData = await getTasksForSession(sessionId);
    event.sender.send('return-session-data', sessionData, taskData);
  });

  ipcMain.on('full-session-metrics', async (event, duration, sessionId, newMetrics) => {
    if(newMetrics !== null) {
      await sessionMetricsData(sessionId, newMetrics, duration);
    }
    const avgedMetrics = await getAvgSessionMetrics();
    event.sender.send('return-metric-avgs', avgedMetrics);
  });

  ipcMain.on('error-msg', (_event, msg) => { //Lets the frontend create error popups
    showErrorPopup(msg);
  });

  ipcMain.on('deleteSession', async (_event, sessionId) => { //Lets the frontend create error popups
    deleteStudySession(sessionId);
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
  stopInfluxDb();
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