const React = require("react");
require("./navbarStyles.css");

const DeleteSessionButton = () => {
  return (
    <div className="navbar-button">
      <button
        type="button"
        className="btn btn-danger"
      >
      Delete Session
      </button>
    </div>

  );
};

module.exports = DeleteSessionButton;