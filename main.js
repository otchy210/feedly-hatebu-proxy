const { app, Tray, Menu, nativeTheme } = require('electron');
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

const getTrayImage = (platform) => {
  if (platform === 'Windows') {
    return 'tray-win.ico';
  }
  if (platform === 'Mac') {
    if (nativeTheme.shouldUseDarkColors) {
      return 'tray-mac-white.png';
    } else {
      return 'tray-mac-black.png';
    }
  }
  throw new Error('Unsupported platform');
}

// need to put it in the global context to avoid GC
let tray;
let trayImage;
const getTrayImagePath = () => {
  return path.join(__dirname, 'images', trayImage);
}

const addTray = (platform) => {
  trayImage = getTrayImage(platform);
  tray = new Tray(getTrayImagePath());
  tray.setToolTip('Feedly はてブ Proxy');
  if (platform === 'Mac') {
    tray.setContextMenu(Menu.buildFromTemplate([
      { label: 'テーマ切り替え', type: 'normal', click: () => {
        trayImage = trayImage.indexOf('white') >= 0 ? 'tray-mac-black.png' : 'tray-mac-white.png';
        tray.setImage(getTrayImagePath());
      }},
      { label: '終了', type: 'normal', click: () => app.quit() },
    ]));
  } else {
    tray.setContextMenu(Menu.buildFromTemplate([
      { label: '終了', type: 'normal', click: () => app.quit() },
    ]));
  }
}

const main = async () => {
  await app.whenReady();
  const platform = getPlatform();
  if (platform === 'Unsupported') {
    throw new Error('Unsupported platform');
  }
  addTray(platform);
  if (platform === 'Mac') {
    app.dock.hide();
    nativeTheme.on("updated", () => {
      if (tray) {
        tray.destroy();
      }
      addTray(platform);
    });
  }
  startProxy();
}
main();
