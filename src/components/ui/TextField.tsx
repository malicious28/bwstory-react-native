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
  ref?: Ref<TextInput>;
};

/**
 * Labelled input with inline error below the field (announced politely to screen readers).
 */
export function TextField({ label, error, counter, counterExceeded, multiline, onFocus, onBlur, ref, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const hasError = !!error;

  return (
    <View style={styles.wrap}>
      <AppText variant="label" color="textMuted" nativeID={`${label}-label`}>
        {label}
      </AppText>
      <View
        style={[
          styles.box,
          multiline && styles.boxMultiline,
          focused && styles.boxFocused,
          hasError && styles.boxError,
        ]}
      >
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          accessibilityLabelledBy={`${label}-label`}
          accessibilityHint={hasError ? error : undefined}
          placeholderTextColor={colors.textSubtle}
          selectionColor={colors.brand}
          cursorColor={colors.brand}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          maxFontSizeMultiplier={1.4}
          style={[styles.input, multiline && styles.inputMultiline]}
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
          <AppText variant="caption" color={counterExceeded ? 'danger' : 'textSubtle'} style={styles.counter}>
            {counter}
          </AppText>
        ) : null}
      </View>
      {hasError ? (
        <View style={styles.errorRow} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={16} color={colors.danger} />
          <AppText variant="caption" color="danger" style={styles.errorText}>
            {error}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  box: {
    backgroundColor: colors.field,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  boxMultiline: { backgroundColor: colors.surface, borderColor: colors.border },
  boxFocused: { borderColor: colors.brand, backgroundColor: colors.surface },
  boxError: { borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  input: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
  inputMultiline: {
    minHeight: 120,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    lineHeight: 23,
  },
  counter: { position: 'absolute', right: spacing.md, bottom: spacing.sm },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  errorText: { flexShrink: 1 },
});
