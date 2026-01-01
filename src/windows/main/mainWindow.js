const { BrowserWindow, Menu, globalShortcut } = require("electron");
const Console = require("../../assets/logger");

module.exports = function create_main_window() {
  return new Promise((resolve, reject) => {
    try {
      const window = new BrowserWindow({
        width: 1200,
        height: 675,
        frame: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: true,
          disableHardwareAcceleration: true,
        },
        show: false,
      });

      new Console(window);

      Menu.setApplicationMenu(null);

      window.loadURL("https://app.silvernote.fr");

      globalShortcut.register("CommandOrControl+Shift+I", () => {
        if (window) {
          window.webContents.openDevTools({ mode: "detach" });
        }
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
