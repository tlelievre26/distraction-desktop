const { app, BrowserWindow } = require("electron")
const path = require('path');

require('dotenv').config(); //Load environment variables

const createWindow = () => {
    let win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'), // Optional if using preload script
        nodeIntegration: true,
        contextIsolation: false,
      }
    })
  
    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
      win.loadURL('http://localhost:8080'); // Load from webpack-dev-server
    } else {
      win.loadFile(path.join(__dirname, '../dist/index.html')); // Load the production build
    }

  }

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// app.on('activate', () => {
//   if (mainWindow === null) {
//     createWindow();
//   }
// });