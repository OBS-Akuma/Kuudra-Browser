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

// 🔄 Sync URL bar with webview URL
webview.addEventListener('did-navigate', () => {
  urlInput.value = webview.getURL();
});

// ◀ Back
function goBack() {
  if (webview.canGoBack()) webview.goBack();
}

// ▶ Forward
function goForward() {
  if (webview.canGoForward()) webview.goForward();
}

// 🔁 Reload
function reload() {
  webview.reload();
}

// 🏠 Home
function goHome() {
  webview.src = 'https://start.duckduckgo.com/';
  urlInput.value = '';
}
