// const { time } = require("console");
// const { start } = require("repl");
require('dotenv').config();

const { currentTime, InfluxDB, Point } = require("@influxdata/influxdb-client");

const log = require('../util/logger');


const token = process.env.INFLUXDB_TOKEN;
const url = `http://localhost:${process.env.DB_PORT}`;
const client = new InfluxDB({url, token});
let org = process.env.INFLUX_ORG;
let bucket = process.env.INFLUX_BUCKET;


//Track the name of the previously written app, just to prevent accidental duplicate events
let prevAppName;

//Write Function
//Source is from Chrome API or OS 
//Must provide the application_name
//Must provide the current study session this entry is associaed with
//Inputs are Strings
const appData = async (source, appName, currentSession) =>{

  if(prevAppName === undefined || prevAppName !== appName) {
    let writeClient = client.getWriteApi(org, bucket, 's');

    let app = new Point('AppChange')
      .stringField('AppName',appName)
      .timestamp(currentTime.seconds())
      .stringField('Source', source)
      .tag('QuerySession',currentSession);
  
    try {
      writeClient.writePoint(app);
    }
    catch (error) {
      log.error(error);
      throw error;
    }
  
    prevAppName = appName;
    log.debug(`App added to InfluxDB: 
      Name: ${appName}, 
      Source: ${source}, 
      QuerySession: ${currentSession}, 
      Timestamp: ${currentTime.seconds()}`);
    
    await writeClient.close();
  }

};

// Function that will extract the time and the query session associated with that time 
// Can add in the start and the end time of the measurement 
const grabTimesForStudySession = (querySessionID) => {
  return new Promise((resolve, reject) => {
    const allTimes = []; // exact time of point
    const allqueryIds = []; // Associated Query Session ID of that point
    const allStartTimes = []; // When the measurement was started
    const allEndTimes = []; // When the measurement was ended

    // Get the current time
    const timeOfCurrentSession = currentTime.seconds();
    let queryClient = client.getQueryApi(org);
    let stringVersion = `-${timeOfCurrentSession.toString()}s`;

    // Construct the Flux query with the filter for the specific querySessionID
    const fluxQuery = `
      from(bucket: "WebsiteData")
      |> range(start: ${stringVersion})
      |> filter(fn: (r) => r._measurement == "AppChange" and r.QuerySession == "${querySessionID}")
    `;

    queryClient.queryRows(fluxQuery, {
      next: (row, tableMeta) => {
        const tableObject = tableMeta.toObject(row);
        allTimes.push(tableObject._time);
        allqueryIds.push(tableObject.QuerySession);
        allStartTimes.push(tableObject._start);
        allEndTimes.push(tableObject._stop);
      },
      error: (error) => {
        log.error(error);
        reject(error); // Reject the promise if an error occurs
      },
      complete: () => {
        resolve({ allTimes, allqueryIds, allStartTimes, allEndTimes }); // Resolve the promise once complete
      }
    });
  });
};

// Uses the query session and time gathered from the grab_time functions in order to 
const SpecificStudySessionProcessing = async (querySessionid) =>{

  try {
    // Await the result from grab_times
    const result = await grabTimesForStudySession(querySessionid);
    log.debug(result);
    const timesOfSessions = result.allTimes;
    const idsOfSessions = result.allqueryIds;
    const startTimes = result.allStartTimes;
    const endTimes = result.allEndTimes;


    //console.log('Times of Sessions:', times_of_sessions);
    //console.log('Query IDs:', result.allqueryIds);
    SpecificStudySession(timesOfSessions[0], timesOfSessions[(timesOfSessions.length) - 1], idsOfSessions[0], startTimes[0], endTimes[0]);

  } catch (error) {
    log.error(error);
  }
};


const SpecificStudySession = async (startTime, endTime, idsOfSession, startTimes, endTimes) =>{

  timeOfCurrentSession = currentTime.seconds(); 


  log.debug("Start Time of Session: " + new Date(startTime)); //Study Session Star ttimes
  log.debug("End Time of Session:" +new Date(endTime)); // End time of study session
  log.debug("Session ID:" + " " + idsOfSession); // id of study session
  log.debug("Start Time:" + " " + new Date(startTimes)); // all the measurements start times
  log.debug("End Time:" +" " + new Date(endTimes)); // all the end measurements end times


  let queryClient = client.getQueryApi(org);  

  const fluxQuery = ` from(bucket: "WebsiteData") |> range(start: ${startTime}, stop: ${endTime}) |> filter(fn: (r) => r._measurement == "AppChange")`;

  queryClient.queryRows(fluxQuery, {
    next: (row, tableMeta) => {
      const tableObject = tableMeta.toObject(row);
      log.debug(tableObject); // the data that comes from the query
      // return the stuff in this tableObject 
    },
    error: (error) => {
      log.error('\nError', error);
    },
    complete: () => {
      log.debug('\nSuccess');
    }
  });


};


const grabTimesForApp = (appName) => {
  return new Promise((resolve, reject) => {
    const allTimes = []; // exact time of point
    const allqueryIds = []; // Associated Query Session ID of that point
    const allStartTimes = []; // When the measurement was started
    const allEndTimes = []; // When the measurement was ended

    // Get the current time
    const timeOfCurrentSession = currentTime.seconds();
    let queryClient = client.getQueryApi(org);
    let stringVersion = `-${timeOfCurrentSession.toString()}s`;

    // Construct the Flux query with the filter for the specific querySessionID
    const fluxQuery = `from(bucket: "WebsiteData")  |> range(start: ${stringVersion}) |> filter(fn: (r) => r._measurement == "AppChange") |> filter(fn: (r) => r._field == "AppName") |> filter(fn: (r) => r._value == "${appName}")`;

    queryClient.queryRows(fluxQuery, {
      next: (row, tableMeta) => {
        const tableObject = tableMeta.toObject(row);
        log.debug(tableObject);
        allTimes.push(tableObject._time);
        allqueryIds.push(tableObject.QuerySession);
        allStartTimes.push(tableObject._start);
        allEndTimes.push(tableObject._stop);
      },
      error: (error) => {
        log.error(error);
        reject(error); // Reject the promise if an error occurs
      },
      complete: () => {
        resolve({ allTimes, allqueryIds, allStartTimes, allEndTimes }); // Resolve the promise once complete
      }
    });
  });
};

module.exports = { appData, SpecificStudySessionProcessing, grabTimesForApp  };
