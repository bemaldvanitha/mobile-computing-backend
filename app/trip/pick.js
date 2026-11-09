import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { usePlaces } from '../../context/PlacesContext';
import { costFor } from '../../data/costs';
import { formatLkr } from '../../lib/plan';
import { colors } from '../../theme/colors';

export default function PickPlacesScreen() {
  const { tripId } = useLocalSearchParams();
  const id = Array.isArray(tripId) ? tripId[0] : tripId;
  const { getTrip, places, addStop, removeStop } = usePlaces();
  const trip = getTrip(id);
  const [query, setQuery] = useState('');
  const [day, setDay] = useState(1);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return places.filter((place) => {
      if (!needle) {
        return true;
      }
      return `${place.name} ${place.region} ${place.category}`.toLowerCase().includes(needle);
    });
  }, [places, query]);

  if (!trip) {
    return (
      <View style={styles.missing}>
        <Stack.Screen options={{ title: 'Add places' }} />
        <Text style={styles.missingTitle}>Open this from a trip.</Text>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.link}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const activeDay = Math.min(day, trip.days);

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: `Add to ${trip.name}` }} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.lead}>Choose a day, then add a place. Adding it also saves it to the shortlist.</Text>
            <View style={styles.chips}>
              {Array.from({ length: trip.days }, (_, index) => index + 1).map((option) => {
                const selected = option === activeDay;
                return (
                  <Pressable
                    key={option}
                    onPress={() => setDay(option)}
                    style={[styles.chip, selected && styles.chipOn]}
                    accessibilityRole="button"
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextOn]}>Day {option}</Text>
                  </Pressable>
                );
              })}
            </View>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search the ten places"
              placeholderTextColor={colors.muted}
              style={styles.search}
              autoCorrect={false}
            />
          </View>
        }
        renderItem={({ item }) => {
          const stop = trip.stops.find((entry) => entry.placeId === item.id);
          const cost = costFor(item.id);
          return (
            <View style={styles.row}>
              <View style={styles.copy}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {item.region} · {formatLkr(cost.ticketLkr + cost.extrasLkr)} on site · {formatLkr(cost.busLkr)} bus
                </Text>
              </View>
              {stop ? (
                <Pressable
                  onPress={() => removeStop(trip.id, item.id)}
                  style={styles.remove}
                  accessibilityRole="button"
                >
                  <Text style={styles.removeText}>Day {stop.day} · Remove</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => addStop(trip.id, item.id, activeDay)}
                  style={styles.add}
                  accessibilityRole="button"
                >
                  <Text style={styles.addText}>Add</Text>
                </Pressable>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingBottom: 8,
  },
  lead: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    marginHorizontal: 16,
    marginTop: 12,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
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
    fontWeight: '700',
  },
  chipTextOn: {
    color: colors.paper,
  },
  search: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink,
  },
  list: {
    paddingBottom: 28,
  },
  row: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  copy: {
    flex: 1,
  },
  name: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  add: {
    backgroundColor: colors.green,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addText: {
    color: colors.paper,
    fontWeight: '700',
  },
  remove: {
    paddingVertical: 8,
  },
  removeText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 13,
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
  link: {
    color: colors.green,
    fontWeight: '700',
    marginTop: 12,
  },
});
