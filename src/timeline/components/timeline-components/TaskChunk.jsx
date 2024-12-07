const React = require("react");
const { useState } = React;

require("./TimelineStyles.css");
require("../metrics-components/chunkMetricStyles.css");

const TaskChunk = ({offset, width, name, status}) => {
  
  const [showInfo, setShowInfo] = useState(false); // State to control bubble visibility
  const handleMouseEnter = () => {
    setShowInfo(true); // Show bubble on hover
  };

  const handleMouseLeave = () => {
    setShowInfo(false); // Hide bubble when mouse leaves
  };

  const selectedStyle = { //When this chunk is selected keep it darker
    backgroundColor: status === "Complete" ? "#ADD8E6" : "#FFFFE0",
    height: "50px"
  };

  return (
    <div className="task-div" style={{width: `calc(${width}% - 100px)`, left: `calc(${offset}% + 50px)`}}>
      <div className="task-chunk-container">
        <div
          className="task-chunk"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={selectedStyle}>
        </div>
        {showInfo && <div
          style={{
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid #e3e1e1' // Match background color of bubble
          }}
        ></div>}
        {showInfo && (
          <div
            style={{
              padding: '10px',
              position: 'relative',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#f9f9f9',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              whiteSpace: 'nowrap',
              width: 'fit-content',
              zIndex: 1,
              textAlign: 'center'
            }}
          >
            {name} ({status})
          </div>
        )}
      </div>
    </div>
  );
};

module.exports = TaskChunk;