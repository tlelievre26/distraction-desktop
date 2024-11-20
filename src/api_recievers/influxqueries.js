require('dotenv').config();

const { currentTime, InfluxDB, Point } = require("@influxdata/influxdb-client");
const { BucketsAPI, OrgsAPI } = require('@influxdata/influxdb-client-apis');

const log = require('../util/logger');

let influxClient;
let org = process.env.INFLUX_ORG ?? "Distraction";
let write = process.env.DB_WRITE ?? 'true';
//Track the name of the previously written app, just to prevent accidental duplicate events
let prevAppName = undefined;

const influxBuckets = Object.freeze({ //Acts like an enum for our buckets
  apps: "WebsiteData",
  sessions: "StudySessionData",
  tasks: "TaskData",
  metrics: "SessionMetricsData"
});

const checkExistingBuckets = async (bucketAPI) => {
  //Kill 2 birds with one stone here, this endpoint makes sure the auth key is right and that the DB is running
  //We also need to check which buckets we have anyways, so it's convenient to do both at once
  try {
    const currBuckets = await bucketAPI.getBuckets();
    return currBuckets.buckets.map((bucket) => bucket.name);
  }
  catch (error) {
    //If the DB hasn't booted up yet this throws an error that we ignore
    //If it returns but says we don't have access then we give the user an error saying the API key is invalid
    if(error.statusCode === 401) {
      log.error(error);
      return null;
    }
    throw error;
  }
};

const initBuckets = async (currBuckets, bucketAPI) => {
  const orgsAPI = new OrgsAPI(influxClient);
  const organizations = await orgsAPI.getOrgs({org});
  const orgID = organizations.orgs[0].id;
  const ourBuckets = Object.values(influxBuckets);
  ourBuckets.forEach(async (bucket) => {
    if (!currBuckets.includes(bucket)) {
      const newBucket = await bucketAPI.postBuckets({body: {orgID, name: bucket}});
      log.debug("Successfully created new bucket ", newBucket);
    }
  });
};

//Moved this into it's own function so we initiate the connection on startup rather than at the start of a session
const connectToInflux = async (apiKey) => {
  const url = `http://localhost:${process.env.DB_PORT ?? 8086}`;
  influxClient = new InfluxDB({url, token: apiKey});
  const bucketAPI = new BucketsAPI(influxClient);
  let currBuckets;
  //Thx chatgpt for this one
  //Basically pings the server until it's running to check the API key works
  //Tries to connect 10 times with a 1 sec delay between attempts
  for (let attempt = 1; attempt <= 10; attempt++) {

    try {
      // eslint-disable-next-line no-await-in-loop
      currBuckets = await checkExistingBuckets(bucketAPI);
      if (currBuckets !== null)  {
        initBuckets(currBuckets, bucketAPI);
        return true; // Connection successful
      }
      else {
        log.debug(`Invalid API Key`);
        return false;
      }
    }
    catch {
      //If the DB isn't running yet
      log.debug(`Failed to connect to InfluxDB after ${attempt} tries, retrying`);
    }

    // Wait before the next retry
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false; // InfluxDB didn't become ready within the retry limit
};

//Write Function
//Source is from Chrome API or OS 
//Must provide the application_name
//Must provide the current study session this entry is associaed with
//Inputs are Strings
const appData = async (source, appName, currentSession) =>{
  if(write === 'true' && (prevAppName === undefined || prevAppName !== appName)) {
    log.debug("Writing to db");
    let writeClient = influxClient.getWriteApi(org, influxBuckets.apps, 's');

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

const taskData = async(completed, taskName, currentSession) => {
  if(write === 'true') {
    log.debug("Writing to db");
    let writeClient = influxClient.getWriteApi(org, influxBuckets.tasks, 's');

    let app = new Point('TaskMarked')
      .stringField('TaskName',taskName)
      .timestamp(currentTime.seconds())
      .stringField('Completed', completed) //If false then user must have started the task
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
      Completed: ${completed}, 
      QuerySession: ${currentSession}, 
      Timestamp: ${currentTime.seconds()}`);
    
    await writeClient.close();
  }
};

const taskData = async(completed, taskName, currentSession) => {
  if(write === 'true') {
    log.debug("Writing to db");
    let writeClient = influxClient.getWriteApi(org, influxBuckets.tasks, 's');


    let app = new Point('TaskMarked')
      .stringField('TaskName',taskName)
      .timestamp(currentTime.seconds())
      .stringField('Completed', completed) //If false then user must have started the task
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
      Completed: ${completed}, 
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
    let queryClient = influxClient.getQueryApi(org);
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


const grabTimesForApp = (appName) => {
  return new Promise((resolve, reject) => {
    const allTimes = []; // exact time of point
    const allqueryIds = []; // Associated Query Session ID of that point
    const allStartTimes = []; // When the measurement was started
    const allEndTimes = []; // When the measurement was ended

    // Get the current time
    const timeOfCurrentSession = currentTime.seconds();
    let queryClient = influxClient.getQueryApi(org);
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
 
  let writeClientStudy = influxClient.getWriteApi(org, influxBuckets.sessions, 's');

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
    let queryClient = influxClient.getQueryApi(org);
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



module.exports = { appData, SpecificStudySessionProcessing, taskData, grabTimesForApp, insertStudySessionData, grabAllPreviousStudySessionIDs, connectToInflux };

