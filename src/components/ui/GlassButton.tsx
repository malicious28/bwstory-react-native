import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { colors, hitTarget } from '@/theme';

import type { IoniconName } from './IconButton';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  icon?: IoniconName;
  children?: ReactNode;
  accessibilityLabel: string;
  /** 'dark' = white glyph on a see-through tile (over video); 'light' = dark glyph on a frosted white chip. */
  tone?: 'dark' | 'light';
  shape?: 'circle' | 'rounded';
  size?: number;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
};

/** Translucent control used on top of photos and video. */
export function GlassButton({
  icon,
  children,
  tone = 'dark',
  shape = 'circle',
  size = hitTarget,
  iconSize = 20,
  style,
  ...rest
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={size < hitTarget ? (hitTarget - size) / 2 : 0}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: shape === 'circle' ? size / 2 : 14,
          backgroundColor: tone === 'dark' ? colors.glass : colors.glassLight,
        },
        pressed && styles.pressed,
        style,
      ]}
      {...rest}
    >
      {children ?? (icon ? <Ionicons name={icon} size={iconSize} color={tone === 'dark' ? colors.onBrand : colors.text} /> : null)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.65 },
});
