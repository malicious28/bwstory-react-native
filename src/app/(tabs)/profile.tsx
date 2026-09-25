import { router } from 'expo-router';
import { ActivityIndicator, Share, StyleSheet, View } from 'react-native';

import { BioCard } from '@/components/profile/BioCard';
import { ProfileActions } from '@/components/profile/ProfileActions';
import { ProfileIdentity } from '@/components/profile/ProfileIdentity';
import { ProfilePage } from '@/components/profile/ProfilePage';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { AppText, Button, GlassButton, useToast } from '@/components/ui';
import { useProfile } from '@/features/profile/ProfileContext';
import { useSocial } from '@/features/social/SocialContext';
import { colors, radius, spacing } from '@/theme';

/** "rashmi desai" → "rashmi.desai" (display only; handles aren't editable yet). */
function handleFrom(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9\s.]/g, '')
      .trim()
      .replace(/\s+/g, '.') || 'you'
  );
}

/** Route: /profile (the signed-in user's own profile, same layout as creator pages). */
export default function MyProfile() {
  const { profile, loaded } = useProfile();
  const { followingCount } = useSocial();
  const toast = useToast();

  if (!loaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.onBrand} size="large" />
      </View>
    );
  }

  const handle = handleFrom(profile.name);
  const editProfile = () => router.push('/profile/edit');
  const shareProfile = async () => {
    try {
      await Share.share({ message: `${profile.name} (@${handle}) on BWStory` });
    } catch {
      toast('Couldn’t open the share sheet', 'error');
    }
  };

  return (
    <ProfilePage
      name={profile.name}
      coverUri={profile.photoUri}
      topRight={<GlassButton icon="create-outline" accessibilityLabel="Edit profile" onPress={editProfile} />}
    >
      <ProfileIdentity name={profile.name} handle={handle} />
      <ProfileActions
        primaryLabel="Edit profile"
        onPrimary={editProfile}
        primaryHint="Update your photo, name and bio"
        secondaryIcon="share-social-outline"
        secondaryLabel="Share your profile"
        onSecondary={shareProfile}
      />
      <ProfileStats
        stats={[
          { label: 'Following', value: followingCount },
          { label: 'Followers', value: 0 },
          { label: 'Stories', value: 0 },
        ]}
      />
      <BioCard
        bio={profile.bio}
        meta={[
          { icon: 'briefcase-outline', label: profile.profession },
          { icon: 'location-outline', label: profile.location },
        ]}
      />
      <View style={styles.section}>
        <AppText variant="heading" color="textInverse">
          Your stories
        </AppText>
        <View style={styles.empty}>
          <AppText variant="body" style={styles.emptyText}>
            You haven’t posted a story yet. Share what’s happening around you.
          </AppText>
          <Button label="Create your first story" variant="outline" compact onPress={() => router.navigate('/create')} style={styles.emptyBtn} />
        </View>
      </View>
    </ProfilePage>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: colors.night, alignItems: 'center', justifyContent: 'center' },
  section: { gap: spacing.md, paddingTop: spacing.xs },
  empty: {
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.nightBorder,
  },
  emptyText: { color: colors.nightMuted, textAlign: 'center' },
  emptyBtn: { backgroundColor: colors.onBrand, borderColor: colors.onBrand },
});
