const React = require("react");
const ReactDOM = require("react-dom/client");
const { createHashRouter, RouterProvider } = require("react-router-dom");

const HomePage = require("./study-session/components/HomePage");
const SessionScreen = require("./study-session/components/SessionScreen");
const TimelineScreen = require("./timeline/components/TimelineScreen");
const ToDOScreen = require("./study-session/components/ToDOScreen");
//const ToDOItem = require("./study-session/components/ToDOItem");
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
    element: <ToDOScreen />
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);