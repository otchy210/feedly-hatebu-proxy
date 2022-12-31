const { app, Tray, Menu } = require('electron');
const path = require('path');
const { startProxy } = require('./proxy');

const getPlatform = () => {
  switch(process.platform) {
    case 'win32':
      return 'Windows';
    case 'darwin':
      return 'Mac';
    default:
      return 'Unsupported';
  }
}

// need to put it in the global context to avoid GC
let tray;
const addTray = () => {
  // support Windows and Mac only
  const platform = getPlatform();
  if (platform === 'Unsupported') {
    throw new Error('Unsupported platform');
  }
  
  const trayImage = platform === 'Windows' ? 'tray-win.ico' : 'tray-mac.png';
  const trayImagePath = path.join(__dirname, 'images', trayImage);
  tray = new Tray(trayImagePath);
  tray.setToolTip('Feedly はてブ Proxy');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: '終了', type: 'normal', click: () => app.quit() },
  ]));
}

const hideDockIcon = () => {
  const platform = getPlatform();
  if (platform !== 'Mac') {
    return;
  }
  app.dock.hide();
}

const main = async () => {
  await app.whenReady();
  addTray();
  hideDockIcon();
  startProxy();
}
main();
