const React = require("react");
const { useNavigate } = require("react-router-dom");

require("./navbarStyles.css");

const NewSessionButton = () => {
  const navigation = useNavigate();
  const goToStart = () => {

    navigation("/");
  };

  return (
    <div className="navbar-button p-2">
      <button type="button" className="btn btn-success" onClick={goToStart}>
        New Session
      </button>
    </div>
  );
};

module.exports = NewSessionButton;