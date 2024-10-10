const { Worker } = require("worker_threads");
const path = require('path');

const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');

const log = require('../util/logger');
const { appData } = require("../api_recievers/influxqueries");

let winApiThread;
let sessionId;
let wss;

const beginSession = (event, _time) => {
  createWebsocket(event);

  sessionId = uuidv4();
  log.debug("Beginning session with ID " + sessionId);

  winApiThread = new Worker(path.join(__dirname, "../collector/focus-event.js"));
  winApiThread.on('message', async (windowTitle) => {
    log.debug('Active window title:', windowTitle);
    await appData("Windows", windowTitle, sessionId);
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
  webContents.send('test');

  log.debug("Successfully created WebSocketServer on port 8090");
  wss.on('connection', (ws) => {
    webContents.send('extension-status', true);

    ws.on('error', log.error);
  
    ws.on('message', (data) => {
      log.debug('received: ', data);
    });

    ws.on('close', () => {
      log.debug("Connection closed");
      webContents.send('extension-status', true);
    });

    ws.send('something');
  });
};

const closeWebsocket = () => {
  log.debug("Closing WebSocket server");
  wss.clients.forEach((ws) => ws.send('Closing'));
  wss.close();
};

module.exports = {beginSession, endSession };