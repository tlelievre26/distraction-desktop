const path = require("path");
const fs = require('fs');
const { spawn } = require("child_process");

const log = require('../util/logger');
const { connectToInflux } = require("./influxqueries");
const showErrorPopup = require("../util/error-popup");

let influxProcess = null;

const startInfluxDb = async (influxPath, apiKey) => {
//If the user tries to change the influx path or API key while influx is already running this will probably break
//If we have time we can address that

  const absPath = path.resolve(influxPath);
  if (!fs.existsSync(absPath)) {
    throw(`The specified path does not exist: ${absPath}`);
  }


  influxProcess = spawn('influxd', { cwd: absPath });
  influxProcess.on('error', (err) => {
    log.error("Failed to start to Influx DB process");
    log.error(err);
    showErrorPopup(`Failed to start to Influx DB process. Please ensure your filepath is correct, and that influxDB is not already running`);
    throw err;
  });

  try {
    connectToInflux(apiKey);
    log.debug("Successfuly connected to influxDB");
  }
  catch(err) {
    log.error("Failed to connect to Influx DB");
    log.error(err);
    showErrorPopup(`Failed to connect to Influx DB process. Please ensure your API key is correct.`);
    throw err;
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