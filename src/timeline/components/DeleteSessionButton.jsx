const React = require("react");
const { ipcRenderer } = require("electron");
const { useNavigate } = require("react-router-dom");

const { useSessionMetrics } = require("./SessionMetricsContext");
const { usePrevSession } = require("./PrevSessionContext");


const DeleteSessionButton = () => {

  const { sessionId, setSessionId } = useSessionMetrics();
  const { prevSessionIds, setPrevSessionIds } = usePrevSession();
  const navigation = useNavigate();


  const deleteSession =  () => {
    ipcRenderer.send("deleteSession", sessionId);
    setPrevSessionIds(prevSessionIds.filter((prevSession) => prevSession.sessionId !== sessionId)); // Remove deleted session from the list
    if(prevSessionIds.length !== 0) {
      console.log("Loading in new session with ID", prevSessionIds[prevSessionIds.length - 1]);
      setSessionId(prevSessionIds[prevSessionIds.length - 1]); //Load the last session in the list
    }
    else {
      navigation("/"); //Go to home screen if there are no other sessions
    }
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