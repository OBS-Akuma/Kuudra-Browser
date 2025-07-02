const { session } = require('electron');

// List of common ad/tracker URL patterns
const blockedHosts = [
  "doubleclick.net",
  "googlesyndication.com",
  "adnxs.com",
  "adsafeprotected.com",
  "facebook.net",
  "analytics.google.com",
  "googletagmanager.com",
  "googletagservices.com",
  "taboola.com",
  "outbrain.com",
  "scorecardresearch.com",
  "zedo.com",
  "quantserve.com",
  "adform.net"
];

// Register ad-blocking before any navigation happens
function setupAdblocker() {
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    const url = details.url;
    const blocked = blockedHosts.some(host => url.includes(host));

    if (blocked) {
      console.log("[Kuudra AdBlock] Blocked:", url);
      return callback({ cancel: true });
    }

    return callback({ cancel: false });
  });
}

module.exports = { setupAdblocker };
