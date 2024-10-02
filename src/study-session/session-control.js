//Just including this file as an example so that git tracks the directory structure

const { Worker } = require("worker_threads");
const path = require('path');

const log = require('../util/logger');

let winApiThread;

exports.beginSession = (_event, _time) => {
  log.debug("Beginning data gathering");

  winApiThread = new Worker(path.join(__dirname, "../collector/focus-event.js"));
  winApiThread.on('message', (windowTitle) => {
    console.log('Active window title:', windowTitle);

  });
  winApiThread.postMessage("Hi!");


};

exports.endSession = (_event) => {
  log.debug("Ending data gathering");
  winApiThread.postMessage('end-session');
  winApiThread.on('exit', (code) => {
    console.log('Worker exited with code ', code);

  });
};
