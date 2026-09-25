import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BioCard } from '@/components/profile/BioCard';
import { ProfileActions } from '@/components/profile/ProfileActions';
import { ProfileIdentity } from '@/components/profile/ProfileIdentity';
import { ProfilePage } from '@/components/profile/ProfilePage';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { StoryGrid } from '@/components/profile/StoryGrid';
import { AppText, EmptyState, GlassButton, useToast } from '@/components/ui';
import { getAuthor } from '@/data/authors';
import { storiesBy } from '@/data/stories';
import { useSocial } from '@/features/social/SocialContext';
import { colors, radius, spacing } from '@/theme';

/** Route: /discover/video/user?authorId=… (creator profile). */
export default function CreatorProfile() {
  const { authorId } = useLocalSearchParams<{ authorId?: string }>();
  const toast = useToast();
  const social = useSocial();
  // Only known ids are accepted from the (deep-linkable) route params.
  const author = getAuthor(typeof authorId === 'string' ? authorId : undefined);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/discover'));

  if (!author) {
    return (
      <ProfilePage name="?" topLeft={<GlassButton icon="close" accessibilityLabel="Close" onPress={close} />}>
        <View style={styles.missing}>
          <EmptyState icon="person-outline" title="Profile not found" message="This account may no longer exist." />
        </View>
      </ProfilePage>
    );
  }

  const following = social.isFollowing(author.id);
  const stories = storiesBy(author.id);
  const cover = stories[0]?.posterUrl ?? null;

  return (
    <ProfilePage
      name={author.name}
      coverUri={cover}
      tone={author.tone}
      topLeft={<GlassButton icon="close" iconSize={20} accessibilityLabel="Close profile" onPress={close} />}
      topRight={
        <GlassButton icon="ellipsis-horizontal" accessibilityLabel="More options" onPress={() => toast('Profile options are coming soon')} />
      }
    >
      <ProfileIdentity name={author.name} handle={author.handle} verified={author.verified} />
      <ProfileActions
        primaryLabel={following ? 'Following' : 'Follow'}
        primaryActive={following}
        primaryHint={following ? `Unfollow ${author.name}` : `Follow ${author.name}`}
        onPrimary={() => social.toggleFollow(author.id)}
        secondaryIcon="chatbubble-outline"
        secondaryLabel={`Message ${author.name}`}
        onSecondary={() => toast('Messages are coming soon')}
      />
      <ProfileStats
        stats={[
          { label: 'Following', value: author.following },
          { label: 'Followers', value: author.followers + (following ? 1 : 0) },
          { label: 'Stories', value: stories.length },
        ]}
      />
      <BioCard bio={author.bio} meta={[{ icon: 'location-outline', label: author.location }]} />
      <View style={styles.section}>
        <AppText variant="heading" color="textInverse">
          Stories
        </AppText>
        <StoryGrid
          stories={stories}
          onOpen={(s) => router.push({ pathname: '/discover/video', params: { storyId: s.id } })}
        />
      </View>
    </ProfilePage>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.md, paddingTop: spacing.xs },
  missing: { marginTop: 160, borderRadius: radius.xl, backgroundColor: colors.surface },
});
