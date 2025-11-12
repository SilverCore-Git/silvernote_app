const { app, BrowserWindow } = require("electron");
const initializeDiscordRPC = require("./assets/dicord_rpc");
const isOnline =  require('./assets/isOnline');
const create_main_window = require('./windows/main/mainWindow');
const create_update_window = require('./windows/update/updateWindow');


app.whenReady().then(async () => {

  const { setActivity } = initializeDiscordRPC();

  if (isOnline()) 
  {
    create_update_window();
  }
  else 
  {
    create_main_window();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) create_main_window();
  });

});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});