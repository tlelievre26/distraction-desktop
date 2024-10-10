document.addEventListener('DOMContentLoaded', () => {
  // Load the status message from storage
  chrome.storage.sync.get(['statusMsg'], (result) => {
    const statusMsg = document.getElementById('status-message');
    const connectButton = document.getElementById('connect-ws');
    if (result.statusMsg !== undefined) {
      statusMsg.style.display = "block";
      statusMsg.innerText = result.statusMsg;
      statusMsg.style.color = result.statusMsg.includes("Failed") ? "red" : "green"; // Determine color based on message
      connectButton.disabled = result.statusMsg.includes("Successfully");
    } else {
      statusMsg.style.display = "none"; // Hide if no status message
    }
  });

  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const title = currentTab.title;
    const url = currentTab.url;
    const id = currentTab.id;

    document.getElementById('tab-info').innerHTML = `
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>URL:</strong> ${url}</p>
          <p><strong>ID:</strong> ${id}</p>
      `;
  });
});

const connectButton = document.getElementById('connect-ws');
const statusMsg = document.getElementById('status-message');

connectButton.addEventListener('click', () => {
  connectButton.disabled = true;
  statusMsg.style.display = "none"; // Hide status message when connecting
  chrome.runtime.sendMessage('connect-ws');
});

chrome.runtime.onMessage.addListener((message) => {
  if (message === 'connection-success') {
    connectButton.disabled = true;
    statusMsg.style.display = "block";
    statusMsg.style.color = "green";
    statusMsg.innerText = "Successfully connected to desktop app";

    chrome.storage.sync.set({ statusMsg: statusMsg.innerText });
  } else if (message === 'close-ws') {
    connectButton.disabled = false;
    if (statusMsg.style.color !== "red") {
      statusMsg.style.display = "none";
      statusMsg.innerText = "";
    }
  } else if (message === 'conn-failed') {
    statusMsg.style.display = "block";
    statusMsg.style.color = "red";
    statusMsg.innerText = "Failed to connect to desktop app";

  }
});
