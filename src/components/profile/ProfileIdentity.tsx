import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { VerifiedBadge } from '@/components/social/VerifiedBadge';
import { colors } from '@/theme';

type Props = { name: string; handle: string; verified?: boolean };

/** Large centred name + handle that sits over the hero fade. */
export function ProfileIdentity({ name, handle, verified }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.nameRow}>
        <AppText variant="hero" color="textInverse" numberOfLines={2} style={styles.center} accessibilityRole="header">
          {name}
        </AppText>
        {verified ? <VerifiedBadge size={20} outline={colors.onBrand} /> : null}
      </View>
      <AppText variant="body" style={{ color: colors.nightMuted }}>
        @{handle}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, maxWidth: '100%' },
  center: { textAlign: 'center', flexShrink: 1 },
});
