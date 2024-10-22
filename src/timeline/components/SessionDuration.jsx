const React = require("react");
const { useLocation } = require("react-router-dom");

const SessionDuration = () => {
  const duration = useLocation().state.duration;
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  return (
    <div>
      <p>
        Total Session Length: {hours.toString().padStart(2, "0")}:
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </p>
    </div>
  );
};

module.exports = SessionDuration;
