import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function ConfirmModal({
  visible,
  placeName,
  title = 'Remove this place?',
  message,
  confirmLabel = 'Remove',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>
            {message ?? `${placeName} will leave your shortlist. You can save it again from Explore.`}
          </Text>
          <View style={styles.actions}>
            <Pressable onPress={onCancel} style={styles.cancel} accessibilityRole="button">
              <Text style={styles.cancelText}>Keep it</Text>
            </Pressable>
            <Pressable onPress={onConfirm} style={styles.confirm} accessibilityRole="button">
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 28, 24, 0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
  },
  title: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  message: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  cancel: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  cancelText: {
    color: colors.ink,
    fontWeight: '700',
  },
  confirm: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.danger,
  },
  confirmText: {
    color: '#FFF8F6',
    fontWeight: '700',
  },
});
