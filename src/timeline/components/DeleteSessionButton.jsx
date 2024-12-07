const React = require("react");
const { ipcRenderer } = require("electron");
const { useNavigate } = require("react-router-dom");

const { useSessionMetrics } = require("./SessionMetricsContext");
const { usePrevSession } = require("./PrevSessionContext");
const { convertTime } = require("../calc-time");


const DeleteSessionButton = ({ setName }) => {

  const { sessionId, setSessionId, setDuration, setStartTime, setEndTime, setIsNewSession } = useSessionMetrics();
  const { prevSessionIds, setPrevSessionIds } = usePrevSession();
  const navigation = useNavigate();


  const deleteSession =  () => {
    ipcRenderer.send("deleteSession", sessionId);
    const filteredList = prevSessionIds.filter((prevSession) => prevSession.sessionId !== sessionId);
    setPrevSessionIds(filteredList); // Remove deleted session from the list
    if(filteredList.length !== 0) {
      setDuration(filteredList[filteredList.length - 1].duration);
      setName(filteredList[filteredList.length - 1].name);
      setStartTime(convertTime(filteredList[filteredList.length - 1].startTime * 1000));
      setEndTime(convertTime(filteredList[filteredList.length - 1].endTime * 1000));
      setIsNewSession(false);
      setSessionId(filteredList[filteredList.length - 1].sessionId); //Load the last session in the list
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