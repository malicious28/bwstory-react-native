import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { formatCount } from '@/lib/format';
import { colors } from '@/theme';

type Stat = { label: string; value: number };

export function ProfileStats({ stats }: { stats: Stat[] }) {
  return (
    <View style={styles.row}>
      {stats.map((s) => (
        <View
          key={s.label}
          style={styles.cell}
          accessible
          accessibilityLabel={`${formatCount(s.value)} ${s.label}`}
        >
          <AppText variant="stat" color="textInverse" allowFontScaling={false}>
            {formatCount(s.value)}
          </AppText>
          <AppText variant="label" style={{ color: colors.nightMuted }}>
            {s.label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  cell: { flex: 1, alignItems: 'center', gap: 2 },
});
