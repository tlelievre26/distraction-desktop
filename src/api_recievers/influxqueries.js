const { time } = require("console");
const { start } = require("repl");

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
const appData = (source,app_name,current_session) =>{
  let writeClient = client.getWriteApi(org, bucket, 's');
  
  let app = new Point('AppChange').stringField('AppName',app_name).timestamp(currentTime.seconds()).stringField('Source', source).tag('QuerySession',current_session);
  writeClient.writePoint(app);
  console.log(`App added to InfluxDB: 
    Name: ${app_name}, 
    Source: ${source}, 
    QuerySession: ${current_session}, 
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
    const allEndTimes = []; // When the measreuemnt was ended 


    // Get the current time
    const timeOfCurrentSession = currentTime.seconds();
    let queryClient = client.getQueryApi(org);
    let stringVersion = `-${timeOfCurrentSession.toString()}s`;

    // Construct the Flux query with the filter for the specific querySessionID
    const fluxQuery = ` from(bucket: "WebsiteData") |> range(start: ${stringVersion}) |> filter(fn: (r) => r._measurement == "AppChange" and r.QuerySession == "${querySessionID}")
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


module.exports = { appData };

// Uses the query session and time gathered from the grab_time functions in order to 
async function SpecificStudySessionProcessing(querySessionid, start_time_of_study_session, stop_time_of_study_session){

  try {
    // Await the result from grab_times
    const result = await grabTimesForStudySession(querySessionid);
    let times_of_sessions = result.allTimes;
    let ids_of_sessions = result.allqueryIds;
    let start_times = result.allStartTimes;
    let end_times = result.allEndTimes;


    //console.log('Times of Sessions:', times_of_sessions);
    //console.log('Query IDs:', result.allqueryIds);
    SpecificStudySession(times_of_sessions[0], times_of_sessions[(times_of_sessions.length) - 1], ids_of_sessions[0], start_times[0], end_times[0]);

  } catch (error) {
    console.error('Error:', error);
  }
}

function SpecificStudySession(start_time, end_time, ids_of_sessions, start_times, end_times){

  time_of_current_session = currentTime.seconds(); 

  start_date = new Date(start_time);
  end_date = new Date(end_time);
  start_times = new Date(start_times);
  end_times = new Date(end_times);
  
  console.log("Start Time of Session: " + start_date);  
  console.log("End Time of Session:" + end_date);
  console.log("Session ID:" + " " + ids_of_sessions);
  console.log("Start Time:" + " " + start_times);
  console.log("End Time:" +" " + end_times);


  let queryClient = client.getQueryApi(org);

  let string_version = "-" + start_time;
  //console.log(string_version);
  

  const fluxQuery = ` from(bucket: "WebsiteData") |> range(start: ${start_time}, stop: ${end_time}) |> filter(fn: (r) => r._measurement == "AppChange")`;

  queryClient.queryRows(fluxQuery, {
    next: (row, tableMeta) => {
      const tableObject = tableMeta.toObject(row);
      //console.log(tableObject);
    },
    error: (error) => {
      console.error('\nError', error);
    },
    complete: () => {
      console.log('\nSuccess');
    }
  });


}







// Work on this 

const grabTimesForApp = (appName) => {
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

//appData("Windows","Discord", 2);
//SpecificStudySessionProcessing(2);
SpecificAppProcessing("Discord");