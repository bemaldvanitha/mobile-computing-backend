import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function PlaceCard({ place, saved, onOpen, onSave, onRemove }) {
  return (
    <View style={styles.card}>
      <Pressable onPress={onOpen} style={styles.main} accessibilityRole="button">
        <Image source={place.image} style={styles.image} />
        <View style={styles.copy}>
          <Text style={styles.name}>{place.name}</Text>
          <Text style={styles.meta}>
            {place.region} · {place.category}
          </Text>
          <Text style={styles.summary} numberOfLines={3}>
            {place.summary}
          </Text>
        </View>
      </Pressable>
      <View style={styles.actionRow}>
        {saved ? (
          <Pressable onPress={onRemove} style={styles.action} accessibilityRole="button">
            <Text style={styles.removeText}>Remove from shortlist</Text>
          </Pressable>
        ) : (
          <Pressable onPress={onSave} style={styles.action} accessibilityRole="button">
            <Text style={styles.saveText}>Save to shortlist</Text>
          </Pressable>
        )}
        <Pressable onPress={onOpen} style={styles.action} accessibilityRole="button">
          <Text style={styles.openText}>Details</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  main: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: colors.line,
  },
  copy: {
    flex: 1,
  },
  name: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  summary: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  actionRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  action: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveText: {
    color: colors.green,
    fontWeight: '700',
    fontSize: 14,
  },
  removeText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 14,
  },
  openText: {
    color: colors.ink,
    fontWeight: '600',
    fontSize: 14,
  },
});
