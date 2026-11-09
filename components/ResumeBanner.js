import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePlaces } from '../context/PlacesContext';
import { colors } from '../theme/colors';

export function ResumeBanner() {
  const { banner, dismissBanner } = usePlaces();
  if (!banner) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.message}>{banner}</Text>
      <Pressable onPress={dismissBanner} accessibilityRole="button" hitSlop={8}>
        <Text style={styles.dismiss}>Dismiss</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.banner,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  message: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
  },
  dismiss: {
    color: colors.greenDark,
    fontWeight: '700',
    fontSize: 14,
  },
});
