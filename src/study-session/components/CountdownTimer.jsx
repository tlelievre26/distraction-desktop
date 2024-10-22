const React = require("react");
const { useLocation } = require("react-router-dom");
require("./session-styling.css");

const CountdownTimer = () => {
  const startingTime = useLocation().state.timerValue;
  const [timeLeft, setTimeLeft] = React.useState(startingTime);

  //Note that this is countdown timer purely visual. The actual timer countdown that ends the session when it reaches 0
  //runs in the backend in session-control.js. Because the backend is responsible for handling the cleanup
  //after a study session, it makes more sense for it to also be the one to control when it ends
  React.useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) return prevTime - 1;
        clearInterval(timerInterval);
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="countdown">
      <p>
        Time remaining: {hours.toString().padStart(2, "0")}:
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </p>
    </div>
  );
};

module.exports = CountdownTimer;
