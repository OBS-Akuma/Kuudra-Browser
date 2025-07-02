const { registerHotkeys } = require('./hotkeys');

document.addEventListener('DOMContentLoaded', () => {
  const webview = document.getElementById('webview');
  const urlInput = document.getElementById('url');

  function go() {
    const input = urlInput.value.trim();
    let url = input;

    if (!input) return;

    const engine = localStorage.getItem('searchEngine') || 'google';
    const engines = {
      google: 'https://www.google.com/search?q=',
      duckduckgo: 'https://duckduckgo.com/?q=',
      yahoo: 'https://search.yahoo.com/search?p='
    };

    if (!input.includes('.') || input.includes(' ')) {
      url = engines[engine] + encodeURIComponent(input);
    } else if (!input.startsWith('http')) {
      url = 'https://' + input;
    }

    webview.src = url;
  }

  function goBack() {
    if (webview.canGoBack()) webview.goBack();
  }

  function goForward() {
    if (webview.canGoForward()) webview.goForward();
  }

  function reload() {
    webview.reload();
  }

  function goHome() {
    window.location.href = 'start.html';
  }

  webview.addEventListener('did-navigate', () => {
    urlInput.value = webview.getURL();
  });

  // Expose functions globally for HTML onclick handlers
  window.go = go;
  window.goBack = goBack;
  window.goForward = goForward;
  window.reload = reload;
  window.goHome = goHome;

  // Register hotkeys with webview
  registerHotkeys(webview);
});
