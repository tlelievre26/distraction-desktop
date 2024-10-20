const React = require("react");
require("./navbarStyles.css");

const NewSessionButton = () => {
  return (
    <div className="navbar-button">
      <button
        type="button"
        className="btn btn-success"
      >
      New Session
      </button>
    </div>
  );
};

module.exports = NewSessionButton;