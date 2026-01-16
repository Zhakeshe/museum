# e-museum.kz static mirror notes

This directory contains a static snapshot of e-museum.kz created by HTTrack.

## Hosting considerations

- The service worker file uses the `.webworker` extension. Ensure your web server
  serves it with a JavaScript MIME type (for Apache, see `.htaccess` in this
  directory).
- The static mirror still references `https://e-museum.kz/wp-admin/admin-ajax.php`
  for dynamic data. When hosting on another domain, you will need either a server-
  side proxy or CORS configuration on the origin to avoid browser CORS errors.
