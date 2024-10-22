const React = require("react");
const { Dropdown } = require("react-bootstrap");

const { usePrevSession } = require("./PrevSessionContext");

require("./navbarStyles.css");
require("./PrevSessionStyles.css");
const PrevSessionsMenu = () => {

  const loadPrevSession = (sessionId) => {
    console.log("Loading session with ID :", sessionId);
    //Figure out how to set the "sessionId" state variable to the new value, which should update it automatically
  };

  const { prevSessionIds } = usePrevSession();

  return (
    <div className="navbar-button p-2">
      <Dropdown>
        <Dropdown.Toggle variant="info" id="dropdown-basic">
          Previous Sessions
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {prevSessionIds.map((session, index) => (
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
