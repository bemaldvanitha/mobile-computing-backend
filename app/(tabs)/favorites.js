import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ConfirmModal } from '../../components/ConfirmModal';
import { PlaceCard } from '../../components/PlaceCard';
import { ResumeBanner } from '../../components/ResumeBanner';
import { usePlaces } from '../../context/PlacesContext';
import { colors } from '../../theme/colors';

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = usePlaces();
  const [pendingRemove, setPendingRemove] = useState(null);

  return (
    <View style={styles.screen}>
      <ResumeBanner />
      <View style={styles.intro}>
        <Text style={styles.title}>Shortlist</Text>
        <Text style={styles.lede}>
          Places you saved from Explore. This list uses the same shared state, so a save on another
          screen shows up here immediately.
        </Text>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.empty}>No trails saved yet.</Text>
            <Pressable onPress={() => router.push('/')} style={styles.link} accessibilityRole="button">
              <Text style={styles.linkText}>Browse Explore</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <PlaceCard
            place={item}
            saved
            onOpen={() => router.push(`/place/${item.id}`)}
            onRemove={() => setPendingRemove(item)}
          />
        )}
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
  list: {
    paddingTop: 8,
    paddingBottom: 24,
    flexGrow: 1,
  },
  emptyBox: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  empty: {
    color: colors.muted,
    fontSize: 15,
  },
  link: {
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  linkText: {
    color: colors.green,
    fontWeight: '700',
    fontSize: 15,
  },
});
