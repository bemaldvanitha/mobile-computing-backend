import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function allowNotifications() {
  if (Platform.OS === 'web') {
    return {
      ok: false,
      reason: 'Reminders are delivered on a phone. Open this project in Expo Go.',
    };
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return { ok: true };
  }

  const requested = await Notifications.requestPermissionsAsync();
  if (requested.granted) {
    return { ok: true };
  }

  return {
    ok: false,
    reason: 'Notifications are off. Allow them for Expo Go in your phone settings, then try again.',
  };
}

export async function sendReminder({ title, body, seconds = 5 }) {
  try {
    const permission = await allowNotifications();
    if (!permission.ok) {
      return permission;
    }

    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger:
        seconds > 0
          ? {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds,
            }
          : null,
    });

    return { ok: true };
  } catch {
    return {
      ok: false,
      reason:
        'This phone did not accept the reminder. Close Expo Go completely, open Ceylon Trails again, and allow notifications when Android asks.',
    };
  }
}
