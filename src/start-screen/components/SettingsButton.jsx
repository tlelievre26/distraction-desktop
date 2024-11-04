 
const { ipcRenderer } = require("electron");
const React = require("react");
const { useState } = React;
const { Dropdown, Form, Button } = require("react-bootstrap");

require("./../../timeline/components/navbarStyles.css");
require("./../../timeline/components/PrevSessionStyles.css");
require("./start-styling.css");

const SettingsButton = ({filepath, setFilepath, apiKey, setApikey}) => {

  const [showDropdown, setShowDropdown] = useState(false);

  const setNewFilepath = (event) => {
    setFilepath(event.target.value);
  };

  const setNewApikey = (event) => {
    setApikey(event.target.value);
  };

  const useNewSettings = () => {
    ipcRenderer.send('attempt-reconnect', filepath, apiKey);
    localStorage.setItem('influxApiKey', apiKey);
    localStorage.setItem('influxFilepath', filepath);
    setShowDropdown(false);
  };

  // Thanks ChatGPT
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevents closing when clicking inside
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className="navbar-button settings-button">
      <Dropdown show={showDropdown} className="navbar-button">
        <Dropdown.Toggle
          show={showDropdown}
          onClick={toggleDropdown}
          variant="success"
        >
            Settings
        </Dropdown.Toggle>

        <Dropdown.Menu onClick={(e) => e.stopPropagation()} className="settings-menu">
          <Dropdown.Item as="div" className="p-3">
            <Form.Group controlId="filepath" className="form-group">
              <Form.Label>Path to Influx:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter path to InfluxDB"
                value={filepath}
                onChange={setNewFilepath}
                className="settings-form-control"
              />
            </Form.Group>

            <Form.Group controlId="apiKey" className="form-group">
              <Form.Label>Influx API Key:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter InfluxDB API key"
                value={apiKey}
                onChange={setNewApikey}
                className="settings-form-control"
              />
            </Form.Group>

            <Button variant="primary" className="settings-save-button" onClick={useNewSettings}>
                Connect
            </Button>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      
    </div>
  );
};

module.exports = SettingsButton;