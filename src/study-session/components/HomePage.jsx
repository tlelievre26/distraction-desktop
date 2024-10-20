const React = require("react");

const BeginSessionButton = require("./BeginSessionButton");
const PrevSessionsMenu = require("../../timeline/components/PrevSessionsMenu");

const HomePage = () => (
  <>
    <nav className="navbar navbar-dark bg-primary navbar-expand-lg">
      <PrevSessionsMenu/>
    </nav>
    <BeginSessionButton />
  </>
);

module.exports = HomePage;
