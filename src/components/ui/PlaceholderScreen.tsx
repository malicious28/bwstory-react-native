import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme';

import { AppText } from './AppText';
import { EmptyState } from './EmptyState';
import { FocusStatusBar } from './FocusStatusBar';
import type { IoniconName } from './IconButton';

type Props = { title: string; icon: IoniconName; heading: string; message: string };

/** Light page with a large title and an empty state, for tabs outside the assignment's scope. */
export function PlaceholderScreen({ title, icon, heading, message }: Props) {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: top + spacing.md }]}>
      <FocusStatusBar style="dark" />
      <AppText variant="title" accessibilityRole="header" style={styles.title}>
        {title}
      </AppText>
      <View style={styles.body}>
        <EmptyState icon={icon} title={heading} message={message} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  title: { paddingHorizontal: spacing.xl, fontSize: 28, lineHeight: 34 },
  body: { flex: 1, justifyContent: 'center', paddingBottom: 80 },
});
