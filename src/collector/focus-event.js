const { parentPort, threadId } = require('worker_threads');

const koffi = require('koffi');

//const getCurrentAppName = require('./collector');

const {
  DWORD,
  HMODULE
} = require('./winapi-types');
const { 
  GetWindowTextA,
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
const { appData } = require('../api_recievers/influxqueries');

// Load necessary WinAPI functions
const lib = koffi.load('user32.dll');

var exitWorker = false; // You should exit yourself, NOW
// Don't want to just do worker.terminate(), could lead to corrupted DB writes


parentPort.on('message', (message) => {
  parentPort.postMessage('Recieved msg ' + message);
  if(message === 'end-session') {
    parentPort.postMessage(`Worker exiting`);
    cleanupAndExit();
  }
});

// Define constants
const WINEVENT_OUTOFCONTEXT = 0x0000;
const WINEVENT_SKIPOWNPROCESS = 0x0002;
const EVENT_OBJECT_FOCUS = 0x8005;
const EVENT_SYSTEM_FOREGROUND = 0x0003;

const SetWinEventHook = lib.func('SetWinEventHook', 'HWINEVENTHOOK', [DWORD, DWORD, HMODULE, koffi.pointer(WinEventProc), DWORD, DWORD, DWORD]);
const UnhookWinEvent = lib.func('BOOL UnhookWinEvent(HWINEVENTHOOK hWinEventHook)');

const winCallback = (hWinEventHook, event, hwnd, idObject, idChild, dwEventThread, dwmsEventTime) => {
  if (event === EVENT_SYSTEM_FOREGROUND) {

    // Trigger the JavaScript function when the focus event occurs

    var ptr = [null];
    const MAXPATH = 260;
    const filepath = Buffer.alloc(MAXPATH);
       
    const windowName = Buffer.alloc(100);
    GetWindowTextA(hwnd, windowName, 100);
    console.log("Window name: " + windowName);

    GetWindowThreadProcessId(hwnd, ptr);
    if (ptr[0] === null) {
      console.error("Failed to get process ID: " + GetLastError());
      return;
    }
    // console.log("Process ID: " + ptr);
       
    const process = OpenProcess(0x1000 | 0x010, false, ptr[0]);
    if (process === null) {
      console.error("Failed to open process: " + GetLastError());
      return;
    }

    if (!GetModuleFileNameExA(process, null, filepath, MAXPATH)) {
      console.error("Failed to get module file name: " + GetLastError());
      return;
    }

    // const processName = filepath.toString('utf8', 0, MAXPATH).replace(/\0/g, '');
    // console.log("Process name: " + processName.toString('utf8').replace(/\0/g, ''));


    const fileSize = GetFileVersionInfoSizeA(filepath, null);
    if (fileSize === 0) {
      console.error("Failed to get file version info size: " + GetLastError());
      return;
    }
    // console.log("File size: " + fileSize);
    const appInfo = Buffer.alloc(fileSize);
    if (!GetFileVersionInfoA(filepath, 0, fileSize, appInfo)) {
      console.error("Failed to get file version info: " + GetLastError());
      return;
    }
 
    const fullAppInfo = Buffer.alloc(256);
    const fullAppInfoSize = Buffer.alloc(16);
    const infoString = Buffer.from('\\StringFileInfo\\040904b0\\ProductName', 'utf8');
    if (!VerQueryValueA(appInfo, infoString, fullAppInfo, fullAppInfoSize)) {
      console.error("Failed to query version value: " + GetLastError());
      return;
    }
    // console.log('fullAppInfoSize: ', koffi.decode(fullAppInfoSize, "int"));
    const productNamePtr = koffi.decode(fullAppInfo, "string");
    // console.log("Product name: " + productNamePtr);
    parentPort.postMessage(productNamePtr);
    return productNamePtr;
  }
  return 0;
};

const callback = koffi.register(winCallback, koffi.pointer(WinEventProc));
const hEventHook = SetWinEventHook(EVENT_SYSTEM_FOREGROUND, EVENT_SYSTEM_FOREGROUND, null, callback, 0, 0, WINEVENT_OUTOFCONTEXT | WINEVENT_SKIPOWNPROCESS);
parentPort.postMessage(`Worker thread on process ${threadId}`);

const messageLoop = () => {
  const message = Buffer.alloc(100);
  setInterval(() => {
    const findMessage = PeekMessage(message, null, 0, 0, 1); // For some reason the callback stops returning if we don't have this line? Absolutely no clue why or how
    if (findMessage) {
      parentPort.postMessage(koffi.decode(fullAppInfo, "string"));
      appData("Windows", message, 1);
    }
  }, 50);
};

const cleanupAndExit = () => { 
  koffi.unregister(callback);
  UnhookWinEvent(hEventHook);
  parentPort.close();
  process.exit(0);
};

messageLoop();
