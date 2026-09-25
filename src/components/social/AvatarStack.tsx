import { StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui';
import type { Author } from '@/data/types';
import { colors } from '@/theme';

type Props = { people: Author[]; size?: number; borderColor?: string };

/** Overlapping avatars, e.g. "people who liked this". Decorative. */
export function AvatarStack({ people, size = 26, borderColor = colors.surface }: Props) {
  return (
    <View style={styles.row} accessible={false} importantForAccessibility="no-hide-descendants">
      {people.map((p, i) => (
        <View
          key={p.id}
          style={[
            styles.ring,
            { borderRadius: (size + 4) / 2, borderColor, marginLeft: i === 0 ? 0 : -size * 0.35 },
          ]}
        >
          <Avatar name={p.name} uri={p.avatarUrl} tone={p.tone} size={size} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  ring: { borderWidth: 2 },
});
