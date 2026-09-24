import { Pressable, StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/theme';

import { AppText } from './AppText';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** 'radio' for single-choice groups (e.g. gender), 'tab' for filters. */
  role?: 'radio' | 'tab';
};

export function Chip({ label, selected, onPress, role = 'tab' }: Props) {
  return (
    <Pressable
      accessibilityRole={role}
      accessibilityState={{ selected, checked: role === 'radio' ? selected : undefined }}
      onPress={onPress}
      hitSlop={{ top: 6, bottom: 6 }}
      style={({ pressed }) => [styles.base, selected ? styles.selected : styles.idle, pressed && styles.pressed]}
    >
      <AppText variant="label" color={selected ? 'textInverse' : 'textMuted'}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 36,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  idle: { backgroundColor: colors.surface, borderColor: colors.border },
  selected: { backgroundColor: colors.brand, borderColor: colors.brand },
  pressed: { opacity: 0.75 },
});
