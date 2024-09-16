const React = require("react");
const ReactDOM = require("react-dom/client");

const App = require("./app");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
