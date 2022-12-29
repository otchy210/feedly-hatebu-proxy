const { app, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

// need to put it in the global context to avoid GC
let tray;
const addTray = () => {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'images/tray.png'));
  tray = new Tray(icon);
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Quit', type: 'normal', click: () => app.quit() },
  ]));
}

const main = async () => {
  await app.whenReady();
  addTray();
}
main();
