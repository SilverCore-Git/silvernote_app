const { app, BrowserWindow } = require("electron");
const initializeDiscordRPC = require("./assets/dicord_rpc");
const isOnline =  require('./assets/isOnline');
const create_main_window = require('./windows/main/mainWindow');
const create_update_window = require('./windows/update/updateWindow');


app.whenReady().then(async () => {

  const { rpc, setActivity } = initializeDiscordRPC();

  rpc.on('ready', () => {
    rpc.setActivity({ state: 'Loading' });
  });
  
  let mainWindow;

  if (isOnline()) 
  {
    const { window } = create_update_window();
    mainWindow = window;
  }
  else 
  {
    create_main_window();
  }

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