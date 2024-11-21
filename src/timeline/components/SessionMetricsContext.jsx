/* eslint-disable no-console */
const React = require("react");
const { useLocation } = require("react-router-dom");
const { ipcRenderer } = require("electron");

const { calcMetrics, chunkData } = require("../build-timeline");
const { useContext, createContext, useState, useEffect } = React;
// const sampleData = require("../two_hr_session.json"); //sample data
const {convertTime, getTimeSpent} = require("../calc-time.js");

// Create the context
const SessionMetricsContext = createContext();

// Create a provider component
const SessionMetricsProvider = ({children}) => {
  const [duration, setDuration] = useState(useLocation().state.duration); //Once we store this in the database, we should be getting it from there rather than from useLocation().state
  const [chunkSize, setChunkSize] = useState(30);
  const [sessionId, setSessionId] = useState(useLocation().state.sessionId);
  const [sessionData, setSessionData] = useState(null);
  const [sessionMetrics, setSessionMetrics] = useState({
    numTasks: 0,
    tabSwitchRate: 0,
    timeOnDistr: 0,
    productivityEstimate: 0,
    mostUsedApps: []
  });
  const [appSpecificMetrics, setAppSpecificMetrics] = useState({});
  const [currChunkId, setCurrChunkId] = useState(-1);
  const [currChunkData, setCurrChunkData] = useState(null); // Stores the data in the current chunk
  //Null when no chunk is selected

  //Essentially what this does is that whenever the sessionId changes, it will load the data for that ID and calc the metrics
  //Once the values get updated here, they automatically get shared with other elements
  useEffect(() => {

    ipcRenderer.on('return-session-data', (_event, sessionData, taskData) => {
      try {
        console.log("Loading with Session ID", sessionId);
        const data = sessionData;
        convertTime(data);
        convertTime(taskData);
        getTimeSpent(data, duration);
        getTimeSpent(taskData);

        setSessionData(chunkData(data));

        //Also would need to get sessionMetadata
        //Right now calcMetrics just returns a sample
        const [fullSessionMetrics, appMetrics] = calcMetrics(data, duration, taskData);
        setSessionMetrics(fullSessionMetrics);
        setAppSpecificMetrics(appMetrics);
        setChunkSize(30);
        setCurrChunkId(-1);
        setCurrChunkData(null);
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    });

    ipcRenderer.send('get-session-data', sessionId);
    return () => {
      ipcRenderer.removeAllListeners('return-session-data');
    };
  }, [sessionId]);

  //These are all the values accessible within components on the timeline screen
  //We don't want any other element to be able to control the session data and metrics so we leave the state setters out
  const contextVals = {
    duration, 
    setDuration, 
    chunkSize, 
    setChunkSize, 
    sessionId, 
    setSessionId, 
    sessionData, 
    sessionMetrics, 
    appSpecificMetrics,
    currChunkId, 
    setCurrChunkId, 
    currChunkData, 
    setCurrChunkData
  };

  return (
    <SessionMetricsContext.Provider value={contextVals}>
      {children}
    </SessionMetricsContext.Provider>
  );
};

// Export the context for use in other components
const useSessionMetrics = () => useContext(SessionMetricsContext);

module.exports = { SessionMetricsProvider, useSessionMetrics };
