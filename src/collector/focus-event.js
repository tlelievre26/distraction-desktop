// Import Koffi
const koffi = require('koffi');
const getCurrentAppName = require('./collector')
const {
    DWORD,
    HMODULE,
    UINT
} = require('./winapi-types')

// Load necessary WinAPI functions
const user32 = koffi.load('user32.dll');

// Define constants
const WINEVENT_OUTOFCONTEXT = 0x0000;
const EVENT_OBJECT_FOCUS = 0x8005;
const EVENT_MIN = 0x00000001;
const EVENT_MAX = 0x7FFFFFFF;

const winCallback = (hWinEventHook, event, hwnd, idObject, idChild, dwEventThread, dwmsEventTime) => {
    console.log("Triggered")
    if (event === EVENT_OBJECT_FOCUS) {
        // Trigger the JavaScript function when the focus event occurs
        getCurrentAppName();
    }
};

// Define the WinEventProc callback function (signature: HWINEVENTHOOK, DWORD, HWND, LONG, LONG, DWORD, DWORD)
const WinEventProc = koffi.proto('void winCallback(HWINEVENTHOOK, DWORD, HWND, LONG, LONG, DWORD, DWORD)')

const SetWinEventHook = user32.func('SetWinEventHook', 'HWINEVENTHOOK', [DWORD, DWORD, HMODULE, koffi.pointer(WinEventProc), DWORD, DWORD, DWORD]);

let callback = koffi.register(winCallback, koffi.pointer(WinEventProc))

// Hook for EVENT_OBJECT_FOCUS
const hEventHook = SetWinEventHook(EVENT_OBJECT_FOCUS, EVENT_OBJECT_FOCUS, null, callback, 0, 0, WINEVENT_OUTOFCONTEXT);
console.log(hEventHook)


// Keep the script running
while(1) {
    continue
}
