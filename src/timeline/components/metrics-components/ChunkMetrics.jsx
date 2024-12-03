const React = require("react");
const { useState, useEffect } = React;

const { useSessionMetrics } = require("../SessionMetricsContext");
const AppTimelineBlock = require("./AppTimelineBlock");
const AppMetricsScreen = require("./AppMetricsScreen");

require("./chunkMetricStyles.css");

const ChunkMetrics = () => {
  const { currChunkData, setCurrChunkData, currChunkId, setCurrChunkId } = useSessionMetrics();
  const [ currZoom, setCurrZoom ] = useState(1);
  const [ focusedApp, setFocusedApp ] =  useState(null);
  

  const ChunkScreenButtons = () => { //Only defining this in here so I don't have to pass in a ton of state variables
    const closeChunkScreen = () => {
      setCurrChunkId(-1);
      setCurrChunkData(null);
      setFocusedApp(null);
    };
        
    const zoomIn = () => {
      setCurrZoom((prevZoom) => Math.min(5, prevZoom + .5));
    };
      
    const zoomOut = () => {
      setCurrZoom((prevZoom) => Math.max(1, prevZoom - .5));
    };
    
    if(focusedApp !== null) {
      return null;
    }

    return (         
      <div className="chunk-buttons">
        <button className="close-chunk-metrics" onClick={closeChunkScreen}>X</button>
        <button className="zoom-metrics" onClick={zoomIn}>+</button>
        <button className="zoom-metrics" onClick={zoomOut}>-</button>
      </div>
    );
  };
  
  useEffect(() => {
    setFocusedApp(null); // Prevents a bug for empty timelines
  }, [currChunkId]);

  let blocks;
  if(currChunkData) {
    blocks = currChunkData.map((app) => <AppTimelineBlock timeSpent={app.timeSpent} name={app.name} zoom={currZoom} focusedApp={focusedApp} setFocusedApp={setFocusedApp}/>);
  }

  const appTimelineStyles = {
    justifyContent: currZoom === 1 ? "center" : "left"
  };

  if(currChunkId === -1) {
    return null;
  }

  return (
    <div className="chunk-metrics-container">
      <div className="chunk-screen-layout">
        <ChunkScreenButtons/>
        <AppMetricsScreen focusedApp={focusedApp} setFocusedApp={setFocusedApp}/>
        <div className="app-timeline-container" style={appTimelineStyles}>
          <div className="app-timeline">
            {blocks}
          </div>
        </div>

      </div>
    </div>
  );
};

module.exports = ChunkMetrics;
