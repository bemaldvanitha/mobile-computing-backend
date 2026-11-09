import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ResumeBanner } from '../../components/ResumeBanner';
import { usePlaces } from '../../context/PlacesContext';
import { scheduleTrailReminder } from '../../lib/notifications';
import { colors } from '../../theme/colors';

export default function TrailLogScreen() {
  const { resumeLog, favorites } = usePlaces();
  const [notice, setNotice] = useState('');

  async function sendReminder() {
    const placeName = favorites[0]?.name ?? 'Sigiriya';
    const delivered = await scheduleTrailReminder(placeName);
    setNotice(
      delivered
        ? `A local notification for ${placeName} will appear in 5 seconds. You can leave the app and it should still arrive.`
        : 'The notification was not scheduled. On a phone, open this project in Expo Go and allow notifications. Web does not deliver system notifications.'
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ResumeBanner />
      <Text style={styles.title}>Trail log</Text>
      <Text style={styles.body}>
        This screen is where the AppState listener shows its work. Switch to another app, or press
        the phone’s Home button, then come back. Each return from the background adds a line below
        and a banner on the open screen.
      </Text>
      <Text style={styles.section}>Returns from the background</Text>
      {resumeLog.length === 0 ? (
        <Text style={styles.empty}>No resume yet. Leave the app and open it again.</Text>
      ) : (
        resumeLog.map((entry) => (
          <View key={entry.id} style={styles.row}>
            <Text style={styles.rowText}>{entry.label}</Text>
          </View>
        ))
      )}
      <Text style={styles.section}>Local notification</Text>
      <Text style={styles.body}>
        Saving a trail sends a notification immediately. This button schedules one five seconds
        ahead, which is the easiest way to film the alert.
      </Text>
      <Pressable onPress={sendReminder} style={styles.button} accessibilityRole="button">
        <Text style={styles.buttonText}>Remind me in 5 seconds</Text>
      </Pressable>
      {notice ? <Text style={styles.notice}>{notice}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 32,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
    marginHorizontal: 16,
    marginTop: 16,
  },
  body: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginHorizontal: 16,
    marginTop: 8,
  },
  section: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 16,
    marginTop: 22,
  },
  empty: {
    color: colors.muted,
    fontSize: 14,
    marginHorizontal: 16,
    marginTop: 8,
  },
  row: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rowText: {
    color: colors.ink,
    fontSize: 14,
  },
  button: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: colors.green,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.paper,
    fontWeight: '700',
    fontSize: 16,
  },
  notice: {
    color: colors.greenDark,
    fontSize: 14,
    lineHeight: 20,
    marginHorizontal: 16,
    marginTop: 12,
  },
});
