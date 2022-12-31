const { app, Tray, Menu } = require('electron');
const path = require('path');
const { startProxy } = require('./proxy');

// need to put it in the global context to avoid GC
let tray;
const addTray = () => {
  // support Windows and Mac only
  const trayImage = process.platform === 'win32' ? 'tray-win.ico' : 'tray-mac.png';
  const trayImagePath = path.join(__dirname, 'images', trayImage);
  tray = new Tray(trayImagePath);
  tray.setToolTip('Feedly はてブ Proxy');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: '終了', type: 'normal', click: () => app.quit() },
  ]));
}

const main = async () => {
  await app.whenReady();
  addTray();
  startProxy();
}
main();
