const { Worker } = require("worker_threads");
const path = require('path');

const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');

const log = require('../util/logger');
const { appData } = require("../api_recievers/influxqueries");

let winApiThread;
let sessionId;
let wss;

let connected = false; //Represents if the Chrome Ext has connected to the WSS

const beginSession = (event, _time) => {
  createWebsocket(event);

  sessionId = uuidv4();

  const webContents = event.sender;
  webContents.send('session-id', sessionId);

  log.debug("Beginning session with ID " + sessionId);
  winApiThread = new Worker(path.join(__dirname, "../collector/focus-event.js"));
  winApiThread.on('message', async (windowTitle) => {
    log.debug('Active window title:', windowTitle);
    if(connected && !windowTitle.includes("Google Chrome")) { //Don't want to register switching to Chrome if the connection is sending data
      await appData("Windows", windowTitle, sessionId);
    }

  });

  winApiThread.on('error', (err) => {
    log.error(err);
    //Probably should do something on the frontend for this
    endSession(null, sessionId);
  });
};

const endSession = (_event, cleanSession) => {
  log.debug("Ending data gathering");
  if(sessionId !== undefined && cleanSession) {
    winApiThread.postMessage('end-session');
    winApiThread.on('exit', (code) => {
      log.debug('Worker exited with code ', code);
    });
    //TODO:
    //We should prob have a function to clean all records with a certain session ID in case of failure
    //Don't want to leave a half-finished session in the DB
    //Also would just be useful for removing old timelines
    log.debug("Session ended unexpectedly, cleaning up data");
    
    sessionId = undefined;
    closeWebsocket();
  }
  return;
};


const createWebsocket = (event) => {
  wss = new WebSocketServer({ port: 8090 });
  const webContents = event.sender;

  log.debug("Successfully created WebSocketServer on port 8090");
  wss.on('connection', (ws) => {
    connected = true;
    webContents.send('extension-status', true);

    ws.on('error', log.error);
  
    ws.on('message', async (event) => {
      if(event.toString() !== 'keepalive') {
        const tabData = JSON.parse(event.toString());
        if(tabData.url !== undefined && tabData.url !== '') {
          const parseUrl = tabData.url.match(/https?:\/\/(www\.)?([^\/]+)/);
          let urlRoot;
          if(parseUrl.length >= 2) { //So it doesn't break for non http URLs
            urlRoot = parseUrl[2];
            log.debug('Active tab: ', urlRoot);
            await appData("Chrome", urlRoot, sessionId);
          }
        }
      }
    });

    ws.on('close', () => {
      log.debug("Connection closed");
      webContents.send('extension-status', true);
      connected = false;
    });

    ws.send('something');
  });
};

const closeWebsocket = () => {
  log.debug("Closing WebSocket server");
  wss.clients.forEach((ws) => ws.send('Closing'));
  wss.close();
  connected = false;
};

module.exports = {beginSession, endSession };
