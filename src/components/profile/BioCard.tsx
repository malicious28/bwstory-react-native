import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { AppText, type IoniconName } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

type Meta = { icon: IoniconName; label: string };

/** Translucent card with the bio and optional meta chips (location, profession). */
export function BioCard({ bio, meta = [] }: { bio: string; meta?: Meta[] }) {
  const items = meta.filter((m) => m.label.trim());
  if (!bio.trim() && items.length === 0) return null;
  return (
    <View style={styles.card}>
      {bio.trim() ? (
        <AppText variant="body" style={{ color: colors.nightText }}>
          {bio}
        </AppText>
      ) : null}
      {items.length > 0 ? (
        <View style={styles.metaRow}>
          {items.map((m) => (
            <View key={m.label} style={styles.meta}>
              <Ionicons name={m.icon} size={14} color={colors.nightMuted} />
              <AppText variant="caption" style={{ color: colors.nightText }}>
                {m.label}
              </AppText>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.nightBorder,
    backgroundColor: colors.nightCard,
  },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.nightField,
  },
});
