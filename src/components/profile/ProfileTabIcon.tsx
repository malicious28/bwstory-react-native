import { StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui';
import { useProfile } from '@/features/profile/ProfileContext';
import { colors } from '@/theme';

/** Tab bar avatar showing the user's saved photo (or initials), ringed when active. */
export function ProfileTabIcon({ focused }: { focused: boolean }) {
  const { profile } = useProfile();
  return (
    <View style={styles.wrap}>
      <View style={[styles.ring, focused && styles.ringActive]}>
        <Avatar name={profile.name} uri={profile.photoUri} size={28} />
      </View>
      <View style={[styles.indicator, focused && styles.indicatorActive]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 4, paddingTop: 6 },
  ring: { padding: 1.5, borderRadius: 18, borderWidth: 1.5, borderColor: 'transparent' },
  ringActive: { borderColor: colors.brand },
  indicator: { width: 22, height: 3, borderRadius: 2, backgroundColor: 'transparent' },
  indicatorActive: { backgroundColor: colors.brand },
});
