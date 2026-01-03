const { BrowserWindow, Menu, globalShortcut, ipcMain } = require("electron");
const Console = require("../../assets/logger");
const path = require("path");
const packageJson = require("../../../package.json");

module.exports = function create_main_window() {
  return new Promise((resolve, reject) => {
    try {
      const window = new BrowserWindow({
        width: 1200,
        height: 675,
        frame: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          webviewTag: true,
        },
        show: false,
      });

      new Console(window);

      Menu.setApplicationMenu(null);

      window.loadFile(path.join(__dirname, "./index.html"));

      // Activer les popups
      window.webContents.setWindowOpenHandler(({ url }) => {
        // Ici on ouvre dans une nouvelle BrowserWindow
        const popup = new BrowserWindow({
          width: 800,
          height: 600,
          parent: window, // optionnel : fenêtre enfant
          modal: false,   // pas modal
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true,
            preload: path.join(__dirname, 'preload.js')
          },
        });

        popup.loadURL(url);
        return { action: 'deny' }; // empêche Electron de créer sa propre popup
      });

      globalShortcut.register("CommandOrControl+Shift+I", () => {
        if (window) {
          window.webContents.openDevTools({ mode: "detach" });
        }
      });

      // Écouteurs IPC pour les boutons de la titlebar
      ipcMain.on('window-minimize', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win) win.minimize();
      });

      ipcMain.on('window-maximize', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win) {
          if (win.isMaximized()) win.unmaximize();
          else win.maximize();
        }
      });

      ipcMain.on('window-close', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win) win.close();
      });

      ipcMain.handle('get-version', () => {
        return packageJson.version;
      });

      window.once("ready-to-show", () => {
        window.show();
        resolve({ window });
      });

      window.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
        reject(new Error(`Erreur de chargement de la fenêtre : ${errorDescription} (${errorCode})`));
      });
    } catch (err) {
      reject(err);
    }
  });
};
