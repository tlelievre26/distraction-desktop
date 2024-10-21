const React = require("react");

const BeginSessionButton = require("./BeginSessionButton");
const PrevSessionsMenu = require("../../timeline/components/PrevSessionsMenu");
const MaintainTaskList = require("../../task_list/components/MaintainTaskList");

require("./../../timeline/components/navbarStyles.css");

const HomePage = () => (
  <>
    <nav className="navbar navbar-dark bg-primary custom-navbar">
      <div className="container-fluid d-flex justify-content-end mx-auto align-items-center">
        <PrevSessionsMenu/>
      </div>
    </nav>
    <BeginSessionButton />
    <MaintainTaskList/>
  </>
);

module.exports = HomePage;
