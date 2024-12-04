/* eslint-disable no-console */
const React = require("react");
const { Dropdown } = require("react-bootstrap");

const { usePrevSession } = require("./PrevSessionContext");
const { useSessionMetrics } = require("./SessionMetricsContext");
const { convertTime } = require("../calc-time");

require("./navbarStyles.css");
require("./PrevSessionStyles.css");
const PrevSessionsMenu = ({setName}) => {

  const { setSessionId, setDuration, setStartTime, setEndTime, setIsNewSession } = useSessionMetrics();

  const loadPrevSession = (sessionId, duration, name, startTime, endTime) => {
    console.log("Loading session with ID :", sessionId);
    setDuration(duration);
    setName(name);
    setSessionId(sessionId);
    setStartTime(convertTime(startTime * 1000));
    setEndTime(convertTime(endTime * 1000));
    setIsNewSession(false);
  };

  const { prevSessionIds } = usePrevSession();

  return (
    <div className="navbar-button">
      <Dropdown className="navbar-button">
        <Dropdown.Toggle variant="info" id="dropdown-basic">
          Previous Sessions
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {prevSessionIds.map((session, index) => (
            <Dropdown.Item
              as="button"
              key={index}
              onClick={() => loadPrevSession(session.sessionId, session.duration, session.name, session.startTime, session.endTime)}
              className="prev-session-item"
            >
              {session.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

module.exports = PrevSessionsMenu;
