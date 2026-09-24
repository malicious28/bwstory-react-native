import { ScrollView, StyleSheet } from 'react-native';

import { Chip } from '@/components/ui';
import { CATEGORIES, type Category } from '@/data/types';
import { colors, spacing } from '@/theme';

type Props = {
  value: Category;
  onChange: (category: Category) => void;
};

export function CategoryTabs({ value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="tablist"
      contentContainerStyle={styles.row}
      style={styles.bar}
    >
      {CATEGORIES.map((c) => (
        <Chip key={c} label={c} selected={c === value} onPress={() => onChange(c)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bar: { flexGrow: 0, backgroundColor: colors.surface, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  row: { gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
});
