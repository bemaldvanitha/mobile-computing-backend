import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const CHANNEL_ID = 'trails';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function prepareAndroidChannel() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Ceylon Trails',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 220, 120, 220],
  });
}

export async function ensureNotificationPermission() {
  if (Platform.OS === 'web') {
    return false;
  }

  await prepareAndroidChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

async function schedule(content, trigger) {
  const allowed = await ensureNotificationPermission();
  if (!allowed) {
    return false;
  }

  await Notifications.scheduleNotificationAsync({
    content,
    trigger,
  });
  return true;
}

export function notifySaved(placeName) {
  return schedule(
    {
      title: 'Saved to your shortlist',
      body: `${placeName} is now in Favorites.`,
    },
    null
  );
}

export function scheduleTrailReminder(placeName) {
  return schedule(
    {
      title: 'Ceylon Trails reminder',
      body: `Still thinking about ${placeName}? It is on your shortlist.`,
    },
    {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
      channelId: CHANNEL_ID,
    }
  );
}
