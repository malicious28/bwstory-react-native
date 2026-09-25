import { router, useIsFocused } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, Share, StyleSheet, View, type ViewToken } from 'react-native';

import { FeedHeader } from '@/components/social/FeedHeader';
import { FeedPostCard } from '@/components/social/FeedPostCard';
import { StoriesRail } from '@/components/social/StoriesRail';
import { FocusStatusBar, useToast } from '@/components/ui';
import { AUTHORS } from '@/data/authors';
import { SAMPLE_STORIES, storiesBy } from '@/data/stories';
import type { Author, Story } from '@/data/types';
import { useProfile } from '@/features/profile/ProfileContext';
import { useSocial } from '@/features/social/SocialContext';
import { colors, spacing } from '@/theme';

const VIEWABILITY = { itemVisiblePercentThreshold: 60, minimumViewTime: 150 };
// Room for the raised Create button, which overlaps the list's bottom edge.
const TAB_BAR_CLEARANCE = 48;

export default function DiscoverFeed() {
  const toast = useToast();
  const isFocused = useIsFocused();
  const { profile } = useProfile();
  const social = useSocial();

  const [activeId, setActiveId] = useState<string | null>(SAMPLE_STORIES[0]?.id ?? null);
  const [seen, setSeen] = useState<ReadonlySet<string>>(() => new Set(['u5']));
  const [refreshing, setRefreshing] = useState(false);

  const authors = useMemo(() => {
    const all = Object.values(AUTHORS);
    return [...all.filter((a) => !seen.has(a.id)), ...all.filter((a) => seen.has(a.id))];
  }, [seen]);

  // FlatList requires this callback identity to stay stable.
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken<Story>[] }) => {
    const first = viewableItems.find((v) => v.isViewable);
    if (first) setActiveId(first.item.id);
  }, []);

  const openStory = useCallback((story: Story) => {
    router.push({ pathname: '/discover/video', params: { storyId: story.id } });
  }, []);

  const openAuthor = useCallback((authorId: string) => {
    router.push({ pathname: '/discover/video/user', params: { authorId } });
  }, []);

  const openAuthorStory = useCallback((author: Author) => {
    setSeen((s) => new Set(s).add(author.id));
    const latest = storiesBy(author.id)[0];
    if (latest) openStory(latest);
    else openAuthor(author.id);
  }, [openStory, openAuthor]);

  const share = useCallback(
    async (story: Story) => {
      try {
        await Share.share({ message: `${story.headline} (${story.location})\n\nShared from BWStory` });
      } catch {
        toast('Couldn’t open the share sheet', 'error');
      }
    },
    [toast],
  );

  const soon = useCallback((what: string) => () => toast(`${what} are coming soon`), [toast]);
  const onComment = useMemo(() => soon('Comments'), [soon]);
  const onReact = useMemo(() => soon('Reactions'), [soon]);
  const onMore = useMemo(() => soon('Post options'), [soon]);

  const likedByFor = useCallback(
    (story: Story) => {
      const others = Object.values(AUTHORS).filter((a) => a.id !== story.authorId);
      return [...others.filter((a) => social.isFollowing(a.id)), ...others.filter((a) => !social.isFollowing(a.id))].slice(0, 3);
    },
    [social],
  );

  const renderItem = useCallback(
    ({ item }: { item: Story }) => (
      <FeedPostCard
        story={item}
        active={isFocused && item.id === activeId}
        liked={social.isLiked(item.id)}
        likedBy={likedByFor(item)}
        onOpen={openStory}
        onOpenAuthor={openAuthor}
        onToggleLike={social.toggleLike}
        onComment={onComment}
        onShare={share}
        onReact={onReact}
        onMore={onMore}
      />
    ),
    [isFocused, activeId, social, likedByFor, openStory, openAuthor, onComment, share, onReact, onMore],
  );

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  };

  return (
    <View style={styles.screen}>
      <FocusStatusBar style="dark" />
      <FeedHeader unreadMessages={3} onActivity={() => toast('Activity is coming soon')} onMessages={() => toast('Messages are coming soon')} />
      <FlatList
        data={SAMPLE_STORIES}
        keyExtractor={(s) => s.id}
        renderItem={renderItem}
        extraData={activeId}
        ListHeaderComponent={
          <StoriesRail
            me={{ name: profile.name, photoUri: profile.photoUri }}
            authors={authors}
            seen={seen}
            onAddStory={() => router.navigate('/create')}
            onOpen={openAuthorStory}
          />
        }
        ItemSeparatorComponent={Separator}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY}
        contentContainerStyle={styles.list}
        initialNumToRender={3}
        windowSize={5}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.brand} colors={[colors.brand]} />}
      />
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { paddingBottom: TAB_BAR_CLEARANCE },
  separator: { height: spacing.xxl },
});
