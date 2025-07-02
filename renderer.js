function go() {
  const input = document.getElementById('url').value.trim();
  let url = input;

  if (!input) return;

  const engine = localStorage.getItem('searchEngine') || 'google';
  const engines = {
    google: 'https://www.google.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    yahoo: 'https://search.yahoo.com/search?p='
  };

  if (!input.includes('.') || input.includes(' ')) {
    const query = encodeURIComponent(input);
    url = engines[engine] + query;
  } else if (!input.startsWith('http')) {
    url = `https://${input}`;
  }

  document.getElementById('webview').src = url;
}
