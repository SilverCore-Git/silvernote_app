const https = require("https");

module.exports = function isOnline(timeout = 3000) {
  return new Promise((resolve) => {
    const req = https.request(
      {
        host: 'www.google.com',
        method: 'HEAD',
        timeout,
      },
      () => resolve(true)
    );

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}