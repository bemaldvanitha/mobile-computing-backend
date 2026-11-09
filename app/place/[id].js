import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ConfirmModal } from '../../components/ConfirmModal';
import { ResumeBanner } from '../../components/ResumeBanner';
import { usePlaces } from '../../context/PlacesContext';
import { findPlace } from '../../data/places';
import { notifySaved, scheduleTrailReminder } from '../../lib/notifications';
import { colors } from '../../theme/colors';

function Fact({ label, value }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams();
  const place = findPlace(id);
  const { isFavorite, addFavorite, removeFavorite } = usePlaces();
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState('');

  if (!place) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingTitle}>This trail is not in the list.</Text>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.backLink}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const saved = isFavorite(place.id);

  async function save() {
    addFavorite(place.id);
    const delivered = await notifySaved(place.name);
    setNotice(
      delivered
        ? 'Saved. The notification should be on your phone now, and the place is on the Favorites tab.'
        : 'Saved to Favorites. Allow notifications in Expo Go if you also want the alert.'
    );
  }

  async function remind() {
    const delivered = await scheduleTrailReminder(place.name);
    setNotice(
      delivered
        ? `Reminder set. Leave the app if you want. ${place.name} will notify you in 5 seconds.`
        : 'Could not schedule the reminder. Use Expo Go on a phone and allow notifications.'
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: place.name }} />
      <Image source={place.image} style={styles.hero} />
      <ResumeBanner />
      <View style={styles.body}>
        <Text style={styles.meta}>
          {place.region} · {place.category}
        </Text>
        <Text style={styles.summary}>{place.summary}</Text>
        <Text style={styles.about}>{place.about}</Text>
        <Fact label="From Kelaniya" value={place.fromKelaniya} />
        <Fact label="When to go" value={place.bestTime} />
        <Fact label="How long" value={place.visitLength} />
        <Fact label="On the day" value={place.tip} />
        <Text style={styles.credit}>Photograph: {place.photoCredit}</Text>
        {saved ? (
          <Pressable onPress={() => setConfirming(true)} style={styles.secondary} accessibilityRole="button">
            <Text style={styles.secondaryText}>Remove from shortlist</Text>
          </Pressable>
        ) : (
          <Pressable onPress={save} style={styles.primary} accessibilityRole="button">
            <Text style={styles.primaryText}>Save to shortlist</Text>
          </Pressable>
        )}
        <Pressable onPress={remind} style={styles.secondary} accessibilityRole="button">
          <Text style={styles.secondaryText}>Remind me in 5 seconds</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={styles.textButton} accessibilityRole="button">
          <Text style={styles.backLink}>Back</Text>
        </Pressable>
        {notice ? <Text style={styles.notice}>{notice}</Text> : null}
      </View>
      <ConfirmModal
        visible={confirming}
        placeName={place.name}
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          removeFavorite(place.id);
          setConfirming(false);
          setNotice(`${place.name} was removed from Favorites.`);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  hero: {
    width: '100%',
    height: 240,
    backgroundColor: colors.line,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  meta: {
    color: colors.gold,
    fontWeight: '700',
    fontSize: 13,
  },
  summary: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    marginTop: 6,
  },
  about: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  fact: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  factLabel: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  factValue: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 4,
  },
  credit: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 16,
  },
  primary: {
    marginTop: 16,
    backgroundColor: colors.green,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: colors.paper,
    fontWeight: '700',
    fontSize: 16,
  },
  secondary: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.green,
    backgroundColor: colors.card,
  },
  secondaryText: {
    color: colors.greenDark,
    fontWeight: '700',
    fontSize: 16,
  },
  textButton: {
    marginTop: 14,
    alignItems: 'center',
    paddingVertical: 8,
  },
  backLink: {
    color: colors.green,
    fontWeight: '700',
    fontSize: 15,
  },
  notice: {
    color: colors.greenDark,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  missing: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'center',
  },
  missingTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
  },
});
