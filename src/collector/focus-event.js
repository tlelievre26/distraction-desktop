// Import Koffi
const cluster = require("cluster");

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


// Load necessary WinAPI functions
const lib = koffi.load('user32.dll');

// Define constants
const WINEVENT_OUTOFCONTEXT = 0x0000;
const WINEVENT_SKIPOWNPROCESS = 0x0002;
const EVENT_OBJECT_FOCUS = 0x8005;

const setCallback = () => {
  const productName = Buffer.alloc(100);
  const message = Buffer.alloc(100);

  const winCallback = (hWinEventHook, event, hwnd, idObject, idChild, dwEventThread, dwmsEventTime) => {
    if (event === EVENT_OBJECT_FOCUS) {
      // Trigger the JavaScript function when the focus event occurs
      productName = getCurrentAppName();
      console.log(productName);
      //return productName;
    }
    return productName;
  };
    
  const SetWinEventHook = lib.func('SetWinEventHook', 'HWINEVENTHOOK', [DWORD, DWORD, HMODULE, koffi.pointer(WinEventProc), DWORD, DWORD, DWORD]);

  const callback = koffi.register(winCallback, koffi.pointer(WinEventProc));
    
  // Hook for EVENT_OBJECT_FOCUS
  const hEventHook = SetWinEventHook(EVENT_OBJECT_FOCUS, EVENT_OBJECT_FOCUS, null, callback, 0, 0, WINEVENT_OUTOFCONTEXT | WINEVENT_SKIPOWNPROCESS);

  const res = GetMessageA(message, null, 0, 0);
  //console.log(res);
  koffi.unregister(callback);
  //return productName;
};
module.exports = setCallback;