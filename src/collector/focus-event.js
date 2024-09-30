const { isMainThread, parentPort } = require('worker_threads');

const koffi = require('koffi');

//const getCurrentAppName = require('./collector');
const {
  DWORD,
  HMODULE
} = require('./winapi-types');
const { 
  //GetLastError
  WinEventProc,
  GetMessageA,
  GetForegroundWindow,
  GetWindowThreadProcessId,
  OpenProcess,
  GetModuleFileNameExA,
  GetFileVersionInfoA,
  GetFileVersionInfoSizeA,
  VerQueryValueA
} = require('./winapi-functions');
const { appData } = require('../api_recievers/influxqueries');

// Load necessary WinAPI functions
const lib = koffi.load('user32.dll');

// Define constants
const WINEVENT_OUTOFCONTEXT = 0x0000;
const WINEVENT_SKIPOWNPROCESS = 0x0002;
const EVENT_OBJECT_FOCUS = 0x8005;

// const setCallback = () => {
const message = Buffer.alloc(100);

const winCallback = (hWinEventHook, event, hwnd, idObject, idChild, dwEventThread, dwmsEventTime) => {
  //parentPort.postMessage("User has switched tabs");
  if (event === EVENT_OBJECT_FOCUS) {
    // Trigger the JavaScript function when the focus event occurs
    let handle = GetForegroundWindow();

    var ptr = [null];
    const MAXPATH = 260;
    const filepath = Buffer.alloc(260);
       
    GetWindowThreadProcessId(handle, ptr);
       
    const process = OpenProcess(0x1000 | 0x010, false, ptr[0]);
    // console.log("Process Id:", process) 
    const query = GetModuleFileNameExA(process, null, filepath, MAXPATH);
    // console.log(query)
    const processName = filepath.toString('utf8').replace(/\0/g, '');
    //console.log(processName);
    const fileSize = GetFileVersionInfoSizeA(filepath, null);
    //console.log(fileSize);
    // console.log("Ive survived")
    const appInfo = Buffer.alloc(fileSize);
    GetFileVersionInfoA(filepath, 0, fileSize, appInfo);
    //console.log(appInfo.toString('utf8').replace(/\0/g, ''));
    //console.log("\n");
    const fullAppInfo = Buffer.alloc(100);
    const fullAppInfoSize = Buffer.alloc(100);
    const infoString = Buffer.from('\\StringFileInfo\\040904b0\\ProductName', 'utf8');
    VerQueryValueA(appInfo, infoString, fullAppInfo, fullAppInfoSize);
    const productNamePtr = koffi.decode(fullAppInfo, "string");
    appData("Windows", productNamePtr, 1);
    parentPort.postMessage(productNamePtr);
  }
  return 0;
};
const SetWinEventHook = lib.func('SetWinEventHook', 'HWINEVENTHOOK', [DWORD, DWORD, HMODULE, koffi.pointer(WinEventProc), DWORD, DWORD, DWORD]);
const UnhookWinEvent = lib.func('BOOL UnhookWinEvent(HWINEVENTHOOK hWinEventHook)');

const callback = koffi.register(winCallback, koffi.pointer(WinEventProc));
    
// Hook for EVENT_OBJECT_FOCUS
const hEventHook = SetWinEventHook(EVENT_OBJECT_FOCUS, EVENT_OBJECT_FOCUS, null, callback, 0, 0, WINEVENT_OUTOFCONTEXT | WINEVENT_SKIPOWNPROCESS);
const res = GetMessageA(message, null, 0, 0);

parentPort.postMessage("Beginning callback flow");

parentPort.on('exit', () => {
  koffi.unregister(callback);
  UnhookWinEvent(hEventHook);
});
//console.log(res);

//return productName;
// };
// module.exports = setCallback;