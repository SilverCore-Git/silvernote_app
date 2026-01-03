const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('updaterAPI', {
  onUpdateStatus: (callback) => ipcRenderer.on('update-status', (_event, value) => callback(value))
});
