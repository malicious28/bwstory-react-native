import Ionicons from '@expo/vector-icons/Ionicons';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, shadow, spacing } from '@/theme';

import { AppText } from './AppText';

type Tone = 'success' | 'info' | 'error';
type ToastState = { id: number; message: string; tone: Tone } | null;
type ShowToast = (message: string, tone?: Tone) => void;

const ToastContext = createContext<ShowToast>(() => {});

const ICON = { success: 'checkmark-circle', info: 'information-circle', error: 'alert-circle' } as const;
const DURATION_MS = 2600;

/** Lightweight snackbar that sits above the tab bar. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null);
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => opacity.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { bottom } = useSafeAreaInsets();

  const show = useCallback<ShowToast>((message, tone = 'info') => {
    setToast({ id: Date.now(), message, tone });
    AccessibilityInfo.announceForAccessibility(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setToast(null));
    }, DURATION_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [toast, opacity]);

  const value = useMemo(() => show, [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <View pointerEvents="none" style={[styles.host, { bottom: bottom + 76 }]}>
          <Animated.View
            style={[
              styles.toast,
              {
                opacity,
                transform: [{ translateY }],
              },
            ]}
          >
            <Ionicons
              name={ICON[toast.tone]}
              size={20}
              color={toast.tone === 'error' ? '#FF8A80' : toast.tone === 'success' ? '#7EE2B8' : colors.onBrand}
            />
            <AppText variant="label" color="textInverse" style={styles.text}>
              {toast.message}
            </AppText>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ShowToast {
  return useContext(ToastContext);
}

const styles = StyleSheet.create({
  host: { position: 'absolute', left: 0, right: 0,alignItems: 'center', paddingHorizontal: spacing.lg },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    maxWidth: 480,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.text,
    ...shadow.raised,
  },
  text: { flexShrink: 1 },
});
