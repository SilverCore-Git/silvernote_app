
const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

const path = require('path');
const fs = require('fs');

const Console = require('./logger');
const if_dev = process.env.DEV == 'true';

if (if_dev && !fs.existsSync(path.join(__dirname, '../data'))) fs.promises.mkdir(path.join(__dirname, '../data'));
const appDataPath = if_dev ? path.join(__dirname, '../data') : app.getPath(process.platform === 'win32' ? 'appData' : process.platform === 'darwin' ? 'appData' : '.config');

function alert_log(window) {

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

  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';

  console.log('Check for update...')
  autoUpdater.checkForUpdatesAndNotify();

}


app.whenReady().then(() => {

  console.log('Creating window...');
  create_main_window();

  app.on('activate', () => {

    if (BrowserWindow.getAllWindows().length === 0) create_main_window();

  });

  autoUpdater.on('update-available', () => {
    win.webContents.send('update_available');
  });

  autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update_downloaded');
  });

});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

