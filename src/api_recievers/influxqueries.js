require('dotenv').config();

const { currentTime, InfluxDB, Point } = require("@influxdata/influxdb-client");
const { BucketsAPI, OrgsAPI, DeleteAPI } = require('@influxdata/influxdb-client-apis');

const log = require('../util/logger');

let influxClient;
let org = process.env.INFLUX_ORG ?? "Distraction";
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
  if((prevAppName === undefined || prevAppName !== appName)) {

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

  log.debug(`Task added to InfluxDB: 
    Name: ${taskName}, 
    Complete: ${completed},
    QuerySession: ${currentSession}, 
    Timestamp: ${currentTime.seconds()}`);
    
  await writeClient.close();

};

const sessionMetricsData = async (sessionId, totalSessionMetrics, duration) => {
  let writeClient = influxClient.getWriteApi(org, influxBuckets.metrics, 's');

  let metrics = new Point('SessionMetrics')
    .intField('duration', duration)
    .intField('numTasks', totalSessionMetrics.numTasks)
    .floatField('switchRate', totalSessionMetrics.switchRate)
    .intField('numApps', totalSessionMetrics.numApps)
    .intField('numSites', totalSessionMetrics.numSites)
    .timestamp(currentTime.seconds())
    .tag('QuerySession',sessionId);

  try {
    writeClient.writePoint(metrics);
        
  }
  catch (error) {
    log.error(error);
    throw error;
  }

  log.debug(`SessionMetrics added to InfluxDB: 
    SessionId: ${sessionId}, 
    duration: ${duration},
    numTasks: ${totalSessionMetrics.numTasks}, 
    switchRate: ${totalSessionMetrics.switchRate},
    numApps: ${totalSessionMetrics.numApps},
    numSites: ${totalSessionMetrics.numSites},
    Timestamp: ${currentTime.seconds()}`);

  await writeClient.close();
};

// Function that will extract the time and the query session associated with that time 
// Can add in the start and the end time of the measurement 
const grabTimesForStudySession = (querySessionID) => {
  return new Promise((resolve, reject) => {
    const appUsageData = [];

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
      |> keep(columns: ["_time", "_value"])
    `;


    queryClient.queryRows(fluxQuery, {
      next: (row, tableMeta) => {
        const tableObject = tableMeta.toObject(row);
        //console.log(tableObject);
        appUsageData.push(tableObject);
      },
      error: (error) => {
        log.error(error);
        reject(error); // Reject the promise if an error occurs
      },
      complete: () => {
        resolve(appUsageData); // Resolve the promise once complete
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

// Write into previous study sessions
const insertStudySessionData = async (id, startTime, endTime, duration) =>{
 
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

  await writeClientStudy.close();
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

const getTasksForSession = (sessionId) => {
  return new Promise((resolve, reject) => {

    const taskData = []; 
    let queryClient = influxClient.getQueryApi(org);
    const timeOfCurrentSession = currentTime.seconds();
    let stringVersion = `-${timeOfCurrentSession.toString()}s`;

    // Construct the Flux query with the filter for the specific querySessionID
    const fluxQuery = ` 
      from(bucket: "TaskData")
      |> range(start: ${stringVersion})
      |> filter(fn: (r) => r._measurement == "TaskMarked" and r.QuerySession == "${sessionId}")
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> keep(columns: ["_time", "TaskName", "Completed"])
    `;

    queryClient.queryRows(fluxQuery, {
      next: (row, tableMeta) => {
        const tableObject = tableMeta.toObject(row);
        taskData.push(tableObject);
      },
      error: (error) => {
        log.error(error);
        reject(error); // Reject the promise if an error occurs
      },
      complete: () => {
        resolve(taskData); // Resolve the promise once complete
      }
    });
  });
};


const deleteStudySession = async (sessionId) => {
  const deleteAPI = new DeleteAPI(influxClient);

  const start = '1970-01-01T00:00:00Z'; // Start of the range (earliest possible time)
  const stop = new Date().toISOString(); // End of the range (now)
  const deleteKey = `_measurement="AppChange" OR _measurement="studySession" AND QuerySession == ${sessionId}`;
  let prevSessionDeleted = null; // Initialize outside the loop


  try {
    await Promise.all(
      Object.values(influxBuckets).map(async (bucket) => {
        await deleteAPI.postDelete({
          org,
          bucket,
          body: {
            start,
            stop,
            deleteKey
          },
          headers
        });

        prevSessionDeleted = sessionId;

        console.log(`You have just deleted the session associated with the ID ${sessionId}`);

      })
    );
  } catch (error) {
    if (prevSessionDeleted !== sessionId) {
      console.error(`Failed to delete session with ID ${sessionId}. Reason: ${error.message}`);
      throw error; 
    } else {
      console.warn(`The session with ID ${sessionId} was already deleted.`);
    }
  }
};

const getAvgSessionMetrics = () => {
  return new Promise((resolve, reject) => {
    let avgData;
    let queryClient = influxClient.getQueryApi(org);
    const timeOfCurrentSession = currentTime.seconds();
    let stringVersion = `-${timeOfCurrentSession.toString()}s`;

    // Turns out we can't do averages over both floats and ints at once so I need two seperate queries
    // Ty chatgpt for helping write this
    const avgQuery = `
    intAvgs = from(bucket: "SessionMetricsData")
      |> range(start: ${stringVersion})
      |> filter(fn: (r) => r._measurement == "SessionMetrics")
      |> filter(fn: (r) => r._field == "duration" or r._field == "numTasks" or r._field == "numApps" or r._field == "numSites")
      |> group(columns: ["_field"])
      |> mean()



    floatAvgs = from(bucket: "SessionMetricsData")
      |> range(start: ${stringVersion})
      |> filter(fn: (r) => r._measurement == "SessionMetrics")
      |> filter(fn: (r) => r._field == "switchRate")
      |> group(columns: ["_field"])
      |> mean()



    union(tables: [intAvgs, floatAvgs])
        |> group()
        |> pivot(rowKey:["_start"], columnKey: ["_field"], valueColumn: "_value")`;

    queryClient.queryRows(avgQuery, {
      next: (row, tableMeta) => {
        const tableObject = tableMeta.toObject(row);
        avgData = tableObject;
      },
      error: (error) => {
        log.error(error);
        reject(error); // Reject the promise if an error occurs
      },
      complete: () => {
        resolve(avgData); // Resolve the promise once complete
      }
    });
  });

};

module.exports = { appData, SpecificStudySessionProcessing, taskData, grabTimesForStudySession, grabTimesForApp, insertStudySessionData, grabAllPreviousStudySessionIDs, connectToInflux, deleteStudySession, sessionMetricsData, getAvgSessionMetrics };