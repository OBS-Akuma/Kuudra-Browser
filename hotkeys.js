const { remote } = require('electron');

function registerHotkeys(webview) {
  function handler(e) {
    if (e.key === 'F12') {
      e.preventDefault();
      remote.getCurrentWindow().webContents.openDevTools({ mode: 'detach' });
    }
    if (e.key === 'F4' || (e.ctrlKey && e.key.toLowerCase() === 'r')) {
      e.preventDefault();
      if (webview) webview.reload();
    }
  }

  window.addEventListener('keydown', handler);
  document.addEventListener('keydown', handler);
}

module.exports = { registerHotkeys };
