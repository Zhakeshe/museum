# e-museum.kz static mirror notes

This directory contains a static snapshot of e-museum.kz created by HTTrack.

## Hosting considerations

- The service worker file uses the `.webworker` extension. Ensure your web server
  serves it with a JavaScript MIME type (for Apache, see `.htaccess` in this
  directory). The homepage now registers `serviceworker.js` first, which is a
  `.js` copy of the original worker to avoid MIME issues on hosts that do not
  map `.webworker` to JavaScript.
- The static mirror still references `https://e-museum.kz/wp-admin/admin-ajax.php`
  for dynamic data. When hosting on another domain, you will need either a server-
  side proxy or CORS configuration on the origin to avoid browser CORS errors.
  The bundled service worker now returns a stub JSON response for that endpoint
  to prevent CORS failures on static hosts.
