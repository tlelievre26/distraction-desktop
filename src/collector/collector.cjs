//Just including this file as an example so that git tracks the directory structure
//I don't actually remember what this collector folder was supposed to be for, or how its meant to be different from the api_recievers folder
const {
     GetDefaultPrinter
} = require ("win32-api/util")

const printerName = GetDefaultPrinter();

//const child = spawn('notepad.exe');
//const hWnd = await FindWindow(0,0,'Notepad',null);

 //console.log(printerName);
 //console.log("Hello world");