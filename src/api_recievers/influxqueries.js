import {currentTime, InfluxDB, Point} from '@influxdata/influxdb-client'



const token = process.env.INFLUXDB_TOKEN
const url = 'http://localhost:8086'

const client = new InfluxDB({url, token})

// Organization and Buckets
let org = `Distraction`
let bucket = `sampledata`



//Write Functions

function writeData(Farenheight_reading){
  let writeClient = client.getWriteApi(org, bucket, 'ns')
  //a Point represents a single data record
  let weather = new Point('CurrentTempinF').tag('Farenheight','temperature').timestamp(currentTime).intField('field1', Farenheight_reading)
  writeClient.writePoint(weather)
}


function readData(){


let queryClient = client.getQueryApi(org)
let fluxQuery = `from(bucket: "sampledata")
 |> range(start: -10m)
 |> filter(fn: (r) => r._measurement == "CurrentTempinF" and r.location == "Farenheight")`

queryClient.queryRows(fluxQuery, {
  next: (row, tableMeta) => {
    const tableObject = tableMeta.toObject(row)
    console.log(tableObject)
  },
  error: (error) => {
    console.error('\nError', error)
  },
  complete: () => {
    console.log('\nSuccess')
  },
})

}



writeData(60);
readData();

