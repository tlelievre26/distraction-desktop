const { ipcRenderer } = require("electron");
const React = require("react");
const { useLocation, useNavigate } = require("react-router-dom");
require("./start-styling.css");

const SessionScreen = () => {
  const startingTime = useLocation().state.timerValue;
  const navigation = useNavigate();
  const [timeLeft, setTimeLeft] = React.useState(startingTime);
  const [extStatus, setExtStatus] = React.useState(false);
  const [sessionId, setSessionId] = React.useState('undefined');
  const goToTimeline = () => {
    ipcRenderer.send("end-session");
    navigation("/timeline", {
      state: { sessionId }
    });
  };

  React.useEffect(() => { // Handles the timer countdown
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) return prevTime - 1;
        clearInterval(timerInterval);
        goToTimeline();
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  React.useEffect(() => { //Recieves messages about whether or not the Chrome extension is connected
    const handleExtensionStatus = (_event, status) => {
      setExtStatus(status);  // Update sendState based on message from main process
    };

    ipcRenderer.on('extension-status', handleExtensionStatus);

    ipcRenderer.on('session-id', (_event, newSessionId) => {
      setSessionId(newSessionId);
    });

    // Cleanup listener on unmount
    return () => {
      ipcRenderer.removeListener('extension-status', handleExtensionStatus);
    };
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div class="centered">
      <p class="header">
        Time remaining: {hours.toString().padStart(2, "0")}:
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </p>
      {!extStatus && (
        <p class="chrome-warning">
          Chrome Extension not connected
        </p>
      )}
      <button type="submit" className="btn btn-danger" onClick={goToTimeline}>
        End Study Session
      </button>
    </div>
  );
};

module.exports = SessionScreen;
