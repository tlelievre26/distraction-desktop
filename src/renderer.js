const React = require("react");
const ReactDOM = require("react-dom/client");
const { createHashRouter, RouterProvider } = require("react-router-dom");

const HomePage = require("./study-session/components/HomePage");
const SessionScreen = require("./study-session/components/SessionScreen");
const TimelineScreen = require("./timeline/components/TimelineScreen");
const TaskList = require("./study-session/components/TaskList");
require("bootstrap/dist/css/bootstrap.min.css");

const router = createHashRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/session",
    element: <SessionScreen />
  },
  {
    path: "/timeline",
    element: <TimelineScreen />
  },
  {
    path: "/tasklist",
    element: <TaskList />
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);