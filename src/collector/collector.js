const koffi = require('koffi');

const {
     GetForegroundWindow,
     GetWindowThreadProcessId,
     OpenProcess,
     GetModuleFileNameExA,
     GetFileVersionInfoA,
     GetFileVersionInfoSizeA,
     VerQueryValueA,
     GetLastError
} = require('./winapi-functions')

const getCurrentAppName = () => {
     let handle = GetForegroundWindow();

     var ptr = [null];
     const MAXPATH = 260
     const string4 = Buffer.alloc(260)
     
     GetWindowThreadProcessId(handle, ptr);
     
     let process = OpenProcess(0x1000 | 0x010, false, ptr[0]);
     // console.log("Process Id:", process) 
     
     
     let query = GetModuleFileNameExA(process, null, string4, MAXPATH);
     // console.log(query)
     
     const processName = string4.toString('utf8').replace(/\0/g, '')
     console.log(processName)
     
     
     const fileSize = GetFileVersionInfoSizeA(string4, null);
     // console.log(fileSize)
     // console.log("Ive survived")
     const appInfo = Buffer.alloc(fileSize)
     GetFileVersionInfoA(string4, 0, fileSize, appInfo)
     // console.log(appInfo.toString('utf8').replace(/\0/g, ''))
     const fullAppInfo = Buffer.alloc(100);
     const fullAppInfoSize = Buffer.alloc(100);
     const infoString = Buffer.from('\\StringFileInfo\\040904b0\\ProductName', 'utf8')
     VerQueryValueA(appInfo, infoString, fullAppInfo, fullAppInfoSize)
     const productNamePtr = koffi.decode(fullAppInfo, "string")
     console.log(productNamePtr);
     
     console.log(GetLastError());
}

module.exports = getCurrentAppName