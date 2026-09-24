import { ActivityIndicator, Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { colors, hitTarget, radius, spacing } from '@/theme';

import { AppText } from './AppText';

type Variant = 'primary' | 'outline' | 'ghost' | 'onBrand';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: Variant;
  loading?: boolean;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

const TEXT_COLOR = {
  primary: 'textInverse',
  outline: 'text',
  ghost: 'textMuted',
  onBrand: 'textInverse',
} as const;

export function Button({ label, variant = 'primary', loading = false, compact = false, disabled, style, ...rest }: Props) {
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: loading }}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        styles[variant],
        pressed && styles.pressed,
        inactive && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' || variant === 'onBrand' ? colors.onBrand : colors.brand} />
      ) : (
        <AppText variant="bodyStrong" color={TEXT_COLOR[variant]} numberOfLines={1}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: hitTarget + 4,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: { minHeight: 36, paddingHorizontal: spacing.lg },
  primary: { backgroundColor: colors.brand },
  outline: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.text },
  ghost: { backgroundColor: 'transparent', paddingHorizontal: spacing.md },
  onBrand: { backgroundColor: 'transparent', paddingHorizontal: spacing.md },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.45 },
});
