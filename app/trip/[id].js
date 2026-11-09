import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ConfirmModal } from '../../components/ConfirmModal';
import { usePlaces } from '../../context/PlacesContext';
import { findPlace } from '../../data/places';
import { sendReminder } from '../../lib/notifications';
import { budgetFor, formatLkr, formatRange } from '../../lib/plan';
import { colors } from '../../theme/colors';

const DAY_OPTIONS = [1, 2, 3];

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const tripId = Array.isArray(id) ? id[0] : id;
  const { getTrip, setTripNote, setTripDays, setStopDay, removeStop, toggleCheck, deleteTrip } =
    usePlaces();
  const trip = getTrip(tripId);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState('');

  if (!trip) {
    return (
      <View style={styles.missing}>
        <Stack.Screen options={{ title: 'Trip' }} />
        <Text style={styles.missingTitle}>That trip is gone.</Text>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.link}>Back to trips</Text>
        </Pressable>
      </View>
    );
  }

  const budget = budgetFor(trip);
  const checks = [
    { key: 'bus', label: 'Bus or train is booked' },
    { key: 'cash', label: 'Cash is drawn for tickets' },
    { key: 'time', label: 'The leave time fits the gate opening' },
    ...(trip.days > 1 ? [{ key: 'bed', label: 'A bed is booked' }] : []),
  ];
  const done = checks.filter((item) => trip.checks[item.key]).length;

  async function remind() {
    const placeNames = trip.stops
      .map((stop) => findPlace(stop.placeId)?.name)
      .filter(Boolean)
      .join(', ');
    const result = await sendReminder({
      title: trip.name,
      body: `${formatRange(trip.startDate, trip.days)}. ${placeNames || 'No places yet.'} About ${formatLkr(budget.total)} per person.`,
      seconds: 5,
    });
    setNotice(
      result.ok
        ? 'Reminder sent. It will show on this phone in a few seconds, including if you leave the app.'
        : result.reason
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: trip.name }} />
      <Text style={styles.range}>{formatRange(trip.startDate, trip.days)}</Text>
      <Text style={styles.total}>{formatLkr(budget.total)} per person</Text>
      <Text style={styles.split}>
        Tickets and extras {formatLkr(budget.tickets)} · Bus {formatLkr(budget.bus)}
        {budget.nights > 0 ? ` · ${budget.nights} night stay ${formatLkr(budget.lodging)}` : ' · no overnight stay'}
      </Text>
      <Text style={styles.section}>Length</Text>
      <View style={styles.chips}>
        {DAY_OPTIONS.map((option) => {
          const selected = option === trip.days;
          return (
            <Pressable
              key={option}
              onPress={() => setTripDays(trip.id, option)}
              style={[styles.chip, selected && styles.chipOn]}
              accessibilityRole="button"
            >
              <Text style={[styles.chipText, selected && styles.chipTextOn]}>
                {option === 1 ? 'Day trip' : `${option} days`}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.sectionRow}>
        <Text style={styles.section}>Places</Text>
        <Pressable onPress={() => router.push(`/trip/pick?tripId=${trip.id}`)} accessibilityRole="button">
          <Text style={styles.link}>Add</Text>
        </Pressable>
      </View>
      {trip.stops.length === 0 ? (
        <Text style={styles.empty}>Add at least one place. The bus fare uses the furthest one.</Text>
      ) : (
        DAY_OPTIONS.filter((day) => day <= trip.days).map((day) => {
          const stops = trip.stops.filter((stop) => stop.day === day);
          return (
            <View key={day} style={styles.dayBlock}>
              <Text style={styles.dayTitle}>Day {day}</Text>
              {stops.length === 0 ? <Text style={styles.empty}>Nothing on this day.</Text> : null}
              {stops.map((stop) => {
                const place = findPlace(stop.placeId);
                if (!place) {
                  return null;
                }
                return (
                  <View key={stop.placeId} style={styles.stop}>
                    <Pressable onPress={() => router.push(`/place/${place.id}`)} accessibilityRole="button">
                      <Text style={styles.stopName}>{place.name}</Text>
                      <Text style={styles.stopMeta}>{place.region}</Text>
                    </Pressable>
                    <View style={styles.stopActions}>
                      {DAY_OPTIONS.filter((option) => option <= trip.days).map((option) => (
                        <Pressable
                          key={option}
                          onPress={() => setStopDay(trip.id, place.id, option)}
                          style={[styles.mini, option === stop.day && styles.miniOn]}
                          accessibilityRole="button"
                        >
                          <Text style={[styles.miniText, option === stop.day && styles.miniTextOn]}>
                            D{option}
                          </Text>
                        </Pressable>
                      ))}
                      <Pressable
                        onPress={() => removeStop(trip.id, place.id)}
                        accessibilityRole="button"
                      >
                        <Text style={styles.remove}>Remove</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })
      )}
      <Text style={styles.section}>
        Before you leave · {done}/{checks.length}
      </Text>
      {checks.map((item) => {
        const on = trip.checks[item.key];
        return (
          <Pressable
            key={item.key}
            onPress={() => toggleCheck(trip.id, item.key)}
            style={styles.check}
            accessibilityRole="button"
          >
            <View style={[styles.box, on && styles.boxOn]}>
              {on ? <Text style={styles.tick}>✓</Text> : null}
            </View>
            <Text style={[styles.checkLabel, on && styles.checkDone]}>{item.label}</Text>
          </Pressable>
        );
      })}
      <Text style={styles.section}>Note</Text>
      <TextInput
        value={trip.note}
        onChangeText={(value) => setTripNote(trip.id, value)}
        placeholder="Bus time, who is driving, what to carry"
        placeholderTextColor={colors.muted}
        style={styles.note}
        multiline
      />
      <Pressable onPress={remind} style={styles.primary} accessibilityRole="button">
        <Text style={styles.primaryText}>Remind me about this trip</Text>
      </Pressable>
      {notice ? <Text style={styles.notice}>{notice}</Text> : null}
      <Pressable onPress={() => setConfirming(true)} style={styles.danger} accessibilityRole="button">
        <Text style={styles.dangerText}>Delete trip</Text>
      </Pressable>
      <ConfirmModal
        visible={confirming}
        placeName={trip.name}
        title="Delete this trip?"
        message={`${trip.name} will be removed. Places stay on your shortlist.`}
        confirmLabel="Delete"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          deleteTrip(trip.id);
          setConfirming(false);
          router.replace('/trips');
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
    padding: 16,
    paddingBottom: 48,
  },
  range: {
    color: colors.gold,
    fontWeight: '700',
  },
  total: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
    marginTop: 4,
  },
  split: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  section: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 22,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  link: {
    color: colors.green,
    fontWeight: '700',
    fontSize: 15,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipOn: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  chipText: {
    color: colors.ink,
  },
  chipTextOn: {
    color: colors.paper,
    fontWeight: '700',
  },
  empty: {
    color: colors.muted,
    marginTop: 8,
  },
  dayBlock: {
    marginTop: 12,
  },
  dayTitle: {
    color: colors.gold,
    fontWeight: '700',
    fontSize: 13,
  },
  stop: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    marginTop: 8,
  },
  stopName: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  stopMeta: {
    color: colors.muted,
    marginTop: 2,
  },
  stopActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  mini: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  miniOn: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  miniText: {
    color: colors.ink,
    fontWeight: '700',
    fontSize: 12,
  },
  miniTextOn: {
    color: colors.paper,
  },
  remove: {
    color: colors.danger,
    fontWeight: '700',
    marginLeft: 4,
  },
  check: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  boxOn: {
    backgroundColor: colors.green,
  },
  tick: {
    color: colors.paper,
    fontWeight: '700',
  },
  checkLabel: {
    color: colors.ink,
    fontSize: 15,
    flex: 1,
  },
  checkDone: {
    color: colors.muted,
  },
  note: {
    marginTop: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    color: colors.ink,
    fontSize: 15,
  },
  primary: {
    marginTop: 18,
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
  notice: {
    color: colors.greenDark,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  danger: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 10,
  },
  dangerText: {
    color: colors.danger,
    fontWeight: '700',
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
