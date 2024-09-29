const { isMainThread, parentPort } = require('worker_threads');

const koffi = require('koffi');

const getCurrentAppName = require('./collector');
const {
  DWORD,
  HMODULE
} = require('./winapi-types');
const { 
  //GetLastError
  WinEventProc,
  GetMessageA
} = require('./winapi-functions');
const { appData } = require('../api_recievers/influxqueries');

// if(isMainThread) {
//   console.log("HI!");
// }
// else {
//   console.log("hi!");
// }

// Load necessary WinAPI functions
const lib = koffi.load('user32.dll');

// Define constants
const WINEVENT_OUTOFCONTEXT = 0x0000;
const WINEVENT_SKIPOWNPROCESS = 0x0002;
const EVENT_OBJECT_FOCUS = 0x8005;

// const setCallback = () => {
let productName = Buffer.alloc(100);
const message = Buffer.alloc(100);

const winCallback = (hWinEventHook, event, hwnd, idObject, idChild, dwEventThread, dwmsEventTime) => {
  parentPort.postMessage("User has switched tabs");
  if (event === EVENT_OBJECT_FOCUS) {
    // Trigger the JavaScript function when the focus event occurs
    productName = getCurrentAppName();
    appData("Windows", productName, 1);
    console.log("Callback has been triggered");
    parentPort.postMessage(productName);
  }
  return productName;
};
    
const SetWinEventHook = lib.func('SetWinEventHook', 'HWINEVENTHOOK', [DWORD, DWORD, HMODULE, koffi.pointer(WinEventProc), DWORD, DWORD, DWORD]);
const UnhookWinEvent = lib.func('BOOL UnhookWinEvent(HWINEVENTHOOK hWinEventHook)');

const callback = koffi.register(winCallback, koffi.pointer(WinEventProc));
    
// Hook for EVENT_OBJECT_FOCUS
const hEventHook = SetWinEventHook(EVENT_OBJECT_FOCUS, EVENT_OBJECT_FOCUS, null, callback, 0, 0, WINEVENT_OUTOFCONTEXT | WINEVENT_SKIPOWNPROCESS);

parentPort.postMessage("Beginning callback flow");

parentPort.on('exit', () => {
  koffi.unregister(callback);
  UnhookWinEvent(hEventHook);
});
//console.log(res);

//return productName;
// };
// module.exports = setCallback;