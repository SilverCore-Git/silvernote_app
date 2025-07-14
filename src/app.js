const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const path = require('path');
const https = require('https');
const Console = require('./logger');

const if_dev = process.env.DEV == 'true';
const isLinux = process.platform === 'linux';

// Vérifie la connexion Internet
function isOnline(timeout = 3000) {
  return new Promise((resolve) => {
    const req = https.request(
      {
        host: 'www.google.com',
        method: 'HEAD',
        timeout,
      },
      () => resolve(true)
    );

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function create_main_window() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      disableHardwareAcceleration: true,
    },
  });

  const console = new Console(win);
  Menu.setApplicationMenu(null);

  
  //win.loadFile(path.join(__dirname, './dist/index.html'));
  win.loadURL('https://app.silvernote.fr');

  console.log('Initialising shortcut...');

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    if (win) {
      win.webContents.openDevTools({ mode: 'detach' });
    }
  });

  if (if_dev) {
    console.warn('App en mode dev');
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

function create_update_window() {
  const win = new BrowserWindow({
    width: 300,
    height: 400,
    frame: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    title: 'Vérification des mises à jour...',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  globalShortcut.register('CommandOrControl+Shift+I+U', () => {
    if (win) {
      win.webContents.openDevTools({ mode: 'detach' });
    }
  });

  win.loadFile(path.join(__dirname, './mini_window/index.html'));

  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';
  autoUpdater.checkForUpdates();

  let update = false;

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
  });

  autoUpdater.on('update-available', () => {
    console.log('Downloading update...');
    update = true;
  });

  autoUpdater.on('update-not-available', () => {
    win.close();
    create_main_window();
  });

  autoUpdater.on('error', () => {
    create_main_window();
    setTimeout(() => {
      win.close();
    }, 1000);
  });

  autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
  });

  setTimeout(() => {
    if (!update && win && !win.isDestroyed() && win.isVisible()) {
      console.error('Timeout sur la mise à jour');
      win.close();
      create_main_window();
    }
  }, 30 * 1000);
}

app.whenReady().then(async () => {
  // Tu peux commenter ou décommenter selon si tu veux activer les mises à jour :
  // if (await isOnline() && !isLinux) {
  //   console.log('Lancement avec vérification de mise à jour');
  //   create_update_window();
  // } else {
  //   console.log('Lancement sans mise à jour');
  //   create_main_window();
  // }

  console.log('Lancement direct (sans Express)');
  create_main_window();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) create_main_window();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
