const { app, BrowserWindow } = require('electron');
const path = require('path');
const { setupAdblocker } = require('./adblocker');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,   // Required for hotkeys.js devtools
      webviewTag: true
    },
    icon: path.join(__dirname, 'assets/logo.png'),
    title: 'Kuudra Browser'
  });

  mainWindow.loadFile('start.html');

  // Uncomment if you want DevTools open on launch for debugging:
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  setupAdblocker();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
