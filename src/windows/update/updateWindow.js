const { BrowserWindow, globalShortcut } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
const create_main_window = require("../main/mainWindow.js");
const { dialog } = require("electron");

module.exports = function create_update_window()
{

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

    // win.loadFile(path.join(__dirname, "index.html"));
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
      dialog.showMessageBox(win, {
        type: "info",
        title: "Mise à jour Silvernote disponible",
        message: "Une nouvelle version de Silvernote est disponible",
        detail: "Voulez vous la télécherger ?",
        buttons: ["Plus tard", "Installer"],
      }).then((result) => {
        if (result.response === 1) {
          autoUpdater.quitAndInstall();
        }
      });
    });

    autoUpdater.on("update-not-available", () => {
      sendStatus("Aucune mise à jour. Lancement...");
      if (!win.isDestroyed()) win.close();
    });

    autoUpdater.on("error", (err) => {
      log.error(err);
      sendStatus(`Erreur mise à jour : ${err}`);
      if (!win.isDestroyed()) win.close();
    });

    // Lancer la vérification
    autoUpdater.checkForUpdates();

    // Timeout sécurité (30s)
    setTimeout(() => {
      if (!resolved) {
        log.warn("Auto-update timeout");
        sendStatus("Timeout. Lancement de l'application...");
        if (!win.isDestroyed()) win.close();
      }
    }, 30_000);

};
