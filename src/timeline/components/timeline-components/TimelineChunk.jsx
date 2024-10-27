const React = require("react");

require("./TimelineStyles.css");

const TimelineChunk = ({timeChunk, timeSpent, name}) => {
  const dynWidth = timeSpent >= 0 ? `${timeSpent}px` : '1px';
  return (
    <>
      { timeSpent >= timeChunk / 60  && 
        <div className="chunk" style={{width:dynWidth}}>
          <p>{timeSpent}</p>
        </div>
      }
    </>
  );
};

module.exports = TimelineChunk;