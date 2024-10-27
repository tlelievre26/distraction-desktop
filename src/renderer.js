const React = require("react");
const ReactDOM = require("react-dom/client");
const { createHashRouter, RouterProvider } = require("react-router-dom");

const HomePage = require("./start-screen/components/HomePage");
const SessionScreen = require("./study-session/components/SessionScreen");
const TimelineScreen = require("./timeline/components/TimelineScreen");
const { TaskProvider } = require("./task_list/components/TaskContext");
require("bootstrap/dist/css/bootstrap.min.css");

const router = createHashRouter([
  {
    path: "/",
    element: <HomePage/>
  },
  {
    path: "/session",
    element: <SessionScreen/>
  },
  {
    path: "/timeline",
    element: <TimelineScreen />
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TaskProvider>
      <RouterProvider router={router} />
    </TaskProvider>
  </React.StrictMode>
);