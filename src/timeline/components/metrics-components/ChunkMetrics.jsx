const React = require("react");
const { useState } = React;

const { useSessionMetrics } = require("../SessionMetricsContext");
const AppTimelineBlock = require("./AppTimelineBlock");

require("./chunkMetricStyles.css");

const ChunkMetrics = () => {
  const { currChunkData, setCurrChunkData, currChunkId, setCurrChunkId, chunkSize } = useSessionMetrics();
  const [ focusedApp, setFocusedApp ] =  useState('');
  //   const 
  
  const closeChunkScreen = () => {
    setCurrChunkId(-1);
    setCurrChunkData(null);
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
        <button className="close-chunk-metrics" onClick={closeChunkScreen}>X</button>
        <div className="app-timeline-container">
          <div className="app-timeline">
            {blocks}
          </div>
        </div>

      </div>
    </div>
  );
};

module.exports = ChunkMetrics;
