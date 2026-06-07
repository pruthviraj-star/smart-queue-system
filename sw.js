self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  self.registration.showNotification(data.title || 'SmartQueue', {
    body: data.body || 'Queue update',
    icon: 'https://cdn-icons-png.flaticon.com/512/1827/1827392.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/1827/1827392.png',
    vibrate: [200, 100, 200]
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/student-token.html'));
});