const { ipcRenderer } = require("electron");
const React = require("react");
require("./../../timeline/components/navbarStyles.css");

const { appData } = require("../../api_recievers/influxqueries");

const AFKButton = (sessionId) => {
  const [isLocked, setIsLocked] = React.useState(false);

  const goAFK = async () => {
    ipcRenderer.send("lock-app");
    setIsLocked(true);
    appData("Windows", "AFK", sessionId);
    alert("You are now AFK. You will be locked on this screen until you press the Resume button.");
  };
  
  const resume = () => {
    ipcRenderer.send("unlock-app");
    setIsLocked(false);
    alert("You have resumed working.");
  };

  return (
    <div className="navbar-button">
      {!isLocked ? (
        <button type="button" className="btn btn-secondary" style={{ color: 'black'}} onClick={goAFK}>
        Go AFK
        </button>
      ):(<button type="button" className="btn btn-warning" onClick={resume}>
        Resume
      </button>
      )}
    </div>
  );
};

module.exports = AFKButton;