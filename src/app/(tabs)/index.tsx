import { useIsFocused } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, Share, StyleSheet, View, type ViewToken } from 'react-native';

import { CategoryTabs } from '@/components/discover/CategoryTabs';
import { DiscoverHeader } from '@/components/discover/DiscoverHeader';
import { StoryCard } from '@/components/discover/StoryCard';
import { EmptyState, useToast } from '@/components/ui';
import type { Story } from '@/data/types';
import { useStoryFeed } from '@/features/discover/useStoryFeed';
import { haptics } from '@/lib/haptics';
import { colors, spacing } from '@/theme';

const VIEWABILITY = { itemVisiblePercentThreshold: 60, minimumViewTime: 150 };

export default function DiscoverScreen() {
  const feed = useStoryFeed();
  const toast = useToast();
  const isFocused = useIsFocused();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Autoplay whichever card is most visible; FlatList requires this callback to be stable.
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken<Story>[] }) => {
    const first = viewableItems.find((v) => v.isViewable);
    setActiveId(first ? first.item.id : null);
  }, []);

  const { toggleFollow: toggleFollowRaw, toggleLike: toggleLikeRaw } = feed;

  const toggleFollow = useCallback(
    (authorId: string) => {
      haptics.tap();
      toggleFollowRaw(authorId);
    },
    [toggleFollowRaw],
  );

  const toggleLike = useCallback(
    (storyId: string) => {
      haptics.tap();
      toggleLikeRaw(storyId);
    },
    [toggleLikeRaw],
  );

  const share = useCallback(
    async (story: Story) => {
      try {
        await Share.share({ message: `${story.headline} — ${story.location}\n\nShared from BWStory` });
      } catch {
        toast('Couldn’t open the share sheet', 'error');
      }
    },
    [toast],
  );

  const comment = useCallback(() => toast('Comments are coming soon'), [toast]);

  const renderItem = useCallback(
    ({ item }: { item: Story }) => (
      <StoryCard
        story={item}
        active={item.id === activeId}
        allowPlayback={isFocused}
        following={feed.following.has(item.author.id)}
        liked={feed.liked.has(item.id)}
        onActivate={setActiveId}
        onToggleFollow={toggleFollow}
        onToggleLike={toggleLike}
        onShare={share}
        onComment={comment}
      />
    ),
    [activeId, isFocused, feed.following, feed.liked, toggleFollow, toggleLike, share, comment],
  );

  const filtersActive = feed.category !== 'All';

  return (
    <View style={styles.screen}>
      <DiscoverHeader
        query={feed.query}
        onQueryChange={feed.setQuery}
        filtersOpen={filtersOpen}
        filtersActive={filtersActive}
        onToggleFilters={() => setFiltersOpen((o) => !o)}
        onMenu={() => toast('Menu is coming soon')}
      />
      {filtersOpen ? <CategoryTabs value={feed.category} onChange={feed.setCategory} /> : null}

      <FlatList
        data={feed.stories}
        keyExtractor={(s) => s.id}
        renderItem={renderItem}
        extraData={activeId}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY}
        contentContainerStyle={[styles.list, feed.stories.length === 0 && styles.listEmpty]}
        ItemSeparatorComponent={Separator}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        initialNumToRender={3}
        windowSize={5}
        removeClippedSubviews
        refreshControl={
          <RefreshControl refreshing={feed.refreshing} onRefresh={feed.refresh} tintColor={colors.brand} colors={[colors.brand]} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="search"
            title="No stories found"
            message={feed.query ? `Nothing matches “${feed.query.trim()}”. Try another word or category.` : 'There are no stories in this category yet.'}
            actionLabel="Clear filters"
            onAction={feed.clearFilters}
          />
        }
      />
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { paddingTop: spacing.sm, paddingBottom: spacing.xxxl },
  listEmpty: { flexGrow: 1, justifyContent: 'center' },
  separator: { height: spacing.xl },
});
