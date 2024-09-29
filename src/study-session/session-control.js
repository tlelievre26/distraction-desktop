//Just including this file as an example so that git tracks the directory structure

const { Worker } = require("worker_threads");
const path = require('path');

const log = require('../util/logger');

exports.beginSession = (_event, _time) => {
  log.debug("Beginning data gathering");
  try {
    const winApiThread = new Worker(path.join(__dirname, "../collector/focus-event.js"));
    winApiThread.on('message', (windowTitle) => {
      console.log('Active window title:', windowTitle);
      // insertWindowName(windowTitle);  // Insert into the database asynchronously
    });
  }
  catch (error) {
    console.error(error);
    throw error;
  }


};

exports.endSession = (_event) => {
  log.debug("Ending data gathering");
};
