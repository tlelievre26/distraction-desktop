//Just including this file as an example so that git tracks the directory structure
//I don't actually remember what this collector folder was supposed to be for, or how its meant to be different from the api_recievers folder
// ES6 syntax: import koffi from 'koffi';
const koffi = require('koffi');
// Load the shared library
const lib = koffi.load('user32.dll');
const kern = koffi.load('kernel32.dll');
const sys = koffi.load('Api-ms-win-core-version-l1-1-0.dll');
const ps = koffi.load('psapi.dll')
const version = koffi.load('version.dll');

const DWORD = koffi.alias('DWORD', 'uint32_t');
const DWORD2 = koffi.types.uint32_t;
const HANDLE = koffi.pointer('HANDLE', koffi.opaque());
const HWND = koffi.alias('HWND', HANDLE);
const BOOL = koffi.alias('BOOL', 'bool');
const HMODULE = koffi.alias('HMODULE', HANDLE)
const LPCSTR = koffi.alias('LPCSTR', 'const char*')
const LPVOID = koffi.alias('LPVOID', "void*")
const LPDWORD = koffi.alias('LPDWORD', "DWORD*")
const PUINT = koffi.alias('PUINT', 'uint32_t*')

const GetForegroundWindow = lib.func('__stdcall', 'GetForegroundWindow', 'void *', []);
const GetWindowTextA = lib.func('int __stdcall GetWindowTextA(void *, _Out_ char *, int)');
const GetWindowThreadProcessId = lib.func('DWORD __stdcall GetWindowThreadProcessId(HWND hWnd, _Out_ DWORD * lpdwProcessId)');
const GetModuleFileNameExA = ps.func('DWORD __stdcall GetModuleFileNameExA(HANDLE hProcess, HMODULE hModule, _Out_ char* filename, DWORD nsize)');
const QueryFullProcessImageNameA = kern.func('BOOL __stdcall QueryFullProcessImageNameA(HANDLE hProcess, DWORD dwFlags, _Out_ char** lpExeName, _Inout_ DWORD * lpdwSize)');
const OpenProcess = kern.func('HANDLE __stdcall OpenProcess(DWORD desiredAccess, BOOL bInheritHandle, DWORD dwProcessId)');
const GetFileVersionInfoA = version.func('BOOL GetFileVersionInfoA(LPCSTR lptstrFileName, DWORD dwHandle, DWORD dwLen, _Out_ LPVOID lpData)')
const GetFileVersionInfoSizeA = version.func('DWORD GetFileVersionInfoSizeA(LPCSTR lptstrFilename, _Out_ LPDWORD lpdwHandle)');
const GetLastError = kern.func('DWORD __stdcall GetLastError()');
const VerQueryValueA = version.func('BOOL VerQueryValueA(LPVOID pBlock, LPCSTR lpSubBlock, LPVOID *lplpBuffer, PUINT puLen)');
//const FormatMessage = kern.func('DWORD __stdcall FormatMessage(DWORD dwFlags, DWORD dwMessageId, DWORD dwLanguageId, _Out_ char * lpBuffer, DWORD nSize)');

let handle = GetForegroundWindow();

var ptr = [null];
let string2 = Buffer.alloc(200)
// let string4 = ['\0'.repeat(200)];
const MAXPATH = 260
const string4 = Buffer.alloc(260)
// GetWindowTextA(handle, string2, 200);
// console.log(string2.toString('utf8').replace(/\0/g, ''))

GetWindowThreadProcessId(handle, ptr);

let process = OpenProcess(0x1000 | 0x010, false, ptr[0]);
console.log("Process Id:", process) 

// console.log(GetLastError());

// let query = QueryFullProcessImageNameA(process, 0, string4, string4.length);

// console.log(GetLastError());
// console.log(query)
// console.log(string4)

let query = GetModuleFileNameExA(process, null, string4, MAXPATH);
console.log(query)

// const processName = string4.toString('utf8').replace(/\0/g, '')
// console.log(string4.toString('utf8').replace(/\0/g, ''))


const fileSize = GetFileVersionInfoSizeA(string4, null);
console.log(fileSize)
console.log("Ive survived")
const appInfo = Buffer.alloc(fileSize)
GetFileVersionInfoA(string4, 0, fileSize, appInfo)
console.log(appInfo.toString('utf8').replace(/\0/g, ''))
const fullAppInfo = Buffer.alloc(100);
const fullAppInfoSize = Buffer.alloc(100);
const infoString = Buffer.from('\\StringFileInfo\\040904b0\\ProductName', 'utf8')
VerQueryValueA(appInfo, infoString, fullAppInfo, fullAppInfoSize)
const productNamePtr = koffi.decode(fullAppInfo, "string")
console.log(productNamePtr);


console.log(GetLastError());
/*
while(1)
{
     handle = GetForegroundWindow();
     GetWindowThreadProcessId(handle, ptr);
     phandle = OpenProcess(0x0400, false, ptr[0]);
     /*QueryFullProcessImageNameA(phandle, 0, string4, string4.length);
     console.log(string4[0]);
     query = GetModuleFileNameExA(process, string4, string4.length);
     console.log(query);
}*/