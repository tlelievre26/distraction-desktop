 
const React = require("react");
const { useNavigate } = require("react-router-dom");
const { Dropdown } = require("react-bootstrap");
const { ipcRenderer } = require("electron");

const { usePrevSession } = require("./../../timeline/components/PrevSessionContext");

require("./../../timeline/components/navbarStyles.css");
require("./../../timeline/components/PrevSessionStyles.css");

//This is like 99% the same as the other one but has slightly different functionality
//I probably could've done this without making them seperate files but this was easier and I'm lazy
const StartPrevSessionsMenu = () => {
  const navigation = useNavigate();


  const loadPrevSession = (duration, name, sessionId, startTime, endTime) => {
    ipcRenderer.send("resize-window", 'timeline');
    navigation("/timeline", {
      state: { duration, name, sessionId, startTime, endTime, newSession: false }
    });
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
              onClick={() => loadPrevSession(session.duration, session.name, session.sessionId, session.startTime, session.endTime)}
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

module.exports = StartPrevSessionsMenu;
