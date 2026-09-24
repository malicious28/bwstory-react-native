/**
 * Media hosts the app is allowed to stream from. Anything else (including plain http)
 * is refused so a bad record can't point the player at an arbitrary server.
 */
const ALLOWED_MEDIA_HOSTS = new Set(['test-videos.co.uk', 'picsum.photos', 'fastly.picsum.photos']);

// Parsed by hand: React Native's URL polyfill doesn't implement every getter on all versions.
const HTTPS_URL = /^https:\/\/([a-z0-9.-]+)(?::\d{1,5})?(?:[/?#]|$)/i;

export function isSafeMediaUrl(value: string | null | undefined): value is string {
  if (!value || value.length > 2048) return false;
  const host = HTTPS_URL.exec(value)?.[1]?.toLowerCase();
  return host != null && ALLOWED_MEDIA_HOSTS.has(host);
}
