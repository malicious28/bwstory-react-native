import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, type IoniconName } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

type Props = {
  primaryLabel: string;
  /** Outlined style, e.g. "Following". */
  primaryActive?: boolean;
  onPrimary: () => void;
  primaryHint?: string;
  secondaryIcon: IoniconName;
  secondaryLabel: string;
  onSecondary: () => void;
};

/** Wide white pill (Follow / Edit profile) plus a round secondary action. */
export function ProfileActions({
  primaryLabel,
  primaryActive = false,
  onPrimary,
  primaryHint,
  secondaryIcon,
  secondaryLabel,
  onSecondary,
}: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: primaryActive }}
        accessibilityHint={primaryHint}
        onPress={onPrimary}
        style={({ pressed }) => [styles.primary, primaryActive && styles.primaryActive, pressed && styles.pressed]}
      >
        <AppText variant="heading" style={{ color: primaryActive ? colors.onBrand : colors.brand }}>
          {primaryLabel}
        </AppText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={secondaryLabel}
        onPress={onSecondary}
        style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
      >
        <Ionicons name={secondaryIcon} size={22} color={colors.onBrand} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 2 },
  primary: {
    flex: 1,
    height: 56,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.onBrand,
    backgroundColor: colors.onBrand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActive: { backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.5)' },
  secondary: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.28)',
    backgroundColor: colors.nightCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.75 },
});
