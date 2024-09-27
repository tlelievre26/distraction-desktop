/* eslint-disable no-unused-vars */
const koffi = require('koffi');


const {
  DWORD,
  HANDLE,
  HWND, 
  BOOL,
  HMODULE,
  LPCSTR,
  LPVOID,
  LPDWORD,
  PUINT
} = require('./winapi-types');

const lib = koffi.load('user32.dll');
const kern = koffi.load('kernel32.dll');
const ps = koffi.load('psapi.dll');
const version = koffi.load('version.dll');

module.exports = {
  GetForegroundWindow: lib.func('void * __stdcall GetForegroundWindow()'),
  GetWindowTextA: lib.func('int __stdcall GetWindowTextA(void *, _Out_ char *, int)'),
  GetWindowThreadProcessId: lib.func('DWORD __stdcall GetWindowThreadProcessId(HWND hWnd, _Out_ DWORD * lpdwProcessId)'),
  GetModuleFileNameExA: ps.func('DWORD __stdcall GetModuleFileNameExA(HANDLE hProcess, HMODULE hModule, _Out_ char* filename, DWORD nsize)'),
  QueryFullProcessImageNameA: kern.func('BOOL __stdcall QueryFullProcessImageNameA(HANDLE hProcess, DWORD dwFlags, _Out_ char** lpExeName, _Inout_ DWORD * lpdwSize)'),
  OpenProcess: kern.func('HANDLE __stdcall OpenProcess(DWORD desiredAccess, BOOL bInheritHandle, DWORD dwProcessId)'),
  GetFileVersionInfoA: version.func('BOOL GetFileVersionInfoA(LPCSTR lptstrFileName, DWORD dwHandle, DWORD dwLen, _Out_ LPVOID lpData)'),
  GetFileVersionInfoSizeA: version.func('DWORD GetFileVersionInfoSizeA(LPCSTR lptstrFilename, _Out_ LPDWORD lpdwHandle)'),
  GetLastError: kern.func('DWORD __stdcall GetLastError()'),
  VerQueryValueA: version.func('BOOL __stdcall VerQueryValueA(LPVOID pBlock, LPCSTR lpSubBlock, LPVOID *lplpBuffer, PUINT puLen)'),
  GetMessageA: lib.func('BOOL __stdcall GetMessageA(_Out_ void* lpMsg, HWND hWnd, DWORD wMsgFilterMin, DWORD wMsgFilterMax)'),
  WinEventProc: koffi.proto('void __stdcall winCallback(HWINEVENTHOOK hWinEventHook, DWORD event, HWND hwnd, LONG idObject, LONG idChild, DWORD dwEventThread, DWORD dwmsEventTime)')
};
