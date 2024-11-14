const React = require("react");

const { useSessionMetrics } = require("../SessionMetricsContext");
const { useState } = React;
require("./chunkMetricStyles.css");

//Asked ChatGPT for a function to hash an appName into a color codeand this is what it gave me
const stringToColor = (str) => {
  let hash = 0;
  // Generate a simple hash based on the input string
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash); // Bitwise operations for hashing
    hash = hash & hash; // Ensure hash remains a 32-bit integer
  }

  // Generate RGB values from the hash
  const r = (hash >> 16) & 0xFF;
  const g = (hash >> 8) & 0xFF;
  const b = hash & 0xFF;

  // Adjust the RGB values to create more diverse colors
  // Instead of mixing with white completely, we reduce it for a broader range
  const vibrantFactor = 0.7; // Controls vibrancy (1.0 for no pastels, 0.5 for full pastels)
  const vibrantR = Math.floor(r * vibrantFactor + 255 * (1 - vibrantFactor));
  const vibrantG = Math.floor(g * vibrantFactor + 255 * (1 - vibrantFactor));
  const vibrantB = Math.floor(b * vibrantFactor + 255 * (1 - vibrantFactor));

  // Convert to a hex string and return
  const color = `#${vibrantR.toString(16).padStart(2, '0')}${vibrantG.toString(16).padStart(2, '0')}${vibrantB.toString(16).padStart(2, '0')}`;
  return color;
};

const AppTimelineBlock = ({timeSpent, name, zoom, focusedApp, setFocusedApp }) => {
  const { chunkSize } = useSessionMetrics();

  const dynWidth = Math.ceil(1200 * (timeSpent / (chunkSize * 60))) * zoom;

  const [showInfo, setShowInfo] = useState(false); // State to control bubble visibility
  const handleMouseEnter = () => {
    setShowInfo(true); // Show bubble on hover
  };

  const handleMouseLeave = () => {
    setShowInfo(false); // Hide bubble when mouse leaves
  };

  const selectApp = () => {
    setFocusedApp(name);
  };

  const selectedStyle = { //When this chunk is selected keep it darker
    backgroundColor: stringToColor(name),
    opacity: focusedApp !== '' && focusedApp !== name && 0.2
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
        onClick={selectApp}
        style={selectedStyle}>
      </div>
    </div>
  );
};

module.exports = AppTimelineBlock;