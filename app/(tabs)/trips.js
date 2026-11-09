import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ResumeBanner } from '../../components/ResumeBanner';
import { usePlaces } from '../../context/PlacesContext';
import { findPlace } from '../../data/places';
import { budgetFor, formatLkr, formatRange } from '../../lib/plan';
import { colors } from '../../theme/colors';

export default function TripsScreen() {
  const { trips } = usePlaces();

  return (
    <View style={styles.screen}>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <ResumeBanner />
            <View style={styles.intro}>
              <Text style={styles.title}>Trips</Text>
              <Text style={styles.lede}>
                A trip has a Saturday, a length, and the places you actually intend to reach. The
                cost updates as you add them.
              </Text>
              <Pressable
                onPress={() => router.push('/trip/new')}
                style={styles.primary}
                accessibilityRole="button"
              >
                <Text style={styles.primaryText}>Plan a weekend</Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No weekends yet. Plan one, then add places from Explore.</Text>
        }
        renderItem={({ item }) => {
          const budget = budgetFor(item);
          const names = item.stops
            .map((stop) => findPlace(stop.placeId)?.name)
            .filter(Boolean)
            .join(', ');
          return (
            <Pressable
              onPress={() => router.push(`/trip/${item.id}`)}
              style={styles.card}
              accessibilityRole="button"
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                {formatRange(item.startDate, item.days)} · {item.days === 1 ? 'Day trip' : `${item.days} days`}
              </Text>
              <Text style={styles.places}>{names || 'No places added yet'}</Text>
              <Text style={styles.cost}>{formatLkr(budget.total)}</Text>
            </Pressable>
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
  intro: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
  },
  lede: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 6,
  },
  primary: {
    alignSelf: 'flex-start',
    marginTop: 14,
    backgroundColor: colors.green,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryText: {
    color: colors.paper,
    fontWeight: '700',
    fontSize: 15,
  },
  list: {
    paddingBottom: 28,
    flexGrow: 1,
  },
  empty: {
    color: colors.muted,
    fontSize: 15,
    marginHorizontal: 16,
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
  },
  name: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  places: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  cost: {
    color: colors.greenDark,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
});
