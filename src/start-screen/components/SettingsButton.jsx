 
const { ipcRenderer } = require("electron");
const React = require("react");
const { Dropdown, DropdownButton } = require("react-bootstrap");

require("./../../timeline/components/navbarStyles.css");

const SettingsButton = ({filepath, setFilepath, apiKey, setApikey}) => {


  const [showDropdown, setShowDropdown] = useState(false);

  const setNewFilepath = (event) => {
    setFilepath(event.target.value);
  };

  const setNewApikey = (event) => {
    setApikey(event.target.value);
  };

  const useNewSettings = () => {
    ipcRenderer.send('attempt-reconnect');
  };

  return (
    <div className="navbar-button p-2">
      <DropdownButton
        title="Settings"
        show={showDropdown}
        onClick={() => setShowDropdown(!showDropdown)}
        className="secondary"
      >
        <Dropdown.Item as="div" className="p-3">
          <Form.Group controlId="filepath">
            <Form.Label>Path to Influx:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter path to InfluxDB"
              value={filepath}
              onChange={setNewFilepath}
            />
          </Form.Group>

          <Form.Group controlId="apiKey" className="mt-3">
            <Form.Label>Influx API Key:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter InfluxDB API key"
              value={apiKey}
              onChange={setNewApikey}
            />
          </Form.Group>

          <Button variant="primary" className="mt-3" onClick={useNewSettings}>
          Save
          </Button>
        </Dropdown.Item>
      </DropdownButton>
    </div>
  );
};

module.exports = SettingsButton;