//Converts influxdb time to a readable format
const convertTime = (data) => {
  return data.map((element) => {
    date = new Date(element._time);
    return date.getUTCSeconds() + date.getUTCMinutes() * 60 + date.getUTCHours() * 3600;
  });
};

const getTimeSpent = (time) => {
  const timeConversion = time.map((element, index, arr) => {
    if (index + 1 < arr.length) {
      const endTime = arr[index+1];
      return endTime - element;
    }
    return 0;
  });
  return timeConversion;
};


module.exports = {convertTime, getTimeSpent};