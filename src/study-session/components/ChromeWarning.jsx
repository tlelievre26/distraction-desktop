const { ipcRenderer } = require("electron");
const React = require("react");

const ChromeWarning = () => {
  const [extStatus, setExtStatus] = React.useState(false);

  React.useEffect(() => {
    //Recieves messages about whether or not the Chrome extension is connected

    const handleExtensionStatus = (_event, status) => {
      setExtStatus(status); // Update sendState based on message from main process
    };

    ipcRenderer.on("extension-status", handleExtensionStatus);

    // Cleanup listener on unmount
    return () => {
      ipcRenderer.removeAllListeners("extension-status");
    };
  }, [setExtStatus]);

  return (
    <div>
      {!extStatus && (
        <p className="chrome-warning">Chrome Extension not connected</p>
      )}
    </div>
  );
};

module.exports = ChromeWarning;
