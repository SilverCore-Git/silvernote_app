const { BrowserWindow, globalShortcut } = require("electron");
const path = require("path");

// Auto-update system has been removed. This file remains as a no-op
// placeholder in case other modules import it. It intentionally does
// not require `electron-updater` or perform any network/update actions.

module.exports = function create_update_window() {
  // Create a minimal hidden window (unused) to preserve behavior
  // for any code that expects this function to exist.
  const win = new BrowserWindow({
    width: 300,
    height: 400,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Do not perform any update checks. Close immediately.
  if (!win.isDestroyed()) win.close();
  return null;
};
