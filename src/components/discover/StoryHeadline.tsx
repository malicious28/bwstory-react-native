import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { spacing } from '@/theme';

type Props = { headline: string; summary: string };

/** Headline with an inline "more" that reveals the summary in place (no navigation needed). */
export function StoryHeadline({ headline, summary }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityHint={expanded ? 'Collapses the story summary' : 'Shows the full story summary'}
      onPress={() => setExpanded((e) => !e)}
      style={styles.wrap}
    >
      <AppText variant="bodyStrong" numberOfLines={expanded ? undefined : 2}>
        {headline}
      </AppText>
      {expanded ? (
        <View style={styles.summary}>
          <AppText variant="body" color="textMuted">
            {summary}
          </AppText>
        </View>
      ) : null}
      <AppText variant="label" color="brand" style={styles.toggle}>
        {expanded ? 'Show less' : 'Read more'}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  summary: { marginTop: spacing.xs },
  toggle: { alignSelf: 'flex-start', paddingVertical: spacing.xxs },
});
