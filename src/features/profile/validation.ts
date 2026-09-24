import { countWords } from '@/lib/format';

export const GENDERS = ['Female', 'Male', 'Non-binary', 'Prefer not to say'] as const;
export type Gender = (typeof GENDERS)[number];

export type Profile = {
  name: string;
  gender: Gender;
  location: string;
  profession: string;
  bio: string;
  /** Local file URI inside the app's document directory, or null. */
  photoUri: string | null;
};

export type ProfileField = Exclude<keyof Profile, 'photoUri'>;
export type ProfileErrors = Partial<Record<ProfileField, string>>;

export const LIMITS = {
  nameMin: 2,
  name: 50,
  location: 60,
  profession: 50,
  bioWords: 120,
  bioChars: 800,
} as const;

export const DEFAULT_PROFILE: Profile = {
  name: 'Rashmi Desai',
  gender: 'Female',
  location: 'Greater Noida',
  profession: 'Teacher',
  bio: 'School teacher in Greater Noida. I share short stories about education, local events and the people who make our neighbourhood special.',
  photoUri: null,
};

// Control characters, zero-width characters and bidi overrides: invisible, and usable to spoof text.
const INVISIBLE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁠-⁤⁦-⁩﻿]/g;
const NAME_FORBIDDEN = /[0-9<>{}[\]@#$%^&*=+_|\\~`"!?;:/]/;
const TEXT_FORBIDDEN = /[<>{}[\]\\`|^~]/;

/** Strip invisible characters; single-line fields also collapse whitespace. */
export function cleanText(value: string, multiline = false): string {
  const stripped = value.replace(INVISIBLE, '');
  return multiline
    ? stripped.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
    : stripped.replace(/\s+/g, ' ').trim();
}

export function sanitizeProfile(p: Profile): Profile {
  return {
    name: cleanText(p.name),
    gender: p.gender,
    location: cleanText(p.location),
    profession: cleanText(p.profession),
    bio: cleanText(p.bio, true),
    photoUri: p.photoUri,
  };
}

export function validateField(field: ProfileField, raw: string): string | undefined {
  const value = cleanText(raw, field === 'bio');
  switch (field) {
    case 'name':
      if (!value) return 'Please enter your name.';
      if (value.length < LIMITS.nameMin) return `Name must be at least ${LIMITS.nameMin} characters.`;
      if (value.length > LIMITS.name) return `Name can be up to ${LIMITS.name} characters.`;
      if (NAME_FORBIDDEN.test(value)) return 'Use letters, spaces, apostrophes, dots or hyphens only.';
      return undefined;
    case 'location':
      if (value.length > LIMITS.location) return `Location can be up to ${LIMITS.location} characters.`;
      if (TEXT_FORBIDDEN.test(value)) return 'Location contains characters that aren’t allowed.';
      return undefined;
    case 'profession':
      if (value.length > LIMITS.profession) return `Profession can be up to ${LIMITS.profession} characters.`;
      if (TEXT_FORBIDDEN.test(value)) return 'Profession contains characters that aren’t allowed.';
      return undefined;
    case 'bio':
      if (countWords(value) > LIMITS.bioWords) return `Keep your bio to ${LIMITS.bioWords} words or fewer.`;
      if (value.length > LIMITS.bioChars) return `Bio can be up to ${LIMITS.bioChars} characters.`;
      if (TEXT_FORBIDDEN.test(value)) return 'Bio contains characters that aren’t allowed.';
      return undefined;
    case 'gender':
      return (GENDERS as readonly string[]).includes(value) ? undefined : 'Please choose an option.';
  }
}

export function validateProfile(p: Profile): ProfileErrors {
  const errors: ProfileErrors = {};
  (['name', 'gender', 'location', 'profession', 'bio'] as const).forEach((f) => {
    const e = validateField(f, p[f]);
    if (e) errors[f] = e;
  });
  return errors;
}

const LOCAL_URI = /^(file|content):\/\//;

/**
 * Parse untrusted stored JSON back into a Profile. Anything malformed falls back to
 * defaults field-by-field rather than crashing the screen.
 */
export function parseStoredProfile(raw: unknown): Profile {
  if (typeof raw !== 'object' || raw === null) return DEFAULT_PROFILE;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown, fallback: string, max: number) =>
    typeof v === 'string' && v.length <= max ? v : fallback;

  const candidate: Profile = sanitizeProfile({
    name: str(r.name, DEFAULT_PROFILE.name, LIMITS.name * 2),
    gender: (GENDERS as readonly unknown[]).includes(r.gender) ? (r.gender as Gender) : DEFAULT_PROFILE.gender,
    location: str(r.location, DEFAULT_PROFILE.location, LIMITS.location * 2),
    profession: str(r.profession, DEFAULT_PROFILE.profession, LIMITS.profession * 2),
    bio: str(r.bio, DEFAULT_PROFILE.bio, LIMITS.bioChars * 2),
    photoUri: typeof r.photoUri === 'string' && LOCAL_URI.test(r.photoUri) ? r.photoUri : null,
  });
  const errors = validateProfile(candidate);
  (Object.keys(errors) as ProfileField[]).forEach((f) => {
    (candidate as Record<ProfileField, string>)[f] = DEFAULT_PROFILE[f];
  });
  return candidate;
}
