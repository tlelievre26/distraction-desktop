const React = require("react");
const { useState } = React;
const { ipcRenderer } = require("electron"); // Assuming Electron is used
const { useNavigate } = require("react-router-dom");
require("./start-styling.css");

const BeginSessionButton = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const navigation = useNavigate();

  const handleHoursChange = (event) => {
    const value = Math.max(0, Math.min(23, parseInt(event.target.value, 10)));
    setHours(isNaN(value) ? 0 : value);
  };

  const handleMinutesChange = (event) => {
    const value = Math.max(0, Math.min(59, parseInt(event.target.value, 10)));
    setMinutes(isNaN(value) ? 0 : value);
  };

  const handleSecondsChange = (event) => {
    const value = Math.max(0, Math.min(59, parseInt(event.target.value, 10)));
    setSeconds(isNaN(value) ? 0 : value);
  };

  const startTimer = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    ipcRenderer.send("begin-session", totalSeconds);
    //To add: if the user begins a session that isn't long enough to gather substantial data (say, 30 mins), throw an error message on screen
    navigation("/session", {
      state: { timerValue: totalSeconds },
    });
  };

  return (
    <div className="container mt-5">
      <h1>Set Countdown Time (HH:MM:SS)</h1>

      {/* Input group to combine the inputs for hours, minutes, and seconds */}
      <div className="input-group mb-3">
        <input
          type="number"
          className="form-control"
          onChange={handleHoursChange}
          min="0"
          max="23"
          placeholder="HH"
          aria-label="Hours"
        />
        <span className="input-group-text">:</span>
        <input
          type="number"
          className="form-control"
          onChange={handleMinutesChange}
          min="0"
          max="59"
          placeholder="MM"
          aria-label="Minutes"
        />
        <span className="input-group-text">:</span>
        <input
          type="number"
          className="form-control"
          onChange={handleSecondsChange}
          min="0"
          max="59"
          placeholder="SS"
          aria-label="Seconds"
        />
      </div>

      {/* Start button */}
      <button
        type="button"
        className="btn btn-primary btn-lg"
        onClick={startTimer}
      >
        Start Study Session
      </button>
    </div>
  );
};

module.exports = BeginSessionButton;
