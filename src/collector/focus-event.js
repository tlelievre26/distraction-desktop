const {parentPort } = require('worker_threads');

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
    const productNamePtr = Buffer.alloc(1024);
    const handle = GetForegroundWindow();
    if( koffi.decode(handle, "string") === null)
    {
      parentPort.postMessage("GetForegroundWindow returned null. According to documentation, potential reasons include: when a window is losing activation.");
    }
    else
    {
    //productNamePtr.write(handle);
      /*var ptr = [null];
      const MAXPATH = 260;
      const filepath = Buffer.alloc(260);
       
      const processId = GetWindowThreadProcessId(handle, ptr);
      //console.log(processId);
      if(koffi.decode(processId, "int") === 0)
      {
        parentPort.postMessage("Unable to get foreground window's process ID");
      }
      else
      {
        const process = OpenProcess(0x1000 | 0x010, false, ptr[0]);

        if(koffi.decode(process, "string") === null)
        {
          parentPort.postMessage("Unable to open process");
        }
        else
        {
        // console.log("Process Id:", process) 
          const query = GetModuleFileNameExA(process, null, filepath, MAXPATH);
          if(koffi.decode(query, "int") === 0)
          {
            parentPort.postMessage("Unable to get filepath");
          }
          else
          {*/
      /*const fileSize = GetFileVersionInfoSizeA(filepath, null);

            if(fileSize == 0)
            {
              productNamePtr = "Unable to get version info size";
            }
            else
            {
              const appInfo = Buffer.alloc(fileSize);
              const versioninfo = GetFileVersionInfoA(filepath, 0, fileSize, appInfo);
              if(versioninfo == 0)
              {
                productNamePtr = "Unable to get version info";
              }
              else
              {
                //console.log(appInfo.toString('utf8').replace(/\0/g, ''));
                //console.log("\n");
                const fullAppInfo = Buffer.alloc(100);
                const fullAppInfoSize = Buffer.alloc(100);
                const infoString = Buffer.from('\\StringFileInfo\\040904b0\\ProductName', 'utf8');
                const getProductName = VerQueryValueA(appInfo, infoString, fullAppInfo, fullAppInfoSize);

                if(getProductName == 0)
                {
                  productNamePtr = "Unable to get product name";
                }
                else
                {
                  productNamePtr = koffi.decode(fullAppInfo, "string");
                  console.log(productNamePtr);
                  appData("Windows", productNamePtr, 1);
                }
              }*/
    }
  }
  // console.log(query)
  //const processName = filepath.toString('utf8').replace(/\0/g, '');
  //console.log(processName);
  //}
  //}
  //}
  //parentPort.postMessage(productNamePtr);
  //}
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