chrome.runtime.onInstalled.addListener(() => {
  console.log("Activating listener");
  chrome.runtime.sendNativeMessage('com.distraction.nativehost', { text: "Hello from Chrome extension" }, (response) => {
    console.log('Received from native app:', response);
  });
});
  
// Listen for any messages from the popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.runtime.sendNativeMessage('com.distraction.nativehost', request, (response) => {
    sendResponse(response);
  });
  return true;  // Keeps the message channel open for async response
});

const getCurrentTab = async (_activeInfo) => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  console.log(tab);
  return tab;
};
  
chrome.tabs.onActivated.addListener(
  getCurrentTab
);
  
  