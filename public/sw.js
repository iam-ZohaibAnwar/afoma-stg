self.addEventListener("push", (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    data: { chatId: data.chatId },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  clients.openWindow(`/chat/${event.notification.data.chatId}`);
});
