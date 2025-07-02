const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

app.commandLine.appendSwitch('disable-frame-rate-limit');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webviewTag: true,
      // preload: path.join(__dirname, 'preload.js'), // if using a preload script
    },
    icon: path.join(__dirname, 'assets/logo.png'),
    title: 'Kuudra Browser'
  });

  mainWindow.loadFile('start.html');
  mainWindow.removeMenu();

  // Listen for minimize event and send IPC message to renderer
  mainWindow.on('minimize', () => {
    mainWindow.webContents.send('app-minimized');
  });

  // Uncomment to open devtools
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// Quit app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Re-create window on macOS if no windows open and app is reactivated
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Handle tab-double-press close event from renderer
ipcMain.on('close-app', () => {
  app.quit();
});
