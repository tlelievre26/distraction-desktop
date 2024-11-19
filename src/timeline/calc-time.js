//Converts influxdb time to a readable format
const convertTime = (data) => {
  data.forEach((element, index) => {
    date = new Date(element._time);
    data[index]["_timeInSeconds"] = date.getUTCSeconds() + date.getUTCMinutes() * 60 + date.getUTCHours() * 3600;

  });
};

const getTimeSpent = (time) => {
  time.forEach((element, index, arr) => {
    time[index]["_timeSpent"]= index + 1 < arr.length ? arr[index+1]._timeInSeconds - element._timeInSeconds : 0;
  });
};

module.exports = {convertTime, getTimeSpent};