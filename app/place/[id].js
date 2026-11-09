import { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ConfirmModal } from '../../components/ConfirmModal';
import { ResumeBanner } from '../../components/ResumeBanner';
import { usePlaces } from '../../context/PlacesContext';
import { costFor } from '../../data/costs';
import { findPlace, origin } from '../../data/places';
import { formatLkr, hoursFor } from '../../lib/plan';
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
  const { isFavorite, addFavorite, removeFavorite, trips, addStop, tripsForPlace } = usePlaces();
  const [confirming, setConfirming] = useState(false);
  const [pickingTrip, setPickingTrip] = useState(false);
  const [notice, setNotice] = useState('');

  if (!place) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingTitle}>This place is not in the guide.</Text>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.backLink}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const saved = isFavorite(place.id);
  const cost = costFor(place.id);
  const usedIn = tripsForPlace(place.id);

  function save() {
    addFavorite(place.id);
    setNotice(`${place.name} is on your shortlist. The shortlist is a wishlist, separate from any trip.`);
  }

  function addTo(tripId) {
    addStop(tripId, place.id, 1);
    setPickingTrip(false);
    const trip = trips.find((item) => item.id === tripId);
    setNotice(`${place.name} was added to ${trip?.name ?? 'the trip'} on day 1. It was not added to the shortlist.`);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: place.name }} />
      <Image source={place.image} style={styles.hero} />
      <ResumeBanner />
      <View style={styles.body}>
        <Text style={styles.meta}>
          {place.region} · {place.category} · {hoursFor(place.id)} h from {origin}
        </Text>
        <Text style={styles.summary}>{place.summary}</Text>
        <Text style={styles.about}>{place.about}</Text>
        <Fact label={`From ${origin}`} value={place.fromOrigin} />
        <Fact label="When to go" value={place.bestTime} />
        <Fact label="How long there" value={place.visitLength} />
        <Fact label="On the day" value={place.tip} />
        <Fact
          label="Money, per person"
          value={`${formatLkr(cost.ticketLkr)} ticket, ${formatLkr(cost.extrasLkr)} typical extra, ${formatLkr(cost.busLkr)} bus. ${cost.extrasLabel}`}
        />
        {usedIn.length > 0 ? (
          <Fact
            label="Already planned"
            value={usedIn.map((trip) => trip.name).join(', ')}
          />
        ) : null}
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
        <Pressable
          onPress={() => {
            if (trips.length === 0) {
              router.push('/trip/new');
              return;
            }
            setPickingTrip(true);
          }}
          style={styles.primary}
          accessibilityRole="button"
        >
          <Text style={styles.primaryText}>Add to a trip</Text>
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
          setNotice(`${place.name} was removed from the shortlist.`);
        }}
      />
      <Modal visible={pickingTrip} transparent animationType="slide" onRequestClose={() => setPickingTrip(false)}>
        <View style={styles.backdrop}>
          <Pressable style={styles.dismissArea} onPress={() => setPickingTrip(false)} />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Add {place.name}</Text>
            {trips.map((trip) => {
              const already = trip.stops.some((stop) => stop.placeId === place.id);
              return (
                <Pressable
                  key={trip.id}
                  onPress={() => {
                    if (!already) {
                      addTo(trip.id);
                    }
                  }}
                  style={styles.tripRow}
                  accessibilityRole="button"
                >
                  <Text style={styles.tripName}>{trip.name}</Text>
                  <Text style={styles.tripState}>{already ? 'Already on this trip' : 'Add to day 1'}</Text>
                </Pressable>
              );
            })}
            <Pressable
              onPress={() => {
                setPickingTrip(false);
                router.push('/trip/new');
              }}
              style={styles.secondary}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryText}>Start a new trip instead</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    marginTop: 12,
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
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(20, 28, 24, 0.45)',
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 28,
  },
  sheetTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  tripRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  tripName: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  tripState: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
});
