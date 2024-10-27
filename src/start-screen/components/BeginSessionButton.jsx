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
      state: { timerValue: totalSeconds }
    });
  };

  return (
    <div className ="centered ui-element">
      <div className="container-sm mt-5">
        <p className="countdown-text">Set Session Duration</p>

        {/* Input group to combine the inputs for hours, minutes, and seconds */}
        <form className="form-inline">
          <div className="form-group">
            <input
              type="number"
              className="form-control form-control-lg"
              onChange={handleHoursChange}
              min="0"
              max="23"
              placeholder="HH"
              aria-label="Hours"
            />
          </div>
          <span className="text-countdown">:</span>
          <div className="form-group">
            <input
              type="number"
              className="form-control form-control-lg"
              onChange={handleMinutesChange}
              min="0"
              max="59"
              placeholder="MM"
              aria-label="Minutes"
            />
          </div>
          <span className="text-countdown">:</span>
          <div className="form-group">
            <input
              type="number"
              className="form-control form-control-lg"
              onChange={handleSecondsChange}
              min="0"
              max="59"
              placeholder="SS"
              aria-label="Seconds"
            />
          </div>

        </form>

        {/* Start button */}
        <button
          type="button"
          className="btn btn-primary btn-lg begin-session-button"
          onClick={startTimer}
        >
        Start Study Session
        </button>
      </div>
    </div>
  );
};

module.exports = BeginSessionButton;
