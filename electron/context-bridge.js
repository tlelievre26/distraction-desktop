const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
    'electronAPI',
    {
      startSession: (...args) => ipcRenderer.send('begin-session', ...args)
    }
  )