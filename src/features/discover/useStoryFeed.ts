import { useCallback, useDeferredValue, useMemo, useState } from 'react';

import { SAMPLE_STORIES } from '@/data/stories';
import type { Category, Story } from '@/data/types';

export const MAX_QUERY_LENGTH = 80;

function toggleIn(set: ReadonlySet<string>, id: string): Set<string> {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

function matches(story: Story, needle: string): boolean {
  return (
    story.headline.toLowerCase().includes(needle) ||
    story.author.name.toLowerCase().includes(needle) ||
    story.location.toLowerCase().includes(needle)
  );
}

/**
 * Feed state for Discover: search, category filter, follow/like toggles and pull-to-refresh.
 * Local-only for now; swap `SAMPLE_STORIES` for an API call when a backend exists.
 */
export function useStoryFeed() {
  const [query, setQueryRaw] = useState('');
  const [category, setCategory] = useState<Category>('All');
  const [following, setFollowing] = useState<ReadonlySet<string>>(() => new Set(['u2']));
  const [liked, setLiked] = useState<ReadonlySet<string>>(() => new Set(['s1']));
  const [refreshing, setRefreshing] = useState(false);

  // Keeps typing responsive while the list re-filters.
  const deferredQuery = useDeferredValue(query);

  const stories = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    return SAMPLE_STORIES.filter(
      (s) => (category === 'All' || s.category === category) && (!needle || matches(s, needle)),
    );
  }, [deferredQuery, category]);

  const setQuery = useCallback((text: string) => setQueryRaw(text.slice(0, MAX_QUERY_LENGTH)), []);
  const toggleFollow = useCallback((authorId: string) => setFollowing((s) => toggleIn(s, authorId)), []);
  const toggleLike = useCallback((storyId: string) => setLiked((s) => toggleIn(s, storyId)), []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const clearFilters = useCallback(() => {
    setQueryRaw('');
    setCategory('All');
  }, []);

  return {
    stories,
    query,
    setQuery,
    category,
    setCategory,
    following,
    toggleFollow,
    liked,
    toggleLike,
    refreshing,
    refresh,
    clearFilters,
  };
}
