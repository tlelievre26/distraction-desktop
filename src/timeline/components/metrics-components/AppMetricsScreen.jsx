const React = require("react");

const { useSessionMetrics } = require("../SessionMetricsContext");

require("./appMetricStyles.css");

const AppMetricsScreen = ({ focusedApp, setFocusedApp }) => {
  const { appSpecificMetrics } = useSessionMetrics(); 

  if(focusedApp === '') {
    return null;
  }

  const closeFocusedApp = () => {
    setFocusedApp('');
  };

  return (
    <div className="app-metrics-container">
      <div className="app-metrics-box">
        <div className= "metric-row">
          <h4>{focusedApp}</h4>
          <button className="close-chunk-metrics" onClick={closeFocusedApp}>X</button>
        </div>

        
      </div>

    </div>
  );
};

module.exports = AppMetricsScreen;
