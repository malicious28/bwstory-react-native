import { StyleSheet, View } from 'react-native';

import { AppHeader, AppText, EmptyState } from '@/components/ui';
import { colors } from '@/theme';

export default function NearbyScreen() {
  return (
    <View style={styles.screen}>
      <AppHeader
        center={
          <AppText variant="heading" color="textInverse" accessibilityRole="header" style={styles.title}>
            Nearby
          </AppText>
        }
      />
      <EmptyState icon="location-outline" title="Stories near you" message="Local stories from your area will show up here." />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  title: { textAlign: 'center' },
});
