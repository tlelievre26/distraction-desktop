const { time } = require("console");
const { start } = require("repl");
require('dotenv').config();


const { currentTime, InfluxDB, Point } = require("@influxdata/influxdb-client");


const token = process.env.INFLUXDB_TOKEN;
const url = 'http://localhost:8086';
const client = new InfluxDB({url, token});
let org = `Distraction`;
let bucket = `WebsiteData`;


//Write Function
//Source is from Chrome API or OS 
//Must provide the application_name
//Must provide the current study session this entry is associaed with
//Inputs are Strings
const appData = (source,appName,currentSession) =>{
  let writeClient = client.getWriteApi(org, bucket, 's');
  
  let app = new Point('AppChange')
    .stringField('AppName',appName)
    .timestamp(currentTime.seconds())
    .stringField('Source', source)
    .tag('QuerySession',currentSession);
  writeClient.writePoint(app);

  console.log(`App added to InfluxDB: 
    Name: ${appName}, 
    Source: ${source}, 
    QuerySession: ${currentSession}, 
    Timestamp: ${currentTime.seconds()}`);
  //console.log(currentTime.seconds())
  writeClient.close();

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
        reject(error); // Reject the promise if an error occurs
      },
      complete: () => {
        resolve({ allTimes, allqueryIds, allStartTimes, allEndTimes }); // Resolve the promise once complete
      }
    });
  });
};


module.exports = { appData };

// Uses the query session and time gathered from the grab_time functions in order to 
const SpecificStudySessionProcessing = async (querySessionid) =>{

  try {
    // Await the result from grab_times
    const result = await grabTimesForStudySession(querySessionid);
    const timesOfSessions = result.allTimes;
    const idsOfSessions = result.allqueryIds;
    const startTimes = result.allStartTimes;
    const endTimes = result.allEndTimes;


    //console.log('Times of Sessions:', times_of_sessions);
    //console.log('Query IDs:', result.allqueryIds);
    SpecificStudySession(timesOfSessions[0], timesOfSessions[(timesOfSessions.length) - 1], idsOfSessions[0], startTimes[0], endTimes[0]);

  } catch (error) {
    console.error('Error:', error);
  }
};


const SpecificStudySession = async (startTime, endTime, idsOfSession, startTimes, endTimes) =>{

  time_of_current_session = currentTime.seconds(); 


  console.debug("Start Time of Session: " + new Date(startTime)); //Study Session Star ttimes
  console.debug("End Time of Session:" +new Date(endTime)); // End time of study session
  console.debug("Session ID:" + " " + idsOfSession); // id of study session
  console.debug("Start Time:" + " " + new Date(startTimes)); // all the measurements start times
  console.debug("End Time:" +" " + new Date(endTimes)); // all the end measurements end times


  let queryClient = client.getQueryApi(org);  

  const fluxQuery = ` from(bucket: "WebsiteData") |> range(start: ${startTime}, stop: ${endTime}) |> filter(fn: (r) => r._measurement == "AppChange")`;

  queryClient.queryRows(fluxQuery, {
    next: (row, tableMeta) => {
      const tableObject = tableMeta.toObject(row);
      console.log(tableObject); // the data that comes from the query
      // return the stuff in this tableObject 
    },
    error: (error) => {
      console.error('\nError', error);
    },
    complete: () => {
      console.log('\nSuccess');
    }
  });


};


/* Work on this 
async function grabTimesForApp (appName) {
  return new Promise((resolve, reject) => {
    const allTimes = []; // exact time of point
    const allqueryIds = []; // Associated Query Session ID of that point
    const allStartTimes = []; // When the measurement was started
    const allEndTimes = []; // When the measreuemnt was ended 


    // Get the current time
    const timeOfCurrentSession = currentTime.seconds();
    let queryClient = client.getQueryApi(org);
    let stringVersion = `-${timeOfCurrentSession.toString()}s`;

    // Construct the Flux query with the filter for the specific querySessionID
    const fluxQuery = ` from(bucket: "WebsiteData") |> range(start: ${stringVersion}) |> filter(fn: (r) => r.AppName == "${appName}")
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
        reject(error);
      },
      complete: () => {
        resolve({ allTimes, allqueryIds, allStartTimes, allEndTimes });
      }
    });
  });
};


// Uses the query session and time gathered from the grab_time functions in order to 
async function SpecificAppProcessing(appName){

  try {
    // Await the result from grab_times
    const result = await grabTimesForApp(appName);
    let times_of_sessions = result.allTimes;
    let ids_of_sessions = result.allqueryIds;
    let start_times = result.allStartTimes;
    let end_times = result.allEndTimes;

    console.log(ids_of_sessions);


    //console.log('Times of Sessions:', times_of_sessions);
    //console.log('Query IDs:', result.allqueryIds);
    //SpecificStudySession(times_of_sessions[0], times_of_sessions[(times_of_sessions.length) - 1], ids_of_sessions[0], start_times[0], end_times[0]);

  } catch (error) {
    console.error('Error:', error);
  }
}

*/

appData("Windows","Discord", 2);
SpecificStudySessionProcessing(2);
//SpecificAppProcessing("Discord");