import { StyleSheet, View } from 'react-native';

import { AppHeader, AppText, EmptyState } from '@/components/ui';
import { colors } from '@/theme';

export default function CreateScreen() {
  return (
    <View style={styles.screen}>
      <AppHeader
        center={
          <AppText variant="heading" color="textInverse" accessibilityRole="header" style={styles.title}>
            Create story
          </AppText>
        }
      />
      <EmptyState icon="videocam-outline" title="Share a story" message="Recording and posting stories is coming soon." />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  title: { textAlign: 'center' },
});
