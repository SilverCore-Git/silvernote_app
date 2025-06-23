
const { app, BrowserWindow, Menu, globalShortcut, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

const path = require('path');
const fs = require('fs');

const Console = require('./logger');
const if_dev = process.env.DEV == 'true';
const is_online = navigator.onLine;

if (if_dev && !fs.existsSync(path.join(__dirname, '../data'))) fs.promises.mkdir(path.join(__dirname, '../data'));
const appDataPath = if_dev ? path.join(__dirname, '../data') : app.getPath(process.platform === 'win32' ? 'appData' : process.platform === 'darwin' ? 'appData' : '.config');

function alert_log(window) {

  if (!window || window.isDestroyed()) return;

  window.webContents.executeJavaScript(`
    
    console.log(

      "%c⚠️ ATTENTION : Ne copiez/collez pas de code ici !",
      "color: yellow; background: red; font-size: 16px; font-weight: bold; padding: 8px; border: 2px solid black;",

    );

    console.log(

      "%cCela pourrait permettre à un attaquant de voler vos données ou de compromettre votre application.",
      "color: white; background: #d9534f; font-size: 13px; padding: 4px;",

    );

    console.log(
      
      "%cSi quelqu’un vous a demandé de coller du code ici, il s’agit probablement d’une arnaque.",
      "color: orange; font-size: 13px;"
    
    );

  `);

}



async function create_main_window () {

  const win = new BrowserWindow({

    width: 800,
    height: 600,
    frame: true,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
    }

  });

  const console = new Console(win);

  Menu.setApplicationMenu(null);

  win.loadFile(path.join(__dirname, './dist/index.html'));

  console.log('Initialising shortcut...');

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    if (win) {
      win.webContents.openDevTools({ mode: 'detach' });
    }
  });

  if (if_dev) {
    console.warn('App en mode dev')
    win.webContents.openDevTools({ mode: 'detach' });
  }

  alert_log(win);
  setInterval(() => {
    alert_log(win);
  }, 60 * 1000);

}

function create_update_window() {

  const win = new BrowserWindow({

    width: 300,
    height: 400,
    frame: false,
    resizable: false, 
    maximizable: false, 
    fullscreenable: false,
    title: "Verification des mise a jours...",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
    }

  });

  win.loadFile(path.join(__dirname, './mini_window/index.html'));

  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';

  autoUpdater.checkForUpdates();

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
  });

  autoUpdater.on('update-available', () => {
    console.log('Downloading an update');
  });


  autoUpdater.on('update-not-available', () => {
    win.close();
    create_main_window()
  });

  autoUpdater.on('error', (err) => {
    win.close();
    create_main_window()
  });

  autoUpdater.on('update-downloaded', () => {

    autoUpdater.quitAndInstall();

  });

}

app.whenReady().then(() => {

  console.log('Creating window...');

  if (is_online) {
    create_update_window()
  }
  else {
    create_main_window()
  }

  app.on('activate', () => {

    if (BrowserWindow.getAllWindows().length === 0) create_main_window();

  });

});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

