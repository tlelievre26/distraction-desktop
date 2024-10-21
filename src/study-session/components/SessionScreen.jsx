const { ipcRenderer } = require("electron");
const React = require("react");
const { useLocation, useNavigate } = require("react-router-dom");
const ChromeWarning = require("./ChromeWarning");
const EndSessionButton = require("./EndSessionButton.jsx");
const CountdownTimer = require("./CountdownTimer.jsx");
const MaintainTaskList = require("../../task_list/components/MaintainTaskList.jsx");
require("./../../timeline/components/navbarStyles.css");

const SessionScreen = () => {
  const navigation = useNavigate();
  const [sessionId, setSessionId] = React.useState('undefined');
  const goToTimeline = (duration) => {
    navigation("/timeline", {
      state: { sessionId, duration }
    });
  };

  React.useEffect(() => { //Recieves messages about whether or not the Chrome extension is connected

    ipcRenderer.on('session-id', (_event, newSessionId) => {
      setSessionId(newSessionId);
    });

    ipcRenderer.on('backend-end-session', (_event, duration) => {
      console.log("Recieved signal to end study session with duration", duration)
      goToTimeline(duration)
    })

    // Cleanup listener on unmount
    return () => {
      ipcRenderer.removeAllListeners('session-id');
      ipcRenderer.removeAllListeners('backend-end-session');
    };
  }, []);

  return (
    <>
      <nav className="navbar navbar-dark bg-primary custom-navbar">
        <div className="container-fluid d-flex justify-content-end mx-auto align-items-center">
          <CountdownTimer/>
          <EndSessionButton/>
        </div>
      </nav>
      <div className="centered">
        <ChromeWarning/>
      </div>
      <MaintainTaskList/>
    </>

  );
};

module.exports = SessionScreen;
