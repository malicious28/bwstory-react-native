import * as Haptics from 'expo-haptics';

/** Fire-and-forget haptics; never let a device without a vibrator surface an error. */
export const haptics = {
  tap: () => void Haptics.selectionAsync().catch(() => {}),
  success: () => void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
  warning: () => void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {}),
};
