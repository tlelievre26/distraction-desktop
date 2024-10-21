const { ipcRenderer } = require("electron");
const React = require("react");

require("./../../timeline/components/navbarStyles.css");

const EndSessionButton = () => {

  const endSession = () => {
    ipcRenderer.send("end-session");
  };
  //Backend will respond to this with a "confirmation" msg, which is handled in the main screen

  return (
    <div className="navbar-button">
      <button type="button" className="btn btn-danger" onClick={endSession}>
        End Study Session
      </button>
    </div>
  );
};

module.exports = EndSessionButton;
