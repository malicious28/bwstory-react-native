import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useRef, useState, type RefObject } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View, type TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { GenderField } from '@/components/profile/GenderField';
import { ProfileCover } from '@/components/profile/ProfileCover';
import { AppHeader, AppText, Button, IconButton, TextField, useToast } from '@/components/ui';
import { useProfile } from '@/features/profile/ProfileContext';
import { persistPhoto, removePhoto } from '@/features/profile/storage';
import { useProfileForm } from '@/features/profile/useProfileForm';
import { LIMITS, type Profile, type ProfileField } from '@/features/profile/validation';
import { countWords } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import { colors, spacing } from '@/theme';

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export default function ProfileScreen() {
  const { profile, loaded, update } = useProfile();

  if (!loaded) {
    return (
      <View style={styles.screen}>
        <AppHeader />
        <View style={styles.loading}>
          <ActivityIndicator color={colors.brand} size="large" />
        </View>
      </View>
    );
  }
  return <ProfileEditor saved={profile} onSave={update} />;
}

function ProfileEditor({ saved, onSave }: { saved: Profile; onSave: (p: Profile) => Promise<void> }) {
  const toast = useToast();
  const form = useProfileForm(saved);
  const { draft, setField, blurField, errors } = form;

  const [saving, setSaving] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);

  const nameRef = useRef<TextInput>(null);
  const locationRef = useRef<TextInput>(null);
  const professionRef = useRef<TextInput>(null);
  const bioRef = useRef<TextInput>(null);
  const refs: Partial<Record<ProfileField, RefObject<TextInput | null>>> = {
    name: nameRef,
    location: locationRef,
    profession: professionRef,
    bio: bioRef,
  };

  const bioWords = countWords(draft.bio);

  /** Drop a picked-but-unsaved photo file so it doesn't linger on disk. */
  const discardDraftPhoto = (keep: string | null) => {
    if (draft.photoUri && draft.photoUri !== saved.photoUri && draft.photoUri !== keep) removePhoto(draft.photoUri);
  };

  const pickPhoto = async () => {
    setPhotoBusy(true);
    try {
      // The system photo picker needs no storage permission, so none is requested.
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
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
    } catch {
      toast('Couldn’t save your changes. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    const leave = () => (router.canGoBack() ? router.back() : router.navigate('/'));
    if (!form.dirty) {
      leave();
      return;
    }
    Alert.alert('Discard changes?', 'Your edits haven’t been saved.', [
      { text: 'Keep editing', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          discardDraftPhoto(null);
          form.reset(saved);
          leave();
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <AppHeader
        left={<IconButton icon="chevron-back" size={26} color={colors.onBrand} accessibilityLabel="Go back" onPress={goBack} />}
        center={
          <AppText variant="heading" color="textInverse" accessibilityRole="header" style={styles.srOnly}>
            Edit profile
          </AppText>
        }
        right={
          <Button
            label="Update Account"
            variant="onBrand"
            loading={saving}
            disabled={!form.dirty}
            onPress={save}
            accessibilityHint={form.dirty ? 'Saves your profile changes' : 'No changes to save yet'}
          />
        }
      />

      <KeyboardAwareScrollView
        bottomOffset={spacing.xxxl}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <ProfileCover name={draft.name} photoUri={draft.photoUri} busy={photoBusy} onChangePhoto={onChangePhoto} />

        <View style={styles.form}>
          <TextField
            ref={nameRef}
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
            onSubmitEditing={() => locationRef.current?.focus()}
          />

          <GenderField value={draft.gender} onChange={(g) => setField('gender', g)} error={errors.gender} />

          <TextField
            ref={locationRef}
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
            onSubmitEditing={() => professionRef.current?.focus()}
          />

          <TextField
            ref={professionRef}
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
            onSubmitEditing={() => bioRef.current?.focus()}
          />

          <TextField
            ref={bioRef}
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

          <Button label="Save changes" loading={saving} disabled={!form.dirty} onPress={save} style={styles.saveBottom} />

          <View style={styles.privacy}>
            <Ionicons name="lock-closed-outline" size={14} color={colors.textSubtle} />
            <AppText variant="caption" color="textSubtle" style={styles.privacyText}>
              Your profile is stored only on this device.
            </AppText>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingBottom: spacing.xxxl },
  form: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, gap: spacing.xl },
  saveBottom: { marginTop: spacing.sm },
  privacy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  privacyText: { textAlign: 'center' },
  // Reference layout has no visible title; keep one for screen readers.
  srOnly: { position: 'absolute', width: 1, height: 1, opacity: 0 },
});
