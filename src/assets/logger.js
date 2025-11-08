
class Console {

    constructor (window) {
        this.mainWindow = window;
    }

    log(text) {
        this.mainWindow.webContents.executeJavaScript(`console.log("${text}")`);
    }

    warn(text) {
        this.mainWindow.webContents.executeJavaScript(`console.warn("${text}")`);
    }

    error(text) {
        this.mainWindow.webContents.executeJavaScript(`console.error("${text}")`);
    }

}

module.exports = Console;