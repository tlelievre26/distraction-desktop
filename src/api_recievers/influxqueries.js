// const { time } = require("console");
// const { start } = require("repl");
require('dotenv').config();

const { currentTime, InfluxDB, Point } = require("@influxdata/influxdb-client");

const log = require('../util/logger');


const token = process.env.INFLUXDB_TOKEN;
const url = `http://localhost:${process.env.DB_PORT ?? 8086}`;
const client = new InfluxDB({url, token});
let org = process.env.INFLUX_ORG ?? "Distraction";
let bucket = process.env.INFLUX_BUCKET ?? "WebsiteData";
let bucketStudySession = process.env.INFLUX_BUCKET_2 ?? "StudySessionData";
let write = process.env.DB_WRITE ?? 'true';


//Track the name of the previously written app, just to prevent accidental duplicate events
let prevAppName = undefined;

//Write Function
//Source is from Chrome API or OS 
//Must provide the application_name
//Must provide the current study session this entry is associaed with
//Inputs are Strings
const appData = async (source, appName, currentSession) =>{

  if(write === 'true' && (prevAppName === undefined || prevAppName !== appName)) {
    log.debug("Writing to db");
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
    const allAppNames = []; 
    const allObjects = [];

    // Get the current time
    const timeOfCurrentSession = currentTime.seconds();
    let queryClient = client.getQueryApi(org);
    let stringVersion = `-${timeOfCurrentSession.toString()}s`;

    // Construct the Flux query with the filter for the specific querySessionID
    const fluxQuery = `
      from(bucket: "WebsiteData")
      |> range(start: ${stringVersion})
      |> filter(fn: (r) => r._measurement == "AppChange" and r.QuerySession == "${querySessionID}")
      |> filter(fn: (r) => r._field == "AppName")
    `;


    queryClient.queryRows(fluxQuery, {
      next: (row, tableMeta) => {
        const tableObject = tableMeta.toObject(row);
        //console.log(tableObject);
        allTimes.push(tableObject._time);
        allqueryIds.push(tableObject.QuerySession);
        allStartTimes.push(tableObject._start);
        allEndTimes.push(tableObject._stop);
        allAppNames.push(tableObject._value);
        allObjects.push(tableObject);
      },
      error: (error) => {
        log.error(error);
        reject(error); // Reject the promise if an error occurs
      },
      complete: () => {
        resolve({ allTimes, allqueryIds, allStartTimes, allEndTimes, allAppNames, allObjects }); // Resolve the promise once complete
      }
    });
  });
};


const SpecificStudySessionProcessing = async (querySessionid) => {
  try {
    const result = await grabTimesForStudySession(querySessionid);
    
    const timesOfSessions = result.allTimes;
    const idsOfSessions = result.allqueryIds;
    const startTimes = result.allStartTimes;
    const endTimes = result.allEndTimes;
    const nameOfSession = result.appAppNames;
    const Objects = result.allObjects;


    const sessionData = {
      startTime: timesOfSessions,
      endTime: timesOfSessions[timesOfSessions.length - 1],
      sessionId: idsOfSessions,
      startTimes: startTimes,
      endTimes: endTimes,
      nameOfSession: nameOfSession,
      Objects: Objects
    };
    

    return sessionData;
  } catch (error) {
    log.error(error);
    throw error;
  }
};


/*const SpecificStudySession = async (startTime, endTime, idsOfSession, startTimes, endTimes) =>{

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

*/


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
    const fluxQuery = `
              from(bucket: "WebsiteData") 
              |> range(start: ${stringVersion})
              |> filter(fn: (r) => r._measurement == "AppChange")
              |> filter(fn: (r) => r._field == "AppName")
              |> filter(fn: (r) => r._value == "${appName}")`;

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


// Write into previous study sessions
const insertStudySessionData = (id, startTime, endTime, duration) =>{
 
  let writeClientStudy = client.getWriteApi(org, bucketStudySession, 's');

  let studySessionHistory = new Point('studySession')
    .tag('sessionId', id) // ID of study sesssion we are saving
    .intField('startTime', startTime) // Start time of study session
    .intField('endTime', endTime)  //End time of study session
    .intField('duration', duration)
    .timestamp(currentTime.seconds()); // Time you pushed a new study session in
  
  try {
    writeClientStudy.writePoint(studySessionHistory);
      
  }
  catch (error) {
    log.error(error);
    throw error;
  }
  
  log.debug(`Study Session added to InfluxDB: 
      ID: ${id}, 
      StartTime: ${startTime}, 
      EndTime: ${endTime}, 
      Timestamp: ${currentTime.seconds()}`);

};


//Query out just all the IDs to choose from
const grabAllPreviousStudySessionIDs = () => {
  return new Promise((resolve, reject) => {

    const prevSessions = [];

    let queryClient = client.getQueryApi(org);
    const timeOfCurrentSession = currentTime.seconds();
    let stringVersion = `-${timeOfCurrentSession.toString()}s`;

    // Construct the Flux query with the filter for the specific querySessionID
    const fluxQuery = ` 
      from(bucket: "StudySessionData")
      |> range(start: ${stringVersion})
      |> filter(fn: (r) => r._measurement == "studySession")
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> group(columns: ["sessionId"])
      |> keep(columns: ["duration", "sessionId", "endTime", "startTime"])
    `;

    queryClient.queryRows(fluxQuery, {
      next: (row, tableMeta) => {
        const tableObject = tableMeta.toObject(row);
        prevSessions.push(tableObject);
      },
      error: (error) => {
        log.error(error);
        reject(error); // Reject the promise if an error occurs
      },
      complete: () => {
        resolve(prevSessions); // Resolve the promise once complete
      }
    });
  });
};


// const AllStudySessionProcessing = async () => {
//   try {
//     const result = await grabAllPreviousStudySessionIDs();
    
//     const idsOfSessions = result.allQueryIds;
//     const startTimes = result.allStartTimes;
//     const endTimes = result.allEndTimes;


//     const sessionData = {
//       sessionId: idsOfSessions,
//       startTimes: startTimes,
//       endTimes: endTimes
//     };
    
//     return sessionData;
//   } catch (error) {
//     log.error(error);
//     throw error;
//   }
// };

module.exports = { appData, SpecificStudySessionProcessing, grabTimesForApp, insertStudySessionData, grabAllPreviousStudySessionIDs};