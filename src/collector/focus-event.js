// Import Koffi
const cluster = require("cluster");

const koffi = require('koffi');

const getCurrentAppName = require('./collector');
const {
  DWORD,
  HMODULE,
  HWND
} = require('./winapi-types');
const { GetLastError } = require('./winapi-functions');


// Load necessary WinAPI functions
const user32 = koffi.load('user32.dll');

// Define constants
const WINEVENT_OUTOFCONTEXT = 0x0000;
const WINEVENT_SKIPOWNPROCESS = 0x0002;
const EVENT_OBJECT_FOCUS = 0x8005;

const setCallback = () => {
  if (cluster.isMaster) {
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
    
    // Define the WinEventProc callback function (signature: HWINEVENTHOOK, DWORD, HWND, LONG, LONG, DWORD, DWORD)
    const WinEventProc = koffi.proto('void __stdcall winCallback(HWINEVENTHOOK hWinEventHook, DWORD event, HWND hwnd, LONG idObject, LONG idChild, DWORD dwEventThread, DWORD dwmsEventTime)');
    
    const GetMessageA = user32.func('BOOL GetMessageA(_Out_ void* lpMsg, HWND hWnd, DWORD wMsgFilterMin, DWORD wMsgFilterMax)');

    const SetWinEventHook = user32.func('SetWinEventHook', 'HWINEVENTHOOK', [DWORD, DWORD, HMODULE, koffi.pointer(WinEventProc), DWORD, DWORD, DWORD]);
    
    let callback = koffi.register(winCallback, koffi.pointer(WinEventProc));
    
    // Hook for EVENT_OBJECT_FOCUS
    const hEventHook = SetWinEventHook(EVENT_OBJECT_FOCUS, EVENT_OBJECT_FOCUS, null, callback, 0, 0, WINEVENT_OUTOFCONTEXT | WINEVENT_SKIPOWNPROCESS);
    // console.log(hEventHook);
    // console.log(GetLastError());

    let message = Buffer.alloc(100);
    let res = GetMessageA(message, null, 0, 0);
    // console.log(res);
    // console.log(message);
    
  }};


module.exports = setCallback;
