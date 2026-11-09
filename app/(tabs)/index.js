import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ConfirmModal } from '../../components/ConfirmModal';
import { FilterModal } from '../../components/FilterModal';
import { PlaceCard } from '../../components/PlaceCard';
import { ResumeBanner } from '../../components/ResumeBanner';
import { usePlaces } from '../../context/PlacesContext';
import { notifySaved } from '../../lib/notifications';
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
  } = usePlaces();
  const [filterOpen, setFilterOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState(null);
  const [notice, setNotice] = useState('');

  const filtered = places.filter((place) => {
    const categoryMatches = category === 'All' || place.category === category;
    const regionMatches = region === 'All' || place.region === region;
    return categoryMatches && regionMatches;
  });

  const filterLabel =
    category === 'All' && region === 'All' ? 'All trails' : [category, region].filter((item) => item !== 'All').join(' · ');

  async function savePlace(place) {
    addFavorite(place.id);
    const delivered = await notifySaved(place.name);
    setNotice(
      delivered
        ? `${place.name} is on your shortlist. A notification was sent.`
        : `${place.name} is on your shortlist. Allow notifications in Expo Go to see the alert.`
    );
  }

  return (
    <View style={styles.screen}>
      <ResumeBanner />
      <View style={styles.intro}>
        <Text style={styles.kicker}>Weekends from Kelaniya</Text>
        <Text style={styles.title}>Ceylon Trails</Text>
        <Text style={styles.lede}>
          Ten places with real travel times, seasons, and what to actually do when you get there.
          Save the ones you mean to go to.
        </Text>
        <Pressable onPress={() => setFilterOpen(true)} style={styles.filterButton} accessibilityRole="button">
          <Text style={styles.filterText}>Filter · {filterLabel}</Text>
        </Pressable>
        <Text style={styles.count}>
          Showing {filtered.length} of {places.length}
        </Text>
        {notice ? <Text style={styles.notice}>{notice}</Text> : null}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Nothing matches this filter. Reset it to see all ten trails.</Text>
        }
        renderItem={({ item }) => (
          <PlaceCard
            place={item}
            saved={isFavorite(item.id)}
            onOpen={() => router.push(`/place/${item.id}`)}
            onSave={() => savePlace(item)}
            onRemove={() => setPendingRemove(item)}
          />
        )}
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: '700',
    marginTop: 2,
  },
  lede: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 6,
  },
  filterButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
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
  count: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 8,
  },
  notice: {
    color: colors.greenDark,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  list: {
    paddingTop: 8,
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
