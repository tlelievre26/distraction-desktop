const React = require("react");
const { ipcRenderer } = require("electron");

const { useSessionMetrics } = require("./SessionMetricsContext");


const DeleteSessionButton = () => {
  const { sessionId } = useSessionMetrics();
  const deleteSession = () => {


    ipcRenderer.send("deleteSession", sessionId);
    
  };

  return (
    <div className="navbar-button">
      <button
        type="button"
        className="btn btn-danger"
        onClick={deleteSession}
      >
      Delete Session
      </button>
    </div>

  );
};
module.exports = DeleteSessionButton;