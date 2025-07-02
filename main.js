<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Kuudra Browser</title>
  <style>
    html, body {
      margin: 0; padding: 0;
      height: 100vh; width: 100vw;
      overflow: hidden;
      background: #0f0f0f;
      font-family: "Segoe UI", sans-serif;
      color: white;
      display: flex;
      flex-direction: column;
    }

    #nav {
      display: flex;
      align-items: center;
      padding: 10px;
      background: rgba(30,30,30,0.9);
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      gap: 8px;
      flex-shrink: 0;
      height: 52px;
    }

    #nav img {
      width: 28px;
      height: 28px;
      border-radius: 6px;
    }

    #nav button.nav-btn {
      background: #333;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 10px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s ease;
    }

    #nav button.nav-btn:hover {
      background: #444;
    }

    #url {
      flex: 1;
      padding: 10px 12px;
      font-size: 15px;
      background: #1e1e1e;
      color: white;
      border: 1px solid #333;
      border-radius: 8px;
    }

    #url:focus {
      outline: none;
      border-color: #4a90e2;
    }

    #goBtn {
      background: #4a90e2;
      color: white;
      padding: 9px 16px;
      font-size: 14px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease;
      user-select: none;
    }

    #goBtn:hover {
      background: #357ab8;
    }

    #welcome {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      user-select: none;
      text-align: center;
    }

    #welcome img {
      width: 180px;
      height: 180px;
      margin-bottom: 24px;
    }

    #welcome h1 {
      margin: 0 0 12px 0;
      font-size: 36px;
    }

    #welcome p {
      margin: 0 0 24px 0;
      font-size: 18px;
      color: #aaa;
    }

    webview {
      flex-grow: 1;
      width: 100%;
      height: calc(100vh - 52px);
      border: none;
      display: none;
    }
  </style>
</head>
<body>
  <div id="nav">
    <img src="./assets/logo.png" alt="Kuudra" />
    <button class="nav-btn" onclick="goBack()">◀</button>
    <button class="nav-btn" onclick="goForward()">▶</button>
    <button class="nav-btn" onclick="reload()">⟳</button>
    <button class="nav-btn" onclick="goHome()">🏠</button>
    <input type="text" id="url" placeholder="Search or enter website..." autocomplete="off" />
    <button id="goBtn">Go</button>
  </div>

  <div id="welcome">
    <img src="./assets/logo.png" alt="Kuudra Logo" />
    <h1>Welcome to Kuudra Browser</h1>
    <p>Search or enter a website above</p>
  </div>

  <webview id="webview" allowpopups></webview>

  <script>
    const { ipcRenderer } = require('electron');

    const urlInput = document.getElementById('url');
    const goBtn = document.getElementById('goBtn');
    const webview = document.getElementById('webview');
    const welcome = document.getElementById('welcome');
    const nav = document.getElementById('nav');

    const engines = {
      google: 'https://www.google.com/search?q=',
      duckduckgo: 'https://duckduckgo.com/?q=',
      yahoo: 'https://search.yahoo.com/search?p='
    };
    const defaultEngine = 'google';

    function go() {
      const input = urlInput.value.trim();
      if (!input) return;

      let url;
      if (!input.includes('.') || input.includes(' ')) {
        url = engines[defaultEngine] + encodeURIComponent(input);
      } else if (!input.startsWith('http')) {
        url = 'https://' + input;
      } else {
        url = input;
      }

      webview.style.display = 'flex';
      welcome.style.display = 'none';
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
      webview.style.display = 'none';
      welcome.style.display = 'flex';
      urlInput.value = '';
    }

    goBtn.addEventListener('click', go);
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        go();
      }
    });

    webview.addEventListener('did-navigate', () => {
      urlInput.value = webview.getURL();
    });

    ipcRenderer.on('app-minimized', () => {
      if (welcome.style.display !== 'none') {
        alert("Oh no! You have minimized the app — this can't be done on the default screen!!");
      }
    });

    // F11 fullscreen toggle and double Tab close logic
    let isFullFullscreen = false;
    let lastTabTime = 0;
    let tabPressCount = 0;

    document.addEventListener('keydown', (e) => {
      const now = Date.now();

      if (e.key === 'Tab') {
        if (now - lastTabTime < 400) {
          tabPressCount++;
        } else {
          tabPressCount = 1;
        }
        lastTabTime = now;

        if (tabPressCount >= 2) {
          const confirmed = confirm("You pressed Tab twice. Do you want to close the app?");
          if (confirmed) {
            ipcRenderer.send('close-app');
          }
        }
      }

      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    });

    function toggleFullscreen() {
      if (!isFullFullscreen) {
        nav.style.display = 'none';
        welcome.style.display = 'none';
        webview.style.display = 'flex';
        webview.style.width = '100vw';
        webview.style.height = '100vh';
      } else {
        nav.style.display = 'flex';
        if (webview.src) {
          welcome.style.display = 'none';
          webview.style.display = 'flex';
          webview.style.width = '100%';
          webview.style.height = 'calc(100vh - 52px)';
        } else {
          welcome.style.display = 'flex';
          webview.style.display = 'none';
        }
      }
      isFullFullscreen = !isFullFullscreen;
    }
  </script>
</body>
</html>
