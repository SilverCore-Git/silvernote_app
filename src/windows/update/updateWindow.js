const { BrowserWindow, globalShortcut } = require("electron");
const create_main_window = require('../main/mainWindow');
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
const path = require("path");


module.exports = function create_update_window() 
{
        
    const win = new BrowserWindow({
        width: 300,
        height: 400,
        frame: false,
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        title: 'Mise à jour - Silvernote',
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

    win.loadFile(path.join(__dirname, './index.html'));

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
            console.error('update timeout => close window');
            win.close();
            create_main_window();
        }
    }, 30 * 1000);

}