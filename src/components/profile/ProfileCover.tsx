import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui';
import { colors, shadow, spacing } from '@/theme';

type Props = {
  name: string;
  photoUri: string | null;
  busy: boolean;
  onChangePhoto: () => void;
};

const HEIGHT = 220;
const CAMERA = 60;

/** Full-bleed profile photo with a floating camera button, as in the reference app. */
export function ProfileCover({ name, photoUri, busy, onChangePhoto }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.cover}>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={200}
            accessibilityLabel="Your profile photo"
          />
        ) : (
          <View style={styles.placeholder}>
            <Avatar name={name || '?'} size={104} />
          </View>
        )}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={photoUri ? 'Change or remove profile photo' : 'Add a profile photo'}
        accessibilityState={{ busy }}
        disabled={busy}
        onPress={onChangePhoto}
        style={({ pressed }) => [styles.camera, pressed && styles.pressed]}
      >
        {busy ? <ActivityIndicator color={colors.brand} /> : <Ionicons name="camera-outline" size={28} color={colors.text} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: CAMERA / 2 - spacing.sm },
  cover: { height: HEIGHT, backgroundColor: colors.brandSoft, overflow: 'hidden' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  camera: {
    position: 'absolute',
    right: spacing.xxl,
    bottom: -CAMERA / 2,
    width: CAMERA,
    height: CAMERA,
    borderRadius: CAMERA / 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.raised,
  },
  pressed: { transform: [{ scale: 0.96 }] },
});
