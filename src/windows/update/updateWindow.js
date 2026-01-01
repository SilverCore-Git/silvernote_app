const { BrowserWindow, globalShortcut } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
const create_main_window = require("../main/mainWindow.js");

module.exports = function create_update_window() {

    return new Promise((resolve, reject) => {

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

        autoUpdater.once('checking-for-update', () => console.log('Checking for update...'));
        autoUpdater.once('update-available', () => {
            console.log('Downloading update...');
            update = true;
        });

        autoUpdater.once('update-not-available', () => {
            win.close();
            const mainWin = create_main_window();
            resolve(mainWin);
        });

        autoUpdater.once('error', (err) => {
            console.error('Update error:', err);
            const mainWin = create_main_window();
            win.close();
            resolve(mainWin);
        });

        autoUpdater.once('update-downloaded', () => {
            autoUpdater.quitAndInstall();
        });

        setTimeout(() => {
            if (!update && win && !win.isDestroyed() && win.isVisible()) {
                console.error('update timeout => close window');
                win.close();
                const mainWin = create_main_window();
                resolve(mainWin);
            }
        }, 5 * 1000);

    });
    
};
