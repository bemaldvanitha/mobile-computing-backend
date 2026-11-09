import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { categories, regions } from '../data/places';
import { colors } from '../theme/colors';

function Chip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
      accessibilityRole="button"
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function FilterModal({
  visible,
  category,
  region,
  onChangeCategory,
  onChangeRegion,
  onClose,
  onClear,
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissArea} onPress={onClose} accessibilityRole="button" />
        <View style={styles.sheet}>
          <Text style={styles.title}>Filter trails</Text>
          <Text style={styles.section}>Category</Text>
          <View style={styles.chips}>
            {categories.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={item === category}
                onPress={() => onChangeCategory(item)}
              />
            ))}
          </View>
          <Text style={styles.section}>Region</Text>
          <View style={styles.chips}>
            {regions.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={item === region}
                onPress={() => onChangeRegion(item)}
              />
            ))}
          </View>
          <Pressable onPress={onClose} style={styles.primary} accessibilityRole="button">
            <Text style={styles.primaryText}>Show trails</Text>
          </Pressable>
          <Pressable onPress={onClear} style={styles.secondary} accessibilityRole="button">
            <Text style={styles.secondaryText}>Reset filters</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  title: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  section: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.background,
  },
  chipSelected: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  chipText: {
    color: colors.ink,
    fontSize: 14,
  },
  chipTextSelected: {
    color: colors.paper,
    fontWeight: '700',
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
  secondary: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: {
    color: colors.greenDark,
    fontWeight: '600',
    fontSize: 15,
  },
});
