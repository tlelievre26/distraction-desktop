/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

let webSocket = null;


// Functions for getting tab data
const getCurrentTab = async (_activeInfo) => {
  if(webSocket !== null) {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab);
    // return tab;
    webSocket.send(JSON.stringify(tab));
  }
};
  
chrome.tabs.onActivated.addListener(
  getCurrentTab
);

//Functions for handling connection to WebSocket
chrome.runtime.onMessage.addListener((message) => {
  if(message === 'connect-ws') {
    connectToWebsocket();
  }
});

const connectToWebsocket = () => {
  if (webSocket) {
    disconnect();
  } else {
    connect();
    // keepAlive();
  }
};

const keepAlive = () => {
  const keepAliveIntervalId = setInterval(
    () => {
      if (webSocket) {
        webSocket.send('keepalive');
      } else {
        clearInterval(keepAliveIntervalId);
      }
    },
    // Set the interval to 20 seconds to prevent the service worker from becoming inactive.
    20 * 1000 
  );
};

const connect = () => {

  webSocket = new WebSocket('ws://localhost:8090');

  webSocket.onopen = (event) => {
    console.log('websocket open');

    chrome.runtime.sendMessage('connection-success'); //Sending a msg while the popup isnt open causes an error but its not a big deal

    chrome.storage.sync.set({ statusMsg: "Successfully connected to desktop app" });
    keepAlive();
  };

  webSocket.onmessage = (event) => {
    console.log(`websocket received message: ${event.data}`);
    if(event.data === "Closing") {
      console.log("Server has closed");
      disconnect();
    }
  };

  webSocket.onclose = (event) => {
    console.log('websocket connection closed');
    chrome.runtime.sendMessage('close-ws'); //Sending a msg while the popup isnt open causes an error but its not a big deal

    chrome.storage.sync.clear(() => {
      console.log("Cleared status msg");
    });
    webSocket = null;
  };

  webSocket.onerror = (event) => {
    console.error("WebSocket failed");
    chrome.runtime.sendMessage('conn-failed'); //Sending a msg while the popup isnt open causes an error but its not a big deal
  };
};

const disconnect = () => {
  if (webSocket === null) {
    return;
  }
  webSocket.close();
};