import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Avatar } from '@/components/ui';
import type { Author } from '@/data/types';
import { colors, fonts, spacing } from '@/theme';

const SIZE = 66;

type Props = {
  me: { name: string; photoUri: string | null };
  authors: Author[];
  seen: ReadonlySet<string>;
  onAddStory: () => void;
  onOpen: (author: Author) => void;
};

function Ring({ color, children }: { color: string; children: ReactNode }) {
  return <View style={[styles.ring, { borderColor: color }]}>{children}</View>;
}

/** Horizontal story rings: navy = new, grey = already watched. */
export function StoriesRail({ me, authors, seen, onAddStory, onOpen }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <Pressable accessibilityRole="button" accessibilityLabel="Add to your story" onPress={onAddStory} style={styles.item}>
        <Ring color={colors.border}>
          <Avatar name={me.name} uri={me.photoUri} size={SIZE - 12} />
          <View style={styles.plus}>
            <Ionicons name="add" size={14} color={colors.onBrand} />
          </View>
        </Ring>
        <AppText variant="caption" numberOfLines={1} style={[styles.name, styles.bold]}>
          Your Story
        </AppText>
      </Pressable>

      {authors.map((a) => {
        const watched = seen.has(a.id);
        return (
          <Pressable
            key={a.id}
            accessibilityRole="button"
            accessibilityLabel={`${a.name}, ${watched ? 'story watched' : 'new story'}`}
            onPress={() => onOpen(a)}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
          >
            <Ring color={watched ? colors.ringSeen : colors.brand}>
              <Avatar name={a.name} uri={a.avatarUrl} tone={a.tone} size={SIZE - 12} />
            </Ring>
            <AppText variant="caption" numberOfLines={1} style={styles.name}>
              {a.handle}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  item: { width: SIZE, alignItems: 'center', gap: 6 },
  ring: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.5,
    borderColor: colors.surface,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { maxWidth: SIZE, color: colors.text },
  bold: { fontFamily: fonts.bold },
  pressed: { opacity: 0.7 },
});
