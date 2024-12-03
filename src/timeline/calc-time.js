//Converts influxdb time to a readable format
const convertTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.getUTCSeconds() + date.getUTCMinutes() * 60 + date.getUTCHours() * 3600;
};

const getTimeSpent = (time, duration) => {
  let initDuration = duration;

  time.forEach((element, index, arr) => {
    time[index]["_timeSpent"] = index + 1 < arr.length ? arr[index+1]._timeInSeconds - element._timeInSeconds : initDuration;
    initDuration -= time[index]["_timeSpent"];
  });
};

const getTaskTimeSpent = (tasks, startTime, endTime) => {
  // Do a bunch of processing to make the task display easier
  // This is so clunky but idrc at this point
  // God this function is ugly though
  const newTasks = [];
  let currTask = null;
  tasks.forEach((element, index, arr) => {

    if(index === 0 && (element["Completed"] === "unstarred" || element["Completed"] === "completed")) {
      const startTask = {
        "duration": tasks[index]["_timeInSeconds"] - startTime,
        "offset": 0,
        "status": element.Completed === "unstarred" ? "Incomplete" : "Complete",
        "name": element.TaskName
      };
      newTasks.push(startTask);
    }
    else if(index === arr.length - 1 && element["Completed"] === "starred") {
      const finalTask = {
        "duration": endTime - element["_timeInSeconds"],
        "offset": element["_timeInSeconds"] - startTime,
        "status": "Incomplete",
        "name": element.TaskName
      };
      newTasks.push(finalTask);
    }
    else {
      if(element["Completed"] === "starred") {
        if(currTask !== null) {
          currTask.status = "Incomplete";
          currTask.duration = element["_timeInSeconds"] - (currTask.offset + startTime);
          newTasks.push(currTask);
        }
        currTask = {
          "offset": element["_timeInSeconds"] - startTime,
          "name": element.TaskName
        };

      }
      else {
        //Unstar task without completing it
        currTask.status = element.Completed === "unstarred" ? "Incomplete" : "Complete";
        currTask.duration = element["_timeInSeconds"] - (currTask.offset + startTime);
        newTasks.push(currTask);
        currTask = null;
      }
    }
  });

  return newTasks;
};

module.exports = {convertTime, getTimeSpent, getTaskTimeSpent};