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
    webSocket.send(tab);
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
    keepAlive();
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
  try {
    webSocket = new WebSocket('ws://localhost:8090');
  }
  catch (error) {
    console.error(error);
    //ADD CHECK FOR IF IT'S A DIFFERENT ERROR THAN THE ONE WE EXPECT
  }

  chrome.runtime.sendMessage('connection-success');
  webSocket.onopen = (event) => {
    console.log('websocket open');
    keepAlive();
  };

  webSocket.onmessage = (event) => {
    console.log(`websocket received message: ${event.data}`);
  };

  webSocket.onclose = (event) => {
    console.log('websocket connection closed');
    chrome.runtime.sendMessage('close-ws');
    webSocket = null;
  };

  webSocket.onerror = (event) => {
    console.error("WebSocket failed");
    chrome.runtime.sendMessage('close-ws');
    webSocket = null;
  };
};

const disconnect = () => {
  if (webSocket === null) {
    return;
  }
  webSocket.close();
};