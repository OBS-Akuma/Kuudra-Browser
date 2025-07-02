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
      webviewTag: true
    },
    icon: path.join(__dirname, 'assets/logo.png'),
    title: 'Kuudra Browser'
  });

  mainWindow.loadFile('start.html');

  // Optional: Open DevTools (for debugging)
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  setupAdblocker();     // Enable adblocker before window is created
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
