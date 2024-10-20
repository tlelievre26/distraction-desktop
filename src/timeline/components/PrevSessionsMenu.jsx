const React = require("react");
const { Dropdown } = require('react-bootstrap');

require("./navbarStyles.css");
require("./PrevSessionStyles.css");
const PrevSessionsMenu = () => {

  const loadPrevSession = (sessionId) => {
    console.log("Loading session with ID :", sessionId);
    //Here, we would load in the timeline for the old sessio
  };

  const prevStudySessions = [{ name: "MM/DD/YY HH:MM to HH:MM", sessionId: 0 }, { name: "MM/DD/YY HH:MM to HH:MM", sessionId: 1 }]; //In the future we'll load these from the DB

  return (
    <div className="navbar-button">
      <Dropdown>
        <Dropdown.Toggle variant="info" id="dropdown-basic">
            Previous Sessions
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {prevStudySessions.map((session, index) => (
            <Dropdown.Item
              as="button"
              key={index}
              onClick={() => loadPrevSession(session.sessionId)}
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
