import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, type Ref } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fonts, radius, spacing } from '@/theme';

import { AppText } from './AppText';

type Props = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string | null;
  /** Shown bottom-right, e.g. "42/120 words". */
  counter?: string;
  counterExceeded?: boolean;
  /** 'dark' for fields on the night surfaces (profile pages). */
  tone?: 'light' | 'dark';
  ref?: Ref<TextInput>;
};

const PALETTE = {
  light: {
    label: colors.textMuted,
    text: colors.text,
    placeholder: colors.textSubtle,
    bg: colors.field,
    bgFocus: colors.surface,
    border: 'transparent',
    borderFocus: colors.brand,
    cursor: colors.brand,
    error: colors.danger,
    errorBg: colors.dangerSoft,
    counter: colors.textSubtle,
  },
  dark: {
    label: colors.nightMuted,
    text: colors.onBrand,
    placeholder: colors.nightMuted,
    bg: colors.nightField,
    bgFocus: 'rgba(255,255,255,0.12)',
    border: colors.nightBorder,
    borderFocus: colors.onBrand,
    cursor: colors.onBrand,
    error: colors.nightDanger,
    errorBg: 'rgba(255,180,171,0.08)',
    counter: colors.nightMuted,
  },
} as const;

/**
 * Labelled input with inline error below the field (announced politely to screen readers).
 */
export function TextField({
  label,
  error,
  counter,
  counterExceeded,
  multiline,
  tone = 'light',
  onFocus,
  onBlur,
  ref,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);
  const hasError = !!error;
  const p = PALETTE[tone];

  return (
    <View style={styles.wrap}>
      <AppText variant="label" style={{ color: p.label }}>
        {label}
      </AppText>
      <View
        style={[
          styles.box,
          { backgroundColor: focused ? p.bgFocus : p.bg, borderColor: focused ? p.borderFocus : p.border },
          hasError && { borderColor: p.error, backgroundColor: p.errorBg },
        ]}
      >
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          accessibilityHint={hasError ? error : undefined}
          placeholderTextColor={p.placeholder}
          selectionColor={p.cursor}
          cursorColor={p.cursor}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          maxFontSizeMultiplier={1.4}
          style={[styles.input, { color: p.text }, multiline && styles.inputMultiline]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {counter ? (
          <AppText variant="caption" style={[styles.counter, { color: counterExceeded ? p.error : p.counter }]}>
            {counter}
          </AppText>
        ) : null}
      </View>
      {hasError ? (
        <View style={styles.errorRow} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={16} color={p.error} />
          <AppText variant="caption" style={[styles.errorText, { color: p.error }]}>
            {error}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  box: { borderRadius: radius.md, borderWidth: 1.5 },
  input: {
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  inputMultiline: {
    minHeight: 128,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    lineHeight: 23,
  },
  counter: { position: 'absolute', right: spacing.md, bottom: spacing.sm },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  errorText: { flexShrink: 1 },
});
