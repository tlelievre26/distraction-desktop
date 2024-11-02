const { log } = require("console");

const { connectToInflux } = require("./influxqueries");

const execStartCommand = (absPath) => {
  return new Promise((resolve, reject) => {
    exec('./influxd', { cwd: absPath }, (error, stdout, stderr) => {
      if (error) {
        log.error(`Error starting InfluxDB: ${error.message}`); // Failure: exec can fail if the command is invalid or if there's an issue executing it
        reject(error);
      }
      if (stderr) {
        log.error(`stderr: ${stderr}`); // Failure: stderr may contain errors from running the command
        reject(error);
      }
    });
  });
};

const startInfluxDb = async (influxPath, apiKey) => {
//If the user tries to change the influx path or API key while influx is already running this will probably break
//If we have time we can address that

  const absPath = path.resolve(influxPath);
  if (!fs.existsSync(absPath)) {
    throw(`The specified path does not exist: ${absPath}`);
  }

  await execStartCommand(absPath);
  await connectToInflux(apiKey);

};

module.exports = startInfluxDb;