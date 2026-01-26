const { BrowserWindow, Menu, globalShortcut, ipcMain } = require("electron");
const Console = require("../../assets/logger");
const path = require("path");
const packageJson = require("../../../package.json");

module.exports = function create_main_window()
{
  
    try {

      const window = new BrowserWindow({
        width: 1200,
        height: 675,
        frame: false,
        backgroundColor: '#0f0f0f',

        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
          nodeIntegration: false,
          contextIsolation: true,
        },

        show: false,
      })


      new Console(window);

      Menu.setApplicationMenu(null);

      window.loadURL("http://localhost:5173");


      // Activer les popups
      window.webContents.setWindowOpenHandler(({ url }) => {

        console.log("Ouverture d'une popup vers :", url);

        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            width: 600,
            height: 800,
            parent: window,
            modal: false,
            title: "Silvernote - Connexion",
            autoHideMenuBar: true,
            webPreferences: {
              nodeIntegration: false,
              contextIsolation: true,
              preload: path.join(__dirname, 'preload.js'),
              session: window.webContents.session 
            }
          }
        };

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
      });

      window.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
        console.error(`Erreur de chargement de la fenêtre : ${errorDescription} (${errorCode})`);
      });

      return window;
      
    } catch (err) {
      console.error(err);
    }
    
};
