import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { colors, hitTarget, radius } from '@/theme';

export type IoniconName = ComponentProps<typeof Ionicons>['name'];

type Props = Omit<PressableProps, 'children' | 'style'> & {
  /** Ionicon name, or pass `children` for a custom glyph. */
  icon?: IoniconName;
  children?: ReactNode;
  /** Required: icon-only buttons must be announced by screen readers. */
  accessibilityLabel: string;
  size?: number;
  color?: string;
  variant?: 'ghost' | 'surface';
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  icon,
  children,
  size = 24,
  color = colors.text,
  variant = 'ghost',
  style,
  disabled,
  ...rest
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={4}
      disabled={disabled}
      android_ripple={{ color: 'rgba(127,127,127,0.18)', borderless: true, radius: hitTarget / 2 + 2 }}
      style={({ pressed }) => [
        styles.base,
        variant === 'surface' && styles.surface,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {children ?? (icon ? <Ionicons name={icon} size={size} color={color} /> : null)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minWidth: hitTarget,
    minHeight: hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  surface: {
    backgroundColor: colors.surface,
  },
  pressed: { opacity: 0.6 },
  disabled: { opacity: 0.4 },
});
