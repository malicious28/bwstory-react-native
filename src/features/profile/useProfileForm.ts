import { useCallback, useMemo, useState } from 'react';

import {
  sanitizeProfile,
  validateProfile,
  type Profile,
  type ProfileErrors,
  type ProfileField,
} from './validation';

const FIELD_ORDER: ProfileField[] = ['name', 'gender', 'location', 'profession', 'bio'];

type SubmitResult = { ok: true; profile: Profile } | { ok: false; firstError: ProfileField };

/**
 * Draft state for the edit form. Errors are derived, and only shown for a field once
 * it has been left (blurred) or the user has tried to save — no nagging mid-typing.
 */
export function useProfileForm(saved: Profile) {
  const [draft, setDraft] = useState<Profile>(saved);
  const [touched, setTouched] = useState<Partial<Record<ProfileField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validateProfile(draft), [draft]);

  const dirty = useMemo(
    () => (Object.keys(saved) as (keyof Profile)[]).some((k) => draft[k] !== saved[k]),
    [draft, saved],
  );

  const visibleErrors: ProfileErrors = useMemo(() => {
    const out: ProfileErrors = {};
    FIELD_ORDER.forEach((f) => {
      if ((touched[f] || submitted) && errors[f]) out[f] = errors[f];
    });
    return out;
  }, [errors, touched, submitted]);

  const setField = useCallback(<K extends keyof Profile>(key: K, value: Profile[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
  }, []);

  const blurField = useCallback((field: ProfileField) => {
    setTouched((t) => (t[field] ? t : { ...t, [field]: true }));
  }, []);

  const submit = useCallback((): SubmitResult => {
    setSubmitted(true);
    const firstError = FIELD_ORDER.find((f) => errors[f]);
    if (firstError) return { ok: false, firstError };
    const clean = sanitizeProfile(draft);
    setDraft(clean);
    return { ok: true, profile: clean };
  }, [draft, errors]);

  const reset = useCallback((to: Profile) => {
    setDraft(to);
    setTouched({});
    setSubmitted(false);
  }, []);

  return { draft, setField, blurField, errors: visibleErrors, hasErrors: Object.keys(errors).length > 0, dirty, submit, reset };
}
