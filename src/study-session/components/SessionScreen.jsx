const { ipcRenderer } = require("electron");
const React = require("react");
const { useState, useEffect} = React;
const { useNavigate } = require("react-router-dom");

const ChromeWarning = require("./ChromeWarning");
const EndSessionButton = require("./EndSessionButton.jsx");
const CountdownTimer = require("./CountdownTimer.jsx");
const TaskList = require("../../task_list/components/TaskList.jsx");
const formatDate = require("../../util/format-date.js");
const AFKButton = require("./AFKButton.jsx");
require("./../../timeline/components/navbarStyles.css");

const SessionScreen = () => {
  const navigation = useNavigate();
  const [sessionId, setSessionId] = useState(sessionStorage.getItem('active-session-id') ?? null);
  const goToTimeline = (duration, name, startTime, endTime) => {
    ipcRenderer.send("resize-window", 'timeline');
    navigation("/timeline", {
      state: { sessionId: sessionStorage.getItem('active-session-id'), duration, name, startTime, endTime, newSession: true }
    });
  };

  useEffect(() => { //Recieves messages about whether or not the Chrome extension is connected

    ipcRenderer.on('session-id', (_event, newSessionId) => {
      sessionStorage.setItem('active-session-id', newSessionId);
      setSessionId(newSessionId);
    });

    ipcRenderer.on('backend-end-session', (_event, duration, startTime, endTime) => {
      const name = formatDate(startTime, endTime);
      goToTimeline(duration, name, startTime, endTime);
    });

    // Cleanup listener on unmount
    return () => {
      ipcRenderer.removeAllListeners('session-id');
      ipcRenderer.removeAllListeners('backend-end-session');
    };
  }, []);

  return (
    <>
      <nav className="navbar navbar-dark bg-primary custom-navbar">
        <div className="container-fluid d-flex justify-content-start mx-auto align-items-center">
          <CountdownTimer/>
          <EndSessionButton/>
          <AFKButton sessionId={sessionId}/>
        </div>
      </nav>
      <div className="centered">
        <ChromeWarning/>
      </div>
      <TaskList sessionId={sessionId}/>
    </>

  );
};

module.exports = SessionScreen;
