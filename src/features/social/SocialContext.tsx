import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { haptics } from '@/lib/haptics';

type SocialState = {
  isFollowing: (authorId: string) => boolean;
  isLiked: (storyId: string) => boolean;
  isSaved: (storyId: string) => boolean;
  followingCount: number;
  toggleFollow: (authorId: string) => void;
  toggleLike: (storyId: string) => void;
  toggleSave: (storyId: string) => void;
};

const SocialContext = createContext<SocialState | null>(null);

function toggled(set: ReadonlySet<string>, id: string): Set<string> {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

/**
 * Follow / like / save state shared by the feed, the full-screen player and creator pages,
 * so a like on one screen is reflected everywhere. Local-only until a backend exists.
 */
export function SocialProvider({ children }: { children: ReactNode }) {
  const [following, setFollowing] = useState<ReadonlySet<string>>(() => new Set(['u2', 'u3']));
  const [liked, setLiked] = useState<ReadonlySet<string>>(() => new Set(['s1']));
  const [saved, setSaved] = useState<ReadonlySet<string>>(() => new Set());

  const toggleFollow = useCallback((id: string) => {
    haptics.tap();
    setFollowing((s) => toggled(s, id));
  }, []);
  const toggleLike = useCallback((id: string) => {
    haptics.tap();
    setLiked((s) => toggled(s, id));
  }, []);
  const toggleSave = useCallback((id: string) => {
    haptics.tap();
    setSaved((s) => toggled(s, id));
  }, []);

  const value = useMemo<SocialState>(
    () => ({
      isFollowing: (id) => following.has(id),
      isLiked: (id) => liked.has(id),
      isSaved: (id) => saved.has(id),
      followingCount: following.size,
      toggleFollow,
      toggleLike,
      toggleSave,
    }),
    [following, liked, saved, toggleFollow, toggleLike, toggleSave],
  );

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
}

export function useSocial(): SocialState {
  const ctx = useContext(SocialContext);
  if (!ctx) throw new Error('useSocial must be used inside <SocialProvider>');
  return ctx;
}
