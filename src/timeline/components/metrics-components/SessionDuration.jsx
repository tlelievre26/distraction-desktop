const React = require("react");

const { useSessionMetrics } = require("../SessionMetricsContext");

const SessionDuration = () => {
  const { duration } = useSessionMetrics();
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
