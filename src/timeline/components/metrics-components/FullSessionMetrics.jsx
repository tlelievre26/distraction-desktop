const React = require("react");

const { useSessionMetrics } = require("../SessionMetricsContext");

require("./metricStyles.css");

const FullSessionMetrics = () => {
  const { duration, sessionMetrics } = useSessionMetrics(); 
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  return (
    <div className="metrics-container">
      <div className="metrics-box">
        <div className="generic-metrics">
          <div>
            <p>
              Total Session Length: {hours.toString().padStart(2, "0")}:
              {minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}
            </p>
          </div>
          <div>
            <p># Tasks Completed: {sessionMetrics.numTasks}</p>
          </div>
          <div>
            <p>Tab Switches per min: {sessionMetrics.tabSwitchRate}</p>
          </div>
          <div>
            <p>Time on Distractions: {Math.floor(sessionMetrics.timeOnDistr / 60)}m {sessionMetrics.timeOnDistr % 60}s</p>
          </div>
          <div>
            <p>Productivity Estimate: {sessionMetrics.productivityEstimate}</p>
          </div>
        </div>
        <div className="top-apps">
          <div>
            <h3 className="top-apps-header">Most Used Apps & Websites</h3>
          </div>
          <div className="top-apps-list">
            {sessionMetrics.mostUsedApps.map((appData) => (
              <p>{appData.appName} &nbsp; ({Math.floor(appData.duration / 60)}m {appData.duration % 60}s) &nbsp; Opened {appData.countSwitchedTo} times</p>
            ))}
          </div>

        </div>
        
      </div>

    </div>
  );
};

module.exports = FullSessionMetrics;