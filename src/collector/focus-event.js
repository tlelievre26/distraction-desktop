// Import Koffi
const cluster = require("cluster");

const koffi = require('koffi');

const getCurrentAppName = require('./collector');
const {
  DWORD,
  HMODULE,
  HWND
} = require('./winapi-types');
const { 
  //GetLastError
  WinEventProc,
  GetMessageA
} = require('./winapi-functions');


// Load necessary WinAPI functions
const lib = koffi.load('user32.dll');

// Define constants
const WINEVENT_OUTOFCONTEXT = 0x0000;
const WINEVENT_SKIPOWNPROCESS = 0x0002;
const EVENT_OBJECT_FOCUS = 0x8005;

const setCallback = () => {
  if (cluster.isPrimary) { 
    console.log("Main code here...");
    cluster.fork();
  } else {
    const winCallback = (hWinEventHook, event, hwnd, idObject, idChild, dwEventThread, dwmsEventTime) => {
      if (event === EVENT_OBJECT_FOCUS) {
      // Trigger the JavaScript function when the focus event occurs
        getCurrentAppName();
      }
      return 0;
    };
    
    const SetWinEventHook = lib.func('SetWinEventHook', 'HWINEVENTHOOK', [DWORD, DWORD, HMODULE, koffi.pointer(WinEventProc), DWORD, DWORD, DWORD]);

    let callback = koffi.register(winCallback, koffi.pointer(WinEventProc));
    
    // Hook for EVENT_OBJECT_FOCUS
    const hEventHook = SetWinEventHook(EVENT_OBJECT_FOCUS, EVENT_OBJECT_FOCUS, null, callback, 0, 0, WINEVENT_OUTOFCONTEXT | WINEVENT_SKIPOWNPROCESS);
    // console.log(hEventHook);
    // console.log(GetLastError());

    let message = Buffer.alloc(100);
    let res = GetMessageA(message, null, 0, 0);
    console.log(res);
    console.log(message);
    
  }
};
while(1)
{
  setCallback();
}

module.exports = setCallback;
