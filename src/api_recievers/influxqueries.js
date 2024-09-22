const { currentTime, InfluxDB, Point } = require("@influxdata/influxdb-client")
const { time } = require("console")
const { start } = require("repl")


const token = process.env.INFLUXDB_TOKEN
const url = 'http://localhost:8086'
const client = new InfluxDB({url, token})
let org = `Distraction`
let bucket = `WebsiteData`




//Write Functions
//Source is from Chrome API or OS 
//Inputs are Strings

function AppData(source,app_name,current_session){
  let writeClient = client.getWriteApi(org, bucket, 's')
  
  let app = new Point('AppChange').stringField('AppName',app_name).timestamp(currentTime.seconds()).stringField('Source', source).tag('QuerySession',current_session)
  writeClient.writePoint(app)
  console.log(`App added to InfluxDB: 
    Name: ${app_name}, 
    Source: ${source}, 
    QuerySession: ${current_session}, 
    Timestamp: ${currentTime.seconds()}`);
  //console.log(currentTime.seconds())
  writeClient.close()

}


// Function that will extract the time and the query session associated with that time 
// Can add in the start and the end time of the measurement 
function grab_times(querySessionID) {
  return new Promise((resolve, reject) => {
    const allTimes = []; // exact time of point
    const allqueryIds = []; // Associated Query Session ID of that point
    const allStartTimes = []; // When the measurement was started
    const allEndTimes = []; // When the measreuemnt was ended 


    // Get the current time
    const time_of_current_session = currentTime.seconds();
    let queryClient = client.getQueryApi(org);
    let string_version = `-${time_of_current_session.toString()}s`;

    // Construct the Flux query with the filter for the specific querySessionID
    const fluxQuery = ` from(bucket: "WebsiteData") |> range(start: ${string_version}) |> filter(fn: (r) => r._measurement == "AppChange" and r.QuerySession == "${querySessionID}")
    `;

    queryClient.queryRows(fluxQuery, {
      next: (row, tableMeta) => {
        const tableObject = tableMeta.toObject(row);
        allTimes.push(tableObject._time);
        allqueryIds.push(tableObject.QuerySession);
        allStartTimes.push(tableObject._Start);
        allEndTimes.push(tableObject._End);
      },
      error: (error) => {
        reject(error);
      },
      complete: () => {
        resolve({ allTimes, allqueryIds, allStartTimes, allEndTimes });
      },
    });
  });
}


module.exports = { AppData };

// Uses the query session and time gathered from the grab_time functions in order to 
async function SpecificStudySessionProcessing(querySessionid, start_time_of_study_session, stop_time_of_study_session){

  try {
    // Await the result from grab_times
    const result = await grab_times(querySessionid);
    let times_of_sessions = result.allTimes;
    let ids_of_sessions = result.allqueryIds
    let start_times = result.StartTimes;
    let end_times = result.EndTimes
    //console.log('Times of Sessions:', times_of_sessions);
    //console.log('Query IDs:', result.allqueryIds);

    SpecificStudySession(times_of_sessions[0], times_of_sessions[times_of_sessions.length - 1])

  } catch (error) {
    console.error('Error:', error);
  }
}

function SpecificStudySession(start_time, end_time){

  time_of_current_session = currentTime.seconds() 

 console.log(start_time)
 console.log(Date(start_time))
 console.log(end_time)
 console.log(Date(end_time))



  let queryClient = client.getQueryApi(org)

  let string_version = "-" + start_time
  console.log(string_version)
 
  

  

const fluxQuery = ` from(bucket: "WebsiteData") |> range(start: ${start_time}, stop: ${end_time}) |> filter(fn: (r) => r._measurement == "AppChange")`;

queryClient.queryRows(fluxQuery, {
  next: (row, tableMeta) => {
    const tableObject = tableMeta.toObject(row);
     console.log(tableObject);
  },
  error: (error) => {
    console.error('\nError', error);
  },
  complete: () => {
    console.log('\nSuccess');
  },
});



}


AppData("Windows","Youtube", 2);
SpecificStudySessionProcessing(2)