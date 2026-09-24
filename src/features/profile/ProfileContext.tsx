import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { loadProfile, removePhoto, saveProfile } from './storage';
import { DEFAULT_PROFILE, sanitizeProfile, type Profile } from './validation';

type ProfileContextValue = {
  profile: Profile;
  loaded: boolean;
  update: (next: Profile) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

/** Saved profile, shared by the Profile screen and the tab bar avatar. */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadProfile().then((p) => {
      if (cancelled) return;
      setProfile(p);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback(
    async (next: Profile) => {
      const clean = sanitizeProfile(next);
      await saveProfile(clean);
      // The old photo file is only removed once the replacement is safely saved.
      if (profile.photoUri && profile.photoUri !== clean.photoUri) removePhoto(profile.photoUri);
      setProfile(clean);
    },
    [profile.photoUri],
  );

  const value = useMemo(() => ({ profile, loaded, update }), [profile, loaded, update]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside <ProfileProvider>');
  return ctx;
}
