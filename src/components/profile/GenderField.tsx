import { StyleSheet, View } from 'react-native';

import { AppText, Chip } from '@/components/ui';
import { GENDERS, type Gender } from '@/features/profile/validation';
import { spacing } from '@/theme';

type Props = {
  value: Gender;
  onChange: (value: Gender) => void;
  error?: string;
};

/** One-tap choice instead of a typed field: no typos, no keyboard. */
export function GenderField({ value, onChange, error }: Props) {
  return (
    <View style={styles.wrap}>
      <AppText variant="label" color="textMuted" nativeID="gender-label">
        Gender
      </AppText>
      <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabelledBy="gender-label">
        {GENDERS.map((g) => (
          <Chip key={g} role="radio" label={g} selected={g === value} onPress={() => onChange(g)} />
        ))}
      </View>
      {error ? (
        <AppText variant="caption" color="danger" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
