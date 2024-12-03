const React = require("react");

const { useSessionMetrics } = require("../SessionMetricsContext");

require("./TimelineStyles.css");

const TimelineChunk = ({id, data}) => {
  const { currChunkId, setCurrChunkId, setCurrChunkData } = useSessionMetrics();
  const selectThisChunk = () => {
    setCurrChunkId(id);
    setCurrChunkData(data);
  };
  

  const selectedStyle = { //When this chunk is selected keep it darker
    filter: currChunkId === id && 'brightness(80%)'
  };

  return (
    <div className="chunk" onClick={selectThisChunk} style={selectedStyle}>
    </div>
  );
};

module.exports = TimelineChunk;