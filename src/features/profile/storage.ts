import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';

import { DEFAULT_PROFILE, parseStoredProfile, type Profile } from './validation';

/**
 * Profile details are non-sensitive display data, so AsyncStorage is appropriate.
 * (Tokens or credentials would go in expo-secure-store instead.) Android backups are
 * disabled in app.json so none of this leaves the device.
 */
const KEY = 'bwstory.profile.v1';
const PHOTO_DIR = 'profile';

export async function loadProfile(): Promise<Profile> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return DEFAULT_PROFILE;
    const profile = parseStoredProfile(JSON.parse(raw));
    if (profile.photoUri && !new File(profile.photoUri).exists) return { ...profile, photoUri: null };
    return profile;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(profile));
}

/**
 * Picker results live in the cache and can be purged by the OS; copy the photo into the
 * app's private document directory so it survives. Returns the new URI.
 */
export async function persistPhoto(sourceUri: string): Promise<string> {
  const dir = new Directory(Paths.document, PHOTO_DIR);
  dir.create({ idempotent: true, intermediates: true });
  const ext = /\.(png|webp|heic|jpe?g)$/i.exec(sourceUri)?.[0]?.toLowerCase() ?? '.jpg';
  const dest = new File(dir, `avatar-${Date.now()}${ext}`);
  await new File(sourceUri).copy(dest);
  return dest.uri;
}

export function removePhoto(uri: string): void {
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // Already gone; nothing to clean up.
  }
}
