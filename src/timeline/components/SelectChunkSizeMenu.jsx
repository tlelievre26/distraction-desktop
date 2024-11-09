const React = require("react");

const { useSessionMetrics } = require("./SessionMetricsContext");


const SelectChunkMenuSize = () => {
  const {chunkSize, setChunkSize, setCurrChunkId } = useSessionMetrics();
  const handleChange = (event) => {
    setCurrChunkId(-1);
    setChunkSize(event.target.value); // Update state with the new value
  };

  return (
    <div>
      <select value={chunkSize} id="chunkSize" onChange={handleChange}>
        <option value="15">15 min</option>
        <option value="30">30 min</option>
        <option value="45">45 min</option>
        <option value="60">1 hr</option>
        <option value="120">2 hr</option>
      </select>
    </div>
  );
};

module.exports = SelectChunkMenuSize;
