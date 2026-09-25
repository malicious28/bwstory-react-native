import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { cleanText } from '@/features/profile/validation';
import { colors, fonts, shadow, spacing } from '@/theme';

export const MAX_COMMENT_LENGTH = 300;

type Props = { onSubmit: (text: string) => void };

/** White pill comment composer pinned to the bottom of the player. */
export function CommentBar({ onSubmit }: Props) {
  const [text, setText] = useState('');
  const clean = cleanText(text, true);

  const send = () => {
    if (!clean) return;
    onSubmit(clean);
    setText('');
  };

  return (
    <View style={styles.bar}>
      <Ionicons name="chatbubble-outline" size={20} color={colors.text} />
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Add a comment…"
        placeholderTextColor={colors.textSubtle}
        accessibilityLabel="Add a comment"
        maxLength={MAX_COMMENT_LENGTH}
        returnKeyType="send"
        submitBehavior="blurAndSubmit"
        onSubmitEditing={send}
        selectionColor={colors.brand}
        cursorColor={colors.brand}
        maxFontSizeMultiplier={1.3}
        style={styles.input}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Send comment"
        accessibilityState={{ disabled: !clean }}
        disabled={!clean}
        onPress={send}
        style={({ pressed }) => [styles.send, !clean && styles.sendDisabled, pressed && styles.pressed]}
      >
        <Ionicons name="paper-plane" size={18} color={colors.onBrand} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 54,
    paddingLeft: spacing.lg,
    paddingRight: 6,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    backgroundColor: colors.surface,
    ...shadow.raised,
  },
  input: { flex: 1, height: 54, paddingVertical: 0, fontFamily: fonts.regular, fontSize: 15, color: colors.text },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  sendDisabled: { opacity: 0.45 },
  pressed: { opacity: 0.7 },
});
