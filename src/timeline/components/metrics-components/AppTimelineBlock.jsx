const React = require("react");

const { useSessionMetrics } = require("../SessionMetricsContext");
const { useState } = React;
require("./chunkMetricStyles.css");

//Asked ChatGPT for a function to hash an appName into a color codeand this is what it gave me
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash); // Simple hash function
  }
  
  // Generate RGB values from the hash, but make sure they're in the pastel range
  const r = (hash >> 16) & 0xFF;
  const g = (hash >> 8) & 0xFF;
  const b = hash & 0xFF;

  // Pastel colors: Mix the color with white by averaging the color values with 255
  const pastelR = Math.min(255, Math.floor((r + 255) / 2));
  const pastelG = Math.min(255, Math.floor((g + 255) / 2));
  const pastelB = Math.min(255, Math.floor((b + 255) / 2));

  // Convert to hex and return the color
  const color = `#${pastelR.toString(16).padStart(2, '0')}${pastelG.toString(16).padStart(2, '0')}${pastelB.toString(16).padStart(2, '0')}`;
  return color;
};

const AppTimelineBlock = ({timeSpent, name, zoom}) => {
  const { chunkSize } = useSessionMetrics();
  

  const dynWidth = Math.ceil(1200 * (timeSpent / (chunkSize * 60))) * zoom;

  const [showInfo, setShowInfo] = useState(false); // State to control bubble visibility
  const handleMouseEnter = () => {
    setShowInfo(true); // Show bubble on hover
  };

  const handleMouseLeave = () => {
    setShowInfo(false); // Hide bubble when mouse leaves
  };
  
  if(dynWidth <= 2) {
    return null;
  }

  return (
    <div style={{width:`${dynWidth}px`}}>
      {/* Chat Bubble */}
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
            zIndex: 1,
            textAlign: 'center',
            width: '200px'
          }}
        >
          {name}
        </div>
      )}
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
      <div className="app-timeline-chunk"         
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          backgroundColor: stringToColor(name) 
        }}>
      </div>
    </div>
  );
};

module.exports = AppTimelineBlock;