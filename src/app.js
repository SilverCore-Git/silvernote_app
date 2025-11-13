const { app, BrowserWindow } = require("electron");
const initializeDiscordRPC = require("./assets/dicord_rpc");
const isOnline =  require('./assets/isOnline');
const create_main_window = require('./windows/main/mainWindow');
const create_update_window = require('./windows/update/updateWindow');

app.whenReady().then(async () => {
  
  let mainWindow;

  if (isOnline()) 
  {
    create_update_window();
  }
  else 
  {
    const { window } = await create_main_window();
    mainWindow = window;
  }

  const { setActivity } = await initializeDiscordRPC();

  setActivity('Silvernote');

  const interval = setInterval(() => {
    if (mainWindow) {
      mainWindow.on('page-title-updated', (event, title) => {
          setActivity(title);
      });
      clearInterval(interval);
      return;
    }
  }, 200);


  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) create_main_window();
  });

});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});