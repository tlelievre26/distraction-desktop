const React = require("react");

const { useSessionMetrics } = require("../SessionMetricsContext");

require("./appMetricStyles.css");
require("./chunkMetricStyles.css");

const AppMetricsScreen = ({ focusedApp, setFocusedApp }) => {
  const { appSpecificMetrics } = useSessionMetrics(); 

  if(focusedApp === null) {
    return null;
  }

  const thisAppMetrics = appSpecificMetrics[focusedApp.name];

  const closeFocusedApp = () => {
    setFocusedApp(null);
  };

  return (
    <div className="app-metrics-container">
      <div className="app-metrics-box">
        <div className= "metric-row">
          <h4>{focusedApp.name}</h4>
          <button className="close-chunk-metrics" onClick={closeFocusedApp}>X</button>
        </div>
        <div className= "metric-row">
          <p>Used for {Math.floor(focusedApp.duration / 60)}m {focusedApp.duration % 60}s</p>
          <p>Avg Use Time: {Math.floor(thisAppMetrics.avgDuration / 60)}m {Math.floor(thisAppMetrics.avgDuration % 60)}s</p>
        </div>
        <div className= "metric-row">
          <p>Opened {thisAppMetrics.numTimesSwitchedTo} times total</p>
          <p>Total Usage: {Math.floor(thisAppMetrics.totalTimeSpent / 60)}m {thisAppMetrics.totalTimeSpent % 60}s</p>
        </div>
        <div className= "metric-row">
          <p>Avg Time Between Switches: {Math.floor(thisAppMetrics.avgTimeBetweenSwitches / 60)}m {Math.floor(thisAppMetrics.avgTimeBetweenSwitches % 60)}s</p>
          <p>Most often used with {thisAppMetrics.appsMostFrequentlyUsed.appName}</p>
        </div>
      </div>

    </div>
  );
};

module.exports = AppMetricsScreen;
