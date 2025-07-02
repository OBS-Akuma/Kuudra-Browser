const { remote } = require('electron');

function registerHotkeys(webview) {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'F12') {
      remote.getCurrentWindow().webContents.openDevTools({ mode: 'detach' });
    }

    if (e.key === 'F4' || (e.ctrlKey && e.key.toLowerCase() === 'r')) {
      e.preventDefault();
      if (webview) webview.reload();
    }
  });
}

module.exports = { registerHotkeys };
