(function () {
  // ── Session keep-alive & expiry detection ──────────────────────────────
  // Skip entirely when running locally (no auth layer present).
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return;

  var PING_INTERVAL_MS = 5 * 60 * 1000; // ping every 5 minutes
  var RELOAD_COUNTDOWN_S = 8;            // seconds before auto-reload
  var pingUrl = '/api/odata/v4/participant'; // same authenticated route used by getWorkshopData()

  // ── Toast element ──────────────────────────────────────────────────────
  var toast = document.createElement('div');
  toast.id = 'session-toast';
  toast.style.cssText = [
    'display:none',
    'position:fixed',
    'top:0',
    'left:0',
    'right:0',
    'z-index:99999',
    'background:#e8f4fd',
    'border-bottom:3px solid #00B9F2',
    'color:#1a1a1a',
    'font-family:sans-serif',
    'font-size:14px',
    'padding:12px 20px',
    'text-align:center',
    'box-shadow:0 2px 8px rgba(0,0,0,0.15)'
  ].join(';');
  document.body.appendChild(toast);

  var countdownTimer = null;

  function showExpiryToast() {
    var remaining = RELOAD_COUNTDOWN_S;

    function render() {
      toast.innerHTML =
        '\u26A0\uFE0F Your session has expired. Reloading in <strong>' + remaining + 's</strong>\u2026 ' +
        '<button onclick="window.location.reload()" style="' +
          'margin-left:12px;padding:4px 12px;background:#00B9F2;color:#fff;' +
          'border:none;border-radius:4px;cursor:pointer;font-size:13px' +
        '">Reload now</button>';
    }

    toast.style.display = 'block';
    render();

    countdownTimer = setInterval(function () {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(countdownTimer);
        window.location.reload();
      } else {
        render();
      }
    }, 1000);
  }

  function triggerExpiry() {
    clearInterval(pingInterval);
    if (toast.style.display === 'none') {
      showExpiryToast();
    }
  }

  function pingWithOpaqueCheck() {
    fetch(pingUrl, { method: 'HEAD', credentials: 'include', cache: 'no-store' })
      .then(function (res) {
        if (res.status === 401 || res.status === 403) {
          triggerExpiry();
        }
        // 200 → session alive, do nothing
      })
      .catch(function () {
        // Transient network issue — ignore; next ping will catch persistent loss
      });
  }

  var pingInterval = setInterval(pingWithOpaqueCheck, PING_INTERVAL_MS);

  // Run an initial ping shortly after page load to catch already-expired sessions
  setTimeout(pingWithOpaqueCheck, 3000);
})();