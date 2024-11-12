const React = require("react");
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
  const dynWidth = timeSpent >= 0 ? `${timeSpent}px` : '1px';
  const [showInfo, setShowInfo] = useState(false); // State to control bubble visibility
  const handleMouseEnter = () => {
    setShowInfo(true); // Show bubble on hover
  };

  const handleMouseLeave = () => {
    setShowInfo(false); // Hide bubble when mouse leaves
  };


  return (
    <>
      {/* Chat Bubble */}
      {showInfo && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%', // Positions the bubble above the element
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            padding: '10px',
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
          <div>This is a chat bubble!</div>
          {/* Arrow/triangle below the chat bubble */}
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '0',
              height: '0',
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid #f9f9f9' // Match background color of bubble
            }}
          ></div>
        </div>
      )}
      <div className="chunk"         
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{width:dynWidth, backgroundColor: stringToColor(name)}}>
      </div>
    </>
  );
};

module.exports = AppTimelineBlock;