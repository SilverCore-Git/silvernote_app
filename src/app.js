const { app, BrowserWindow, Menu, globalShortcut, shell, protocol } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
const path = require("path");
const https = require("https");
const Console = require("./assets/logger");
const initializeDiscordRPC = require("./assets/dicord_rpc");

const if_dev = true;
const isLinux = process.platform === "linux";

let mainWindow = null; // ✅ important !

// ✅ Vérifier la connexion Internet
function isOnline(timeout = 3000) {
  return new Promise((resolve) => {
    const req = https.request(
      {
        host: "www.google.com",
        method: "HEAD",
        timeout,
      },
      () => resolve(true)
    );

    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// ✅ Fenêtre principale
async function create_main_window() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      partition: "persist:silvernote",
      webSecurity: false,
    },
  });

  const console = new Console(mainWindow);
  Menu.setApplicationMenu(null);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("about:")) {
      return { action: "allow" };
    }

    console.log(url)

    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("did-create-window", (childWindow) => {
    childWindow.webContents.session = mainWindow.webContents.session;
  });

  mainWindow.loadFile(path.join(__dirname, "dist/index.html"));

  console.log("Initialising shortcut...");

  globalShortcut.register("CommandOrControl+Shift+I", () => {
    if (mainWindow) {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    }
  });

  if (if_dev) {
    console.warn("App en mode dev");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  // ✅ Discord RPC update dynamique
  const { setActivity } = initializeDiscordRPC();
  mainWindow.on("page-title-updated", (event, title) => {
    setActivity(title);
  });
}

// ✅ Fenêtre "mise à jour"
function create_update_window() {
  const win = new BrowserWindow({
    width: 300,
    height: 400,
    frame: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    title: "Vérification des mises à jour...",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  win.loadFile(path.join(__dirname, "./mini_window/index.html"));

  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = "info";
  autoUpdater.checkForUpdates();

  let update = false;

  autoUpdater.on("checking-for-update", () => console.log("Checking for update..."));
  autoUpdater.on("update-available", () => {
    console.log("Downloading update...");
    update = true;
  });

  autoUpdater.on("update-not-available", () => {
    win.close();
    create_main_window();
  });

  autoUpdater.on("error", () => {
    create_main_window();
    setTimeout(() => win.close(), 1000);
  });

  autoUpdater.on("update-downloaded", () => {
    autoUpdater.quitAndInstall();
  });

  setTimeout(() => {
    if (!update && win && !win.isDestroyed() && win.isVisible()) {
      console.error("Timeout sur la mise à jour");
      win.close();
      create_main_window();
    }
  }, 30 * 1000);
}

// ✅ Gestion du protocole custom Clerk OAuth
app.setAsDefaultProtocolClient("silvernote");

// ✅ Callback : silvernote://auth/callback
app.on("open-url", (event, url) => {
  event.preventDefault();
  if (mainWindow) {
    mainWindow.webContents.send("oauth-callback", url);
  }
});


protocol.registerSchemesAsPrivileged([
  {
    scheme: "silvernote",
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      stream: true,
    },
  },
]);

app.whenReady().then(async () => {

  console.log("Lancement direct (sans Express)");

  // 🔄 activer si tu veux les updates
  // if (await isOnline() && !isLinux) create_update_window();
  // else create_main_window();

  create_main_window();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) create_main_window();
  });
});

// ✅ Fermeture app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
