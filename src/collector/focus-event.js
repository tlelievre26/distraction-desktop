// Import Koffi
const koffi = require('koffi');
const getCurrentAppName = require('./collector')

// Load necessary WinAPI functions
const user32 = koffi.load('user32.dll');

// Define constants
const WINEVENT_OUTOFCONTEXT = 0x0000;
const EVENT_OBJECT_FOCUS = 0x8005;
const EVENT_MIN = 0x00000001;
const EVENT_MAX = 0x7FFFFFFF;

const winCallback = (hWinEventHook, event, hwnd, idObject, idChild, dwEventThread, dwmsEventTime) => {
    if (event === EVENT_OBJECT_FOCUS) {
        // Trigger the JavaScript function when the focus event occurs
        getCurrentAppName();
    }
};

// Define the WinEventProc callback function (signature: HWINEVENTHOOK, DWORD, HWND, LONG, LONG, DWORD, DWORD)
const WinEventProc = koffi.proto('void winCallback(HWINEVENTHOOK, DWORD, HWND, LONG, LONG, DWORD, DWORD)')
const WINEVENTPROC = koffi.alias('WINEVENTPROC', WinEventProc)

// SetWinEventHook function (signature: HWINEVENTHOOK SetWinEventHook (DWORD, DWORD, HMODULE, WINEVENTPROC, DWORD, DWORD, UINT))
const SetWinEventHook = user32.func('HWINEVENTHOOK SetWinEventHook(DWORD, DWORD, HMODULE, WINEVENTPROC, DWORD, DWORD, UINT)');

// Hook for EVENT_OBJECT_FOCUS
const hEventHook = SetWinEventHook(EVENT_OBJECT_FOCUS, EVENT_OBJECT_FOCUS, null, WINEVENTPROC, 0, 0, WINEVENT_OUTOFCONTEXT);

// Keep the script running
setInterval(() => {
    // The script needs to keep running to listen for events
}, 1000);
