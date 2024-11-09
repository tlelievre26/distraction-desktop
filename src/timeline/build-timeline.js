/* eslint-disable no-console */

const calcMetrics = (data, duration, numTasksCompleted, sessionId) => {

  const uniqueValues = [...new Set(data.map(item => item._value))];
  const metricsByApp = uniqueValues.map(itemName => {
    return calcAppSpecificMetrics(itemName, data);
  });
  const sortedByTimeSpent = metricsByApp.sort((a, b) => b.totalTimeSpent - a.totalTimeSpent);  // Sort by count, descending
  const countSites = getNumSites(uniqueValues);
  const sessionMetrics = {
    //In reality, all of these except duration would be generated by a "process session ID" call of some kind
    numTasks: numTasksCompleted, // Number of tasks completed
    tabSwitchRate: data.length / duration, // # of times tabs were switched divided by number of minutes in session,
    numApps: countSites.numApps,
    numWebsites: countSites.numWebsites,
    mostUsedApps: sortedByTimeSpent.slice(0, 5).map(app => ({
      appName: app.name,
      durationInMinutes: app.totalTimeSpent,
      countSwitchedTo: app.numTimesSwitchedTo
    })),
    appSpecificMetrics: metricsByApp
  };

  return sessionMetrics;
};

const getNumSites = (data) => {
  const regex = /^[\w!@#$%^&*()\-_=+\[{\]}\\|;:'",<>\./?]+(\.[\w!@#$%^&*()\-_=+\[{\]}\\|;:'",<>\./?]+){1,4}$/;
  const countWebsites = data.filter(str => regex.test(str)).length;
  return {numWebsites: countWebsites, numApps: data.length - countWebsites};
};

const calcAppSpecificMetrics = (appName, sessionData) => {
  filteredByAppName = sessionData.map((item, index) => ({ ...item, arrayIndex: index })).filter(app => app._value === appName);
  length = filteredByAppName.length;
  totalTimeSpent = filteredByAppName.reduce((acc, item) => acc + item._timeSpent, 0) / 60;


  const nextAppCounts = {};
  frequentSwitches = filteredByAppName.map((item) => {
    const nextApp = item.arrayIndex + 1 < sessionData.length ? sessionData[item.arrayIndex + 1]._value : "End of session";
    nextAppCounts[nextApp] = (nextAppCounts[nextApp] || 0) + 1;
  });

  const sortedNextApps = Object.entries(nextAppCounts)
    .map(([app, count]) => ({ app, count }))

    .sort((a, b) => b.count - a.count);  // Sort by count

  getTimeBetweenSwitches = filteredByAppName.map((element, index, array) => {
    return (index < array.length - 1) ? (array[index+1]._timeInSeconds - element._timeInSeconds) : 0;
  });
  
  const appMetrics =
    { 
      name: appName,
      numTimesSwitchedTo: length, 
      totalTimeSpent: totalTimeSpent, 
      avgTimeBetweenSwitches: getTimeBetweenSwitches.reduce((acc, item) => item > 5 ? acc + item : acc, 0) / (length * 60),
      appsMostFrequentlyUsed: {appName: sortedNextApps[0].app, count: sortedNextApps[0].count}, 
      magicDistractionScore: totalTimeSpent / length * 100
    };

  return appMetrics;
};

const chunkData = (sessionData) => {
  const data = { chunks: [] };

  sessionData.reduce((acc, element, idx) => {
    var time = element._timeSpent;
    if (acc.currentSum + time > 900) {
      if (acc.currentSum === 900 || idx === sessionData.length - 1) { // Push the chunk if it sums to 900 or if youve reached the end of the session 

        data.chunks.push(acc.currentChunk); 
      }
      else {
        currentChunk.push({name: sessionData[idx]._value, timeSpent: 900 - totChunkTime});
        data.chunks.push(currentChunk);
        time = time - (900 - totChunkTime);
      }
      // Reset for the next chunk
      currentChunk = [{name: sessionData[idx]._value, timeSpent: time}];
      totChunkTime = time; // Reset currentSum      
    } 
    else {
      // Add to the current chunk
      currentChunk.push({name: sessionData[idx]._value, timeSpent: time});
      totChunkTime += time;
    }
  });
  return data;
};

module.exports = {calcMetrics, chunkData, calcAppSpecificMetrics};