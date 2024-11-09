const React = require("react");

require("./chunkMetricStyles.css");

//Asked ChatGPT for a function to hash an appName into a color codeand this is what it gave m
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash); // Simple hash function
  }
  // Create a color by using the hash
  const color = `#${((hash >> 24) & 0xff).toString(16)}${((hash >> 16) & 0xff).toString(16)}${((hash >> 8) & 0xff).toString(16)}`;
  return color;
};

const AppTimelineBlock = ({timeSpent, name}) => {
  const dynWidth = timeSpent >= 0 ? `${timeSpent}px` : '1px';
  return (
    <>
      <div className="chunk" style={{width:dynWidth, backgroundColor: stringToColor(name)}}>
      </div>
    </>
  );
};

module.exports = AppTimelineBlock;