const { app, BrowserWindow } = require("electron");
const initializeDiscordRPC = require("./assets/dicord_rpc");
const create_main_window = require('./windows/main/mainWindow.js');
const create_update_window = require('./windows/update/updateWindow');

const originalUserAgent = app.userAgentFallback;
app.userAgentFallback = `${originalUserAgent} Silvernote/${app.getVersion()}`;
app.disableHardwareAcceleration();

// 2. Forcer le profil sRGB (Empêche les gris de devenir blancs/brûlés)
app.commandLine.appendSwitch('force-color-profile', 'srgb');

// 3. Empêcher Chromium d'ignorer les profils de couleurs
app.commandLine.appendSwitch('ignore-gpu-blacklist');

app.whenReady().then(async () => {

  let setActivity = () => {};

  create_update_window()
  const mainWindow = create_main_window();

  initializeDiscordRPC((activity) => {
    setActivity = activity.setActivity;
  }).catch((err) => {
    console.warn("RPC non disponible :", err.message);
  });

  mainWindow.on('page-title-updated', (event, title) => {
    setActivity(title);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) create_main_window();
  });

});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});