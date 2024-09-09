//Just including this file as an example so that git tracks the directory structure
//I don't actually remember what this collector folder was supposed to be for, or how its meant to be different from the api_recievers folder
const {
     GetDefaultPrinter
} = require ("win32-api/util")

     const printerName = GetDefaultPrinter();
     <h1>Hello World!</h1>
     //<h1>printerName</h1>
     //console.log(printerName);
     //console.log("Hello World!");

// ES6 syntax: import koffi from 'koffi';
const koffi = require('koffi');
// Load the shared library
const lib = koffi.load('user32.dll');


// Find functions
let name = "Visual Studio Code";
const GetAsyncKeyState = lib.func('__stdcall', 'GetAsyncKeyState', 'short', ['int']);
const GetForegroundWindow = lib.func('__stdcall', 'GetForegroundWindow', 'void *', []);
const GetWindowTextA = lib.func('int GetWindowTextA(void *, _Out_ char *, int)');
let handle = GetForegroundWindow();
console.log(handle);
let string = ['\0'.repeat(200)];
let txt = GetWindowTextA(handle, string, 200)
//console.log(txt);
while(1)
{
  handle = GetForegroundWindow();
  txt = GetWindowTextA(handle, string, 200);
  console.log(string);
}