import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { GENDERS, type Gender } from '@/features/profile/validation';
import { colors, radius, spacing } from '@/theme';

type Props = {
  value: Gender;
  onChange: (value: Gender) => void;
  error?: string;
};

/** One-tap 2×2 choice on the dark profile surface (selected = white pill, like Follow). */
export function GenderField({ value, onChange, error }: Props) {
  return (
    <View style={styles.wrap}>
      <AppText variant="label" style={{ color: colors.nightMuted }} nativeID="gender-label">
        Gender
      </AppText>
      <View style={styles.grid} accessibilityRole="radiogroup" accessibilityLabelledBy="gender-label">
        {GENDERS.map((g) => {
          const selected = g === value;
          return (
            <Pressable
              key={g}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => onChange(g)}
              style={({ pressed }) => [styles.option, selected && styles.selected, pressed && styles.pressed]}
            >
              <AppText variant="label" style={{ color: selected ? colors.brand : colors.onBrand }}>
                {g}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <AppText variant="caption" style={{ color: colors.nightDanger }} accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  option: {
    width: '48.5%',
    height: 48,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.nightBorder,
    backgroundColor: colors.nightField,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: { backgroundColor: colors.onBrand, borderColor: colors.onBrand },
  pressed: { opacity: 0.75 },
});
