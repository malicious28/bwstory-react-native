import { StyleSheet, View } from 'react-native';

import { AppHeader, AppText, EmptyState } from '@/components/ui';
import { colors } from '@/theme';

export default function NotificationsScreen() {
  return (
    <View style={styles.screen}>
      <AppHeader
        center={
          <AppText variant="heading" color="textInverse" accessibilityRole="header" style={styles.title}>
            Notifications
          </AppText>
        }
      />
      <EmptyState icon="notifications-outline" title="You're all caught up" message="Likes, follows and replies will appear here." />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  title: { textAlign: 'center' },
});
