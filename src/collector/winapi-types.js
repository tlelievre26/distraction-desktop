const koffi = require('koffi');

const HANDLE = koffi.pointer('HANDLE', koffi.opaque())

module.exports = {
    DWORD: koffi.alias('DWORD', 'uint32_t'),
    HANDLE,
    HWND: koffi.alias('HWND', HANDLE),
    BOOL: koffi.alias('BOOL', 'bool'),
    HMODULE: koffi.alias('HMODULE', HANDLE),
    LPCSTR: koffi.alias('LPCSTR', 'const char*'),
    LPVOID: koffi.alias('LPVOID', "void*"),
    LPDWORD: koffi.alias('LPDWORD', "DWORD*"),
    UINT: koffi.alias('UINT', 'uint32_t'),
    PUINT: koffi.alias('PUINT', 'uint32_t*'),
    HWINEVENTHOOK: koffi.alias('HWINEVENTHOOK', HANDLE),
    LONG: koffi.alias('LONG', 'long'),
  };