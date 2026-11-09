import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { usePlaces } from '../../context/PlacesContext';
import { findPlace } from '../../data/places';
import { formatIsoDate, upcomingWeekends } from '../../lib/plan';
import { colors } from '../../theme/colors';

const DAY_OPTIONS = [1, 2, 3];

export default function NewTripScreen() {
  const { placeId } = useLocalSearchParams();
  const seed = findPlace(placeId);
  const weekends = upcomingWeekends(6);
  const { createTrip } = usePlaces();
  const [name, setName] = useState(seed ? `${seed.name} weekend` : '');
  const [startDate, setStartDate] = useState(weekends[0]);
  const [days, setDays] = useState(seed?.id === 'ella' || seed?.id === 'nilaveli' ? 2 : 1);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  function create() {
    if (name.trim().length < 2) {
      setError('Give the trip a name of at least two letters.');
      return;
    }
    const trip = createTrip({
      name,
      startDate,
      days,
      note,
      placeId: seed?.id,
    });
    router.replace(`/trip/${trip.id}`);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: 'New trip' }} />
      <Text style={styles.lead}>
        Pick the Saturday you can actually leave Kelaniya. You can add places after this.
      </Text>
      {seed ? (
        <Text style={styles.seed}>{seed.name} will be added on day 1.</Text>
      ) : null}
      <Text style={styles.label}>Trip name</Text>
      <TextInput
        value={name}
        onChangeText={(value) => {
          setName(value);
          setError('');
        }}
        placeholder="South coast Saturday"
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
      <Text style={styles.label}>Leave on</Text>
      <View style={styles.chips}>
        {weekends.map((iso) => {
          const selected = iso === startDate;
          return (
            <Pressable
              key={iso}
              onPress={() => setStartDate(iso)}
              style={[styles.chip, selected && styles.chipOn]}
              accessibilityRole="button"
            >
              <Text style={[styles.chipText, selected && styles.chipTextOn]}>{formatIsoDate(iso)}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.label}>How many days</Text>
      <View style={styles.chips}>
        {DAY_OPTIONS.map((option) => {
          const selected = option === days;
          return (
            <Pressable
              key={option}
              onPress={() => setDays(option)}
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
      <Text style={styles.label}>Note</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Who is coming, or which bus you usually catch"
        placeholderTextColor={colors.muted}
        style={[styles.input, styles.note]}
        multiline
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable onPress={create} style={styles.primary} accessibilityRole="button">
        <Text style={styles.primaryText}>Create trip</Text>
      </Pressable>
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
    paddingBottom: 40,
  },
  lead: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
  },
  seed: {
    color: colors.greenDark,
    fontWeight: '700',
    marginTop: 10,
  },
  label: {
    color: colors.ink,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink,
  },
  note: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
    fontSize: 14,
  },
  chipTextOn: {
    color: colors.paper,
    fontWeight: '700',
  },
  error: {
    color: colors.danger,
    marginTop: 12,
    fontSize: 14,
  },
  primary: {
    marginTop: 20,
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
});
