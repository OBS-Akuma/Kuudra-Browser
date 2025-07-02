const { remote } = require('electron');

function registerHotkeys(webview) {
  window.addEventListener('keydown', (e) => {
    // F12 - open devtools
    if (e.key === 'F12') {
      remote.getCurrentWindow().webContents.openDevTools({ mode: 'detach' });
    }

    // F4 or Ctrl + R - reload webview only
    if (e.key === 'F4' || (e.ctrlKey && e.key.toLowerCase() === 'r')) {
      e.preventDefault();
      if (webview) webview.reload();
    }
  });
}

module.exports = { registerHotkeys };
