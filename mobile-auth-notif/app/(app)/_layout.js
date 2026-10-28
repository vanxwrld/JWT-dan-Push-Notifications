import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import * as Notifications from 'expo-notifications';

export default function AppLayout() {
  const lastResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    const received = Notifications.addNotificationReceivedListener((n) => {
      console.log('Notifikasi diterima:', n.request.content);
    });
    return () => received.remove();
  }, []);

  useEffect(() => {
    if (!lastResponse) return;
    if (lastResponse.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;

    const screen = lastResponse.notification.request.content.data?.screen;
    if (screen === 'profile') router.push('/profile');
  }, [lastResponse]);

  return <Stack />;
}