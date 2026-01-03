const { BrowserWindow, globalShortcut } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
const create_main_window = require("../main/mainWindow.js");

module.exports = function create_update_window() {
  return new Promise((resolve) => {
    let resolved = false;

    const win = new BrowserWindow({
      width: 300,
      height: 400,
      frame: false,
      resizable: false,
      maximizable: false,
      fullscreenable: false,
      title: "Mise à jour - Silvernote",
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    const safeResolve = (window) => {
      if (!resolved) {
        resolved = true;
        resolve(window);
      }
    };

    win.loadFile(path.join(__dirname, "index.html"));
    win.once("ready-to-show", () => win.show());

    globalShortcut.register("CommandOrControl+Shift+I+U", () => {
      if (!win.isDestroyed()) {
        win.webContents.openDevTools({ mode: "detach" });
      }
    });

    // Logger
    autoUpdater.logger = log;
    autoUpdater.logger.transports.file.level = "info";
    log.info("Auto-updater started");

    const sendStatus = (msg) => {
      if (!win.isDestroyed()) {
        win.webContents.send("update-status", msg);
      }
    };

    sendStatus("Vérification des mises à jour...");

    // EVENTS
    autoUpdater.on("update-available", (info) => {
      sendStatus(`Mise à jour ${info.version} disponible. Téléchargement...`);
    });

    autoUpdater.on("download-progress", (progress) => {
      const percent = Math.round(progress.percent);
      sendStatus(`Téléchargement : ${percent}%`);
    });

    autoUpdater.on("update-downloaded", () => {
      sendStatus("Mise à jour téléchargée. Redémarrage...");
      setTimeout(() => {
        autoUpdater.quitAndInstall();
      }, 1500);
    });

    autoUpdater.on("update-not-available", () => {
      sendStatus("Aucune mise à jour. Lancement...");
      setTimeout(() => {
        if (!win.isDestroyed()) win.close();
        create_main_window().then(safeResolve);
      }, 800);
    });

    autoUpdater.on("error", (err) => {
      log.error(err);
      sendStatus(`Erreur mise à jour : ${err}`);
      setTimeout(() => {
        if (!win.isDestroyed()) win.close();
        create_main_window().then(safeResolve);
      }, 2000);
    });

    // Lancer la vérification
    autoUpdater.checkForUpdates();

    // Timeout sécurité (30s)
    setTimeout(() => {
      if (!resolved) {
        log.warn("Auto-update timeout");
        sendStatus("Timeout. Lancement de l'application...");
        setTimeout(() => {
          if (!win.isDestroyed()) win.close();
          create_main_window().then(safeResolve);
        }, 1000);
      }
    }, 30_000);
  });
};
