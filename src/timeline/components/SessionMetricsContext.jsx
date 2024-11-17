/* eslint-disable no-console */
const React = require("react");
const { useLocation } = require("react-router-dom");

const { calcMetrics, chunkData, calcAppSpecificMetrics } = require("../build-timeline");
const { useContext, createContext, useState, useEffect } = React;
const data = require("../two_hr_session.json"); //sample data
const {convertTime, getTimeSpent} = require("../calc-time.js");

// Create the context
const SessionMetricsContext = createContext();

// Create a provider component
const SessionMetricsProvider = ({children}) => {
  const [duration, setDuration] = useState(useLocation().state.duration); //Once we store this in the database, we should be getting it from there rather than from useLocation().state
  const [chunkSize, setChunkSize] = useState(30);
  const [sessionId, setSessionId] = useState(useLocation().state.sessionId);
  const [sessionData, setSessionData] = useState([]);
  const [sessionMetrics, setSessionMetrics] = useState({
    numTasks: 0,
    tabSwitchRate: 0,
    timeOnDistr: 0,
    productivityEstimate: 0,
    mostUsedApps: []
  });

  //Essentially what this does is that whenever the sessionId changes, it will load the data for that ID and calc the metrics
  //Once the values get updated here, they automatically get shared with other elements
  useEffect(() => {
    const fetchData = async () => {

      try {
        //Returns the session data
        // const data = await SpecificStudySessionProcessing(sessionId);
        //const data = {}

        //We might want to do the data processing/chunking here?
        convertTime(data);
        getTimeSpent(data);
        setSessionData(chunkData(data));
        //Right now calcMetrics just returns a sample
        setSessionMetrics(calcMetrics(data));
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };
    fetchData(); // Apparently doing it this way (defining a function then calling it) is preferred within useEffect
  }, [sessionId]);

  //These are all the values accessible within components on the timeline screen
  //We don't want any other element to be able to control the session data and metrics so we leave the state setters out
  const contextVals = {duration, setDuration, chunkSize, setChunkSize, sessionId, setSessionId, sessionData, sessionMetrics};

  return (
    <SessionMetricsContext.Provider value={contextVals}>
      {children}
    </SessionMetricsContext.Provider>
  );
};

// Export the context for use in other components
const useSessionMetrics = () => useContext(SessionMetricsContext);

module.exports = { SessionMetricsProvider, useSessionMetrics };
