// Simple PWA service worker registration
if ('serviceWorker' in navigator) {
  // Unregister any existing service workers to prevent caching issues
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}
