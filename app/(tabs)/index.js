import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { ConfirmModal } from '../../components/ConfirmModal';
import { FilterModal } from '../../components/FilterModal';
import { PlaceCard } from '../../components/PlaceCard';
import { ResumeBanner } from '../../components/ResumeBanner';
import { usePlaces } from '../../context/PlacesContext';
import { origin } from '../../data/places';
import { hoursFor } from '../../lib/plan';
import { colors } from '../../theme/colors';

export default function ExploreScreen() {
  const {
    places,
    category,
    region,
    setCategory,
    setRegion,
    clearFilters,
    isFavorite,
    addFavorite,
    removeFavorite,
    tripsForPlace,
  } = usePlaces();
  const [query, setQuery] = useState('');
  const [nearestFirst, setNearestFirst] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState(null);
  const [notice, setNotice] = useState('');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = places.filter((place) => {
      const categoryMatches = category === 'All' || place.category === category;
      const regionMatches = region === 'All' || place.region === region;
      const text = `${place.name} ${place.region} ${place.category} ${place.summary}`.toLowerCase();
      const queryMatches = needle.length === 0 || text.includes(needle);
      return categoryMatches && regionMatches && queryMatches;
    });
    if (!nearestFirst) {
      return matches;
    }
    return [...matches].sort((a, b) => hoursFor(a.id) - hoursFor(b.id));
  }, [places, category, region, query, nearestFirst]);

  const filterLabel =
    category === 'All' && region === 'All'
      ? 'All regions'
      : [category, region].filter((item) => item !== 'All').join(' · ');

  function savePlace(place) {
    addFavorite(place.id);
    setNotice(`${place.name} is on your shortlist. Saving a place does not start a trip.`);
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.intro}>
            <ResumeBanner />
            <Text style={styles.kicker}>From {origin}</Text>
            <Text style={styles.title}>Ceylon Trails</Text>
            <Text style={styles.lede}>
              Search thirty places, save the ones you want, then walk through the three steps to
              build a weekend.
            </Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search name, region, or coast"
              placeholderTextColor={colors.muted}
              style={styles.search}
              autoCorrect={false}
            />
            <View style={styles.tools}>
              <Pressable
                onPress={() => setFilterOpen(true)}
                style={styles.filterButton}
                accessibilityRole="button"
              >
                <Text style={styles.filterText}>{filterLabel}</Text>
              </Pressable>
              <Pressable
                onPress={() => setNearestFirst((current) => !current)}
                style={[styles.sortButton, nearestFirst && styles.sortButtonOn]}
                accessibilityRole="button"
              >
                <Text style={[styles.sortText, nearestFirst && styles.sortTextOn]}>
                  {nearestFirst ? 'Nearest first' : 'Listed order'}
                </Text>
              </Pressable>
            </View>
            <Text style={styles.count}>
              {filtered.length} of {places.length}
              {query.trim() ? ` for “${query.trim()}”` : ''}
            </Text>
            {notice ? <Text style={styles.notice}>{notice}</Text> : null}
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Nothing matches that search. Clear it or reset the filter.</Text>
        }
        renderItem={({ item }) => {
          const usedIn = tripsForPlace(item.id);
          return (
            <PlaceCard
              place={item}
              saved={isFavorite(item.id)}
              note={
                usedIn.length > 0
                  ? `On ${usedIn.length === 1 ? usedIn[0].name : `${usedIn.length} trips`}`
                  : `${hoursFor(item.id)} h from ${origin}`
              }
              onOpen={() => router.push(`/place/${item.id}`)}
              onSave={() => savePlace(item)}
              onRemove={() => setPendingRemove(item)}
            />
          );
        }}
      />
      <FilterModal
        visible={filterOpen}
        category={category}
        region={region}
        onChangeCategory={setCategory}
        onChangeRegion={setRegion}
        onClose={() => setFilterOpen(false)}
        onClear={() => {
          clearFilters();
          setFilterOpen(false);
        }}
      />
      <ConfirmModal
        visible={pendingRemove !== null}
        placeName={pendingRemove?.name ?? ''}
        onCancel={() => setPendingRemove(null)}
        onConfirm={() => {
          if (pendingRemove) {
            removeFavorite(pendingRemove.id);
          }
          setPendingRemove(null);
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
    paddingBottom: 8,
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginHorizontal: 16,
    marginTop: 8,
  },
  title: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: '700',
    marginHorizontal: 16,
    marginTop: 2,
  },
  lede: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    marginHorizontal: 16,
    marginTop: 6,
  },
  search: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink,
  },
  tools: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 10,
  },
  filterButton: {
    backgroundColor: colors.green,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterText: {
    color: colors.paper,
    fontWeight: '700',
    fontSize: 14,
  },
  sortButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  sortButtonOn: {
    borderColor: colors.green,
    backgroundColor: colors.banner,
  },
  sortText: {
    color: colors.ink,
    fontWeight: '700',
    fontSize: 14,
  },
  sortTextOn: {
    color: colors.greenDark,
  },
  count: {
    color: colors.muted,
    fontSize: 13,
    marginHorizontal: 16,
    marginTop: 8,
  },
  notice: {
    color: colors.greenDark,
    fontSize: 14,
    lineHeight: 20,
    marginHorizontal: 16,
    marginTop: 8,
  },
  list: {
    paddingTop: 4,
    paddingBottom: 24,
  },
  empty: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginHorizontal: 16,
    marginTop: 12,
  },
});
