const { ipcRenderer } = require("electron");
const React = require("react");
const { useLocation, useNavigate } = require("react-router-dom");

const TaskList = require("./TaskList");

const SessionScreen = () => {
  const startingTime = useLocation().state.timerValue;
  const navigation = useNavigate();
  const [timeLeft, setTimeLeft] = React.useState(startingTime);
  const goToTimeline = () => {
    ipcRenderer.send("end-session");
    navigation("/timeline");
  };

  React.useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) return prevTime - 1;
        clearInterval(timerInterval);
        goToTimeline();
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div>
      <p>
        Time remaining: {hours.toString().padStart(2, "0")}:
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </p>
      <button type="submit" className="btn btn-danger" onClick={goToTimeline}>
        End Study Session
      </button>
      <TaskList />
    </div>
  );
};

module.exports = SessionScreen;
