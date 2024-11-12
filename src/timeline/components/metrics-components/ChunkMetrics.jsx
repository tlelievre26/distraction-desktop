const React = require("react");
const { useState } = React;

const { useSessionMetrics } = require("../SessionMetricsContext");
const AppTimelineBlock = require("./AppTimelineBlock");

require("./chunkMetricStyles.css");

const ChunkMetrics = () => {
  const { currChunkData, setCurrChunkData, currChunkId, setCurrChunkId, chunkSize } = useSessionMetrics();
  const [ currZoom, setCurrZoom ] = useState(1);
  const [ focusedApp, setFocusedApp ] =  useState('');
  //   const 
  
  const closeChunkScreen = () => {
    setCurrChunkId(-1);
    setCurrChunkData(null);
  };
  
  const zoomIn = () => {
    setCurrZoom((prevZoom) => Math.min(5, prevZoom + .5));
  };

  const zoomOut = () => {
    setCurrZoom((prevZoom) => Math.max(1, prevZoom - .5));
  };
  
  
  let blocks;
  if(currChunkData) {
    console.log("Generating TL blocks for data", currChunkData);
    blocks = currChunkData.map((app) => <AppTimelineBlock timeSpent={app.timeSpent} name={app.name}/>);
  }


  if(currChunkId === -1) {
    return null;
  }

  return (
    <div className="metrics-container">
      <div className="chunk-screen-layout">
        <div className="chunk-buttons">
          <button className="close-chunk-metrics" onClick={closeChunkScreen}>X</button>
          <button className="zoom-metrics" onClick={zoomIn}>+</button>
          <button className="zoom-metrics" onClick={zoomOut}>-</button>
        </div>

        <div className="app-timeline-container">
          <div className="app-timeline" style={{
            transform: `scaleX(${currZoom})`,
            transformOrigin: 'left',
            transition: 'transform 0.3s ease'
          }}>
            {blocks}
          </div>
        </div>

      </div>
    </div>
  );
};

module.exports = ChunkMetrics;
