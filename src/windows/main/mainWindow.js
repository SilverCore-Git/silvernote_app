const { BrowserWindow, Menu, globalShortcut } = require("electron");
const Console = require("../../assets/logger");

module.exports = async function create_main_window() 
{
        
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            disableHardwareAcceleration: true,
        },
    });

    new Console(window);
    Menu.setApplicationMenu(null);

    window.loadURL('https://app.silvernote.fr');

    globalShortcut.register('CommandOrControl+Shift+I', () => {
        if (window) {
            window.webContents.openDevTools({ mode: 'detach' });
        }
    });

}