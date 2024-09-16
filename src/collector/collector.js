//Just including this file as an example so that git tracks the directory structure
//I don't actually remember what this collector folder was supposed to be for, or how its meant to be different from the api_recievers folder
// ES6 syntax: import koffi from 'koffi';
const koffi = require('koffi');
// Load the shared library
const lib = koffi.load('user32.dll');
const kern = koffi.load('kernel32.dll');
const sys = koffi.load('Api-ms-win-core-version-l1-1-0.dll');
const ps = koffi.load('Psapi.dll')

const DWORD = koffi.alias('DWORD', 'uint32_t');
const DWORD2 = koffi.types.uint32_t;
const HANDLE = koffi.pointer('HANDLE', koffi.opaque());
const HWND = koffi.alias('HWND', HANDLE);
const BOOL = koffi.alias('BOOL', 'int');

const GetForegroundWindow = lib.func('__stdcall', 'GetForegroundWindow', 'void *', []);
const GetWindowTextA = lib.func('int __stdcall GetWindowTextA(void *, _Out_ char *, int)');
const GetWindowThreadProcessId = lib.func('DWORD __stdcall GetWindowThreadProcessId(HWND hWnd, _Out_ DWORD * lpdwProcessId)');
const GetModuleFileNameExA = ps.func('DWORD __stdcall GetModuleFileNameExA(HANDLE hModule, _Out_ char* filename, DWORD nsize)');
const QueryFullProcessImageNameA = kern.func('BOOL __stdcall QueryFullProcessImageNameA(HANDLE hProcess, DWORD dwFlags, _Out_ char** lpExeName, _Inout_ DWORD * lpdwSize)');
const OpenProcess = kern.func('HANDLE __stdcall OpenProcess(DWORD desiredAccess, BOOL bInheritHandle, DWORD dwProcessId)');
const GetLastError = kern.func('DWORD __stdcall GetLastError()');
//const FormatMessage = kern.func('DWORD __stdcall FormatMessage(DWORD dwFlags, DWORD dwMessageId, DWORD dwLanguageId, _Out_ char * lpBuffer, DWORD nSize)');

let handle = GetForegroundWindow();

var ptr = [null];
let string = ['\0'.repeat(200)];
let string4 = ['\0'.repeat(200)];
//GetWindowTextA(handle, string, 200);

GetWindowThreadProcessId(handle, ptr);
let process = OpenProcess(0x400, false, ptr[0]);

//let query = QueryFullProcessImageNameA(process, 0, string4, string4.length);
let query = GetModuleFileNameExA(process, string4, string4.length);
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