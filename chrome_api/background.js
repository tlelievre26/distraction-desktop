chrome.runtime.onStartup.addListener(() => {
  chrome.runtime.sendNativeMessage('com.example.nativehost', { text: "Hello from Chrome extension" }, (response) => {
    console.log('Received from native app:', response);
  });
});
  
// Listen for any messages from the popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.runtime.sendNativeMessage('com.example.nativehost', request, (response) => {
    sendResponse(response);
  });
  return true;  // Keeps the message channel open for async response
});