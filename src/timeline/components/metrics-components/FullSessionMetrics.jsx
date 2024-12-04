const React = require("react");
const { useState, useEffect } = React;

const { useSessionMetrics } = require("../SessionMetricsContext");

require("./metricStyles.css");

const FullSessionMetrics = () => {
  const { duration, sessionMetrics, avgSessionData, currChunkId } = useSessionMetrics(); 
  const [ showFullSession, setShowFullSession ] = useState(false);
  const [ displayData, setDisplayData ] = useState(sessionMetrics);
  const [ displayDuration, setDisplayDuration ] = useState(duration);

  useEffect(() => {
    setShowFullSession(false);
    setDisplayData(sessionMetrics);
    setDisplayDuration(duration);
  }, [sessionMetrics]); //Whenever sessionMetrics changes (i.e. a different session is selected), reset

  const toggleSessionData = () => {
    setDisplayData(showFullSession ? sessionMetrics : avgSessionData );
    setDisplayDuration(showFullSession ? duration : avgSessionData.duration);
    setShowFullSession(!showFullSession);
  };

  if(currChunkId !== -1) {
    return null;
  }

  return (
    <div className="metrics-container">
      <div className="metrics-box">
        <div className="generic-metrics">
          <div>
            <p>
              {showFullSession ? "Avg" : "Total"} Session Length: {(Math.floor(displayDuration / 3600)).toString().padStart(2, "0")}:
              {(Math.floor((displayDuration % 3600) / 60)).toString().padStart(2, "0")}:
              {(Math.round(displayDuration) % 60).toString().padStart(2, "0")}
            </p>
          </div>
          <div>
            <p>{showFullSession && "Avg "}# Tasks Completed: {displayData.numTasks}</p>
          </div>
          <div>
            <p>{showFullSession && "Avg "}Tab Switches per min: {displayData.switchRate.toFixed(2)}</p>
          </div>
          <div>
            <p>{showFullSession && "Avg "}Num Unique Apps Used: {showFullSession ? displayData.numApps.toFixed(2) : displayData.numApps}</p>
          </div>
          <div>
            <p>{showFullSession && "Avg "}Num Unique Sites Used: {showFullSession ? displayData.numSites.toFixed(2) : displayData.numSites}</p>
          </div>
          <button onClick={toggleSessionData} className="avg-toggle">{showFullSession ? "This Session" : "Avg Metrics"}</button>
        </div>
        <div className="top-apps">
          <div>
            <h3 className="top-apps-header">Most Used Apps & Websites</h3>
          </div>
          <div className="top-apps-list">
            {sessionMetrics.mostUsedApps.map((appData, index) => (
              <p key={index} className="top-app-entry">{appData.appName} &nbsp; ({Math.floor(appData.duration / 60)}m {appData.duration % 60}s) &nbsp; Opened {appData.countSwitchedTo} times</p>
            ))}
          </div>

        </div>
        
      </div>

    </div>
  );
};

module.exports = FullSessionMetrics;
