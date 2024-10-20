const React = require("react");


const SelectChunkMenuSize = () => {
  const [chunkSize, setChunkSize] = React.useState('30');

  const handleChange = (event) => {
    setChunkSize(event.target.value); // Update state with the new value
    console.log('Selected option:', event.target.value); // Trigger additional logic here
    //Somehow send this to the timeline component
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
