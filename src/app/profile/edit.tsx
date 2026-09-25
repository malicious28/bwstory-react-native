import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { router, useNavigation } from 'expo-router';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View, type TextInput } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GenderField } from '@/components/profile/GenderField';
import { ProfileHero } from '@/components/profile/ProfileHero';
import { AppText, FocusStatusBar, GlassButton, TextField, useToast } from '@/components/ui';
import { useProfile } from '@/features/profile/ProfileContext';
import { persistPhoto, removePhoto } from '@/features/profile/storage';
import { useProfileForm } from '@/features/profile/useProfileForm';
import { LIMITS, type Profile, type ProfileField } from '@/features/profile/validation';
import { countWords } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import { colors, radius, shadow, spacing } from '@/theme';

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const HERO = 300;

/** Route: /profile/edit (Update Account). */
export default function EditProfileScreen() {
  const { profile, loaded, update } = useProfile();
  if (!loaded) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator color={colors.onBrand} size="large" />
      </View>
    );
  }
  return <ProfileEditor saved={profile} onSave={update} />;
}

function ProfileEditor({ saved, onSave }: { saved: Profile; onSave: (p: Profile) => Promise<void> }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const toast = useToast();
  const form = useProfileForm(saved);
  const { draft, setField, blurField, errors } = form;

  const [saving, setSaving] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  // Set right before leaving on purpose (after save / discard) so the guard lets it through.
  const leaving = useRef(false);

  const nameRef = useRef<TextInput>(null);
  const professionRef = useRef<TextInput>(null);
  const locationRef = useRef<TextInput>(null);
  const bioRef = useRef<TextInput>(null);
  const refs: Partial<Record<ProfileField, RefObject<TextInput | null>>> = {
    name: nameRef,
    profession: professionRef,
    location: locationRef,
    bio: bioRef,
  };

  const bioWords = countWords(draft.bio);

  /** Drop a picked-but-unsaved photo file so it doesn't linger on disk. */
  const discardDraftPhoto = (keep: string | null) => {
    if (draft.photoUri && draft.photoUri !== saved.photoUri && draft.photoUri !== keep) removePhoto(draft.photoUri);
  };

  // Guard every way out (close button, swipe back, Android back) while there are unsaved edits.
  const dirty = form.dirty;
  const draftPhoto = draft.photoUri;
  useEffect(() => {
    return navigation.addListener('beforeRemove', (e) => {
      if (!dirty || leaving.current) return;
      e.preventDefault();
      Alert.alert('Discard changes?', 'Your edits haven’t been saved.', [
        { text: 'Keep editing', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            if (draftPhoto && draftPhoto !== saved.photoUri) removePhoto(draftPhoto);
            leaving.current = true;
            navigation.dispatch(e.data.action);
          },
        },
      ]);
    });
  }, [navigation, dirty, draftPhoto, saved.photoUri]);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/profile'));

  const pickPhoto = async () => {
    setPhotoBusy(true);
    try {
      // The system photo picker needs no storage permission, so none is requested.
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });
      const asset = result.canceled ? null : result.assets?.[0];
      if (!asset) return;
      if (asset.mimeType && !asset.mimeType.startsWith('image/')) {
        toast('Please choose an image file', 'error');
        return;
      }
      if (asset.fileSize && asset.fileSize > MAX_PHOTO_BYTES) {
        toast('That photo is over 10 MB. Please pick a smaller one.', 'error');
        return;
      }
      const uri = await persistPhoto(asset.uri);
      discardDraftPhoto(uri);
      setField('photoUri', uri);
    } catch {
      toast('Couldn’t load that photo. Please try another.', 'error');
    } finally {
      setPhotoBusy(false);
    }
  };

  const onChangePhoto = () => {
    if (!draft.photoUri) {
      pickPhoto();
      return;
    }
    Alert.alert('Profile photo', undefined, [
      { text: 'Choose a new photo', onPress: pickPhoto },
      {
        text: 'Remove photo',
        style: 'destructive',
        onPress: () => {
          discardDraftPhoto(null);
          setField('photoUri', null);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const save = async () => {
    const result = form.submit();
    if (!result.ok) {
      haptics.warning();
      toast('Please fix the highlighted fields', 'error');
      refs[result.firstError]?.current?.focus();
      return;
    }
    setSaving(true);
    try {
      await onSave(result.profile);
      haptics.success();
      toast('Profile updated', 'success');
      leaving.current = true;
      close();
    } catch {
      toast('Couldn’t save your changes. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <FocusStatusBar style="light" />
      <KeyboardAwareScrollView
        bottomOffset={spacing.xxxl * 3}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHero name={draft.name || '?'} imageUri={draft.photoUri} height={HERO}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={draft.photoUri ? 'Change or remove profile photo' : 'Add a profile photo'}
            accessibilityState={{ busy: photoBusy }}
            disabled={photoBusy}
            onPress={onChangePhoto}
            style={({ pressed }) => [styles.camera, pressed && styles.pressed]}
          >
            {photoBusy ? <ActivityIndicator color={colors.brand} /> : <Ionicons name="camera-outline" size={26} color={colors.brand} />}
          </Pressable>
        </ProfileHero>

        <View style={styles.form}>
          <TextField
            ref={nameRef}
            tone="dark"
            label="Name"
            value={draft.name}
            onChangeText={(t) => setField('name', t)}
            onBlur={() => blurField('name')}
            error={errors.name}
            maxLength={LIMITS.name + 10}
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => professionRef.current?.focus()}
          />
          <GenderField value={draft.gender} onChange={(g) => setField('gender', g)} error={errors.gender} />
          <TextField
            ref={professionRef}
            tone="dark"
            label="Profession"
            placeholder="What do you do?"
            value={draft.profession}
            onChangeText={(t) => setField('profession', t)}
            onBlur={() => blurField('profession')}
            error={errors.profession}
            maxLength={LIMITS.profession + 10}
            autoCapitalize="sentences"
            textContentType="jobTitle"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => locationRef.current?.focus()}
          />
          <TextField
            ref={locationRef}
            tone="dark"
            label="Location"
            placeholder="City or neighbourhood"
            value={draft.location}
            onChangeText={(t) => setField('location', t)}
            onBlur={() => blurField('location')}
            error={errors.location}
            maxLength={LIMITS.location + 10}
            autoCapitalize="words"
            autoComplete="postal-address-locality"
            textContentType="addressCity"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => bioRef.current?.focus()}
          />
          <TextField
            ref={bioRef}
            tone="dark"
            label="Bio"
            placeholder="Tell readers a little about yourself"
            value={draft.bio}
            onChangeText={(t) => setField('bio', t)}
            onBlur={() => blurField('bio')}
            error={errors.bio}
            multiline
            maxLength={LIMITS.bioChars}
            counter={`${bioWords}/${LIMITS.bioWords} words`}
            counterExceeded={bioWords > LIMITS.bioWords}
            autoCapitalize="sentences"
          />
          <View style={styles.privacy}>
            <Ionicons name="lock-closed-outline" size={14} color={colors.nightMuted} />
            <AppText variant="caption" style={{ color: colors.nightMuted }}>
              Your profile is stored only on this device.
            </AppText>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={[styles.topBar, { top: insets.top + spacing.sm }]} pointerEvents="box-none">
        <GlassButton icon="close" iconSize={20} accessibilityLabel="Close without saving" onPress={close} />
        <AppText variant="heading" color="textInverse" accessibilityRole="header" style={styles.title}>
          Edit profile
        </AppText>
        <View style={styles.topSpacer} />
      </View>

      <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }} style={[styles.saveBar, { paddingBottom: insets.bottom + spacing.md }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !form.dirty || saving, busy: saving }}
          accessibilityHint={form.dirty ? 'Saves your profile changes' : 'No changes to save yet'}
          disabled={!form.dirty || saving}
          onPress={save}
          style={({ pressed }) => [styles.saveBtn, (!form.dirty || saving) && styles.saveDisabled, pressed && styles.pressed]}
        >
          {saving ? (
            <ActivityIndicator color={colors.brand} />
          ) : (
            <AppText variant="heading" style={{ color: colors.brand }}>
              {form.dirty ? 'Update account' : 'No changes yet'}
            </AppText>
          )}
        </Pressable>
      </KeyboardStickyView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.night },
  center: { alignItems: 'center', justifyContent: 'center' },
  camera: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.lg,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.onBrand,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.raised,
  },
  form: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.xl },
  privacy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  topBar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { textShadowColor: 'rgba(0,0,0,0.45)', textShadowRadius: 8, textShadowOffset: { width: 0, height: 1 } },
  topSpacer: { width: 44 },
  saveBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.night,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.nightBorder,
  },
  saveBtn: {
    height: 56,
    borderRadius: radius.xl,
    backgroundColor: colors.onBrand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveDisabled: { opacity: 0.5 },
  pressed: { opacity: 0.75 },
});
