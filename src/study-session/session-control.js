const { Worker } = require("worker_threads");
const path = require('path');
require('dotenv').config();

const { v4: uuidv4 } = require('uuid');

const log = require('../util/logger');
const { appData } = require("../api_recievers/influxqueries");
//const {auth} = require("../task_list/google_tasklist");

let winApiThread;
let sessionId;

const beginSession = (_event, _time) => {
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
  winApiThread.postMessage('end-session');
  winApiThread.on('exit', (code) => {
    log.debug('Worker exited with code ', code);
  });
  if(sessionId !== undefined && cleanSession) {
    //TODO:
    //We should prob have a function to clean all records with a certain session ID in case of failure
    //Don't want to leave a half-finished session in the DB
    //Also would just be useful for removing old timelines
    log.debug("Session ended unexpectedly, cleaning up data");
  }

  sessionId = undefined;
};

module.exports = {beginSession, endSession};