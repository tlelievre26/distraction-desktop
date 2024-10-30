const { parentPort, threadId } = require('worker_threads');

const koffi = require('koffi');

const {
  DWORD,
  HMODULE
} = require('./winapi-types');
const { 
  WinEventProc,
  PeekMessage,
  GetWindowThreadProcessId,
  OpenProcess,
  GetModuleFileNameExA,
  GetFileVersionInfoA,
  GetFileVersionInfoSizeA,
  VerQueryValueA,
  GetLastError
} = require('./winapi-functions');

// Load necessary WinAPI functions
const lib = koffi.load('user32.dll');

parentPort.on('message', (message) => {
  if(message === 'end-session') {
    parentPort.postMessage({ debug: `Worker thread on process ${threadId} is exiting`});
    cleanupAndExit();
  }
});
parentPort.postMessage({ debug: `Worker thread on process ${threadId}`});

// Define constants
const WINEVENT_OUTOFCONTEXT = 0x0000;
const WINEVENT_SKIPOWNPROCESS = 0x0002;
// const EVENT_OBJECT_FOCUS = 0x8005;
const EVENT_SYSTEM_FOREGROUND = 0x0003;

const SetWinEventHook = lib.func('SetWinEventHook', 'HWINEVENTHOOK', [DWORD, DWORD, HMODULE, koffi.pointer(WinEventProc), DWORD, DWORD, DWORD]);
const UnhookWinEvent = lib.func('BOOL UnhookWinEvent(HWINEVENTHOOK hWinEventHook)');

// eslint-disable-next-line no-unused-vars
const winCallback = (hWinEventHook, event, hwnd, idObject, idChild, dwEventThread, dwmsEventTime) => {
  if (event === EVENT_SYSTEM_FOREGROUND) {

    // Trigger the JavaScript function when the focus event occurs

    var ptr = [null];
    const MAXPATH = 260;
    const filepath = Buffer.alloc(MAXPATH);

    GetWindowThreadProcessId(hwnd, ptr);
    if (ptr[0] === null) {
      parentPort.postMessage({ error: `Failed to get process ID: ${GetLastError()}`});
      return;
    }
       
    const process = OpenProcess(0x1000 | 0x010, false, ptr[0]);
    if (process === null) {
      parentPort.postMessage({ error: `Failed to open process with ID ${ptr[0]}: ${GetLastError()}`});

      return;
    }

    if (!GetModuleFileNameExA(process, null, filepath, MAXPATH)) {
      parentPort.postMessage({ error: `Failed to get module file name: ${GetLastError()}`});
      return;
    }

    const fileSize = GetFileVersionInfoSizeA(filepath, null);
    if (fileSize === 0) {
      parentPort.postMessage({ error: `Failed to get file version info size for filepath ${koffi.decode(filepath, "string")}: ${GetLastError()}`});
      return;
    }
    // console.log("File size: " + fileSize);
    const appInfo = Buffer.alloc(fileSize);
    if (!GetFileVersionInfoA(filepath, 0, fileSize, appInfo)) {
      parentPort.postMessage({ error: `Failed to get file version info for filepath ${koffi.decode(filepath, "string")}: ${GetLastError()}`});
      return;
    }
 
    const fullAppInfo = Buffer.alloc(256);
    const fullAppInfoSize = Buffer.alloc(16);
    const infoString = Buffer.from('\\StringFileInfo\\040904b0\\ProductName', 'utf8');
    if (!VerQueryValueA(appInfo, infoString, fullAppInfo, fullAppInfoSize)) {
      parentPort.postMessage({ error: `Failed to query version value: ${GetLastError()}`});
      return;
    }
    // console.log('fullAppInfoSize: ', koffi.decode(fullAppInfoSize, "int"));
    const productNamePtr = koffi.decode(fullAppInfo, "string");
    // console.log("Product name: " + productNamePtr);
    if(!productNamePtr.includes("Operating System")) {
      // Ignore from Microsoft OS
      parentPort.postMessage({ windowTitle: productNamePtr });
    }
  }
  return 0;
};

const callback = koffi.register(winCallback, koffi.pointer(WinEventProc));
const hEventHook = SetWinEventHook(EVENT_SYSTEM_FOREGROUND, EVENT_SYSTEM_FOREGROUND, null, callback, 0, 0, WINEVENT_OUTOFCONTEXT | WINEVENT_SKIPOWNPROCESS);

const messageLoop = () => {
  const message = Buffer.alloc(100);
  setInterval(() => {
    PeekMessage(message, null, 0, 0, 1); // For some reason the callback stops returning if we don't have this line? Absolutely no clue why or how
  }, 50);
};

const cleanupAndExit = () => { 
  koffi.unregister(callback);
  UnhookWinEvent(hEventHook);
  parentPort.close();
  process.exit(0);
};

messageLoop();
