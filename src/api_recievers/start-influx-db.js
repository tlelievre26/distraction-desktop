const path = require("path");
const fs = require('fs');
const { spawn } = require("child_process");

const log = require('../util/logger');
const { connectToInflux } = require("./influxqueries");
const showErrorPopup = require("../util/error-popup");

let influxProcess = null;

const spawnInfluxProcess = (absPath) => {
  return new Promise((resolve, reject) => {
    const process = spawn('influxd', { cwd: absPath });
    process.on('spawn', () => {
      resolve(process);
    });
    process.on('error', (err) => {
      reject(err);
    });
  });

};

const startInfluxDb = async (influxPath, apiKey) => {

  if(influxProcess === null) {
    const absPath = path.resolve(influxPath);
    if (!fs.existsSync(absPath)) {
      log.error("Invalid path to influx DB");
      showErrorPopup(`Failed to spawn Influx DB process, invalid file path.`);
      return -1;
    }
  
    try {
      influxProcess = await spawnInfluxProcess(absPath);
    }
    catch(err) {
      log.error("Failed to start to Influx DB process");
      log.error(err);
      showErrorPopup(`Failed to spawn Influx DB process. Please ensure your file path is correct.`);
      return -1;
    }
  }


  try {
    const connSucc = await connectToInflux(apiKey);
    if(connSucc === false) {
      log.error("Failed to connect to Influx DB after 10 retries using API key ", apiKey);
      showErrorPopup(`Failed to connect to Influx DB process. Please ensure your API key is correct.`);
      return false;
    }
  }
  catch(err) {
    log.error("An error occured when attempting to connect to Influx DB");
    log.error(err);
    showErrorPopup(`Failed to connect to Influx DB process. Please ensure your API key is correct.`);
    return -1;
  }

  return 0;
};

const stopInfluxDb = () => {
  log.debug("Killing current InfluxDB process");
  if (influxProcess) {
    influxProcess.kill();
    influxProcess = null;
  }
};

module.exports = { startInfluxDb, stopInfluxDb };