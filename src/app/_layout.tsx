import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import {
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
  Figtree_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/figtree';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastProvider } from '@/components/ui';
import { ProfileProvider } from '@/features/profile/ProfileContext';
import { SocialProvider } from '@/features/social/SocialContext';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
    Figtree_800ExtraBold,
    DMSerifDisplay_400Regular,
  });
  const ready = fontsLoaded || fontError != null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // Keep the splash visible until fonts are ready so text never flashes in a fallback face.
  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <ProfileProvider>
          <SocialProvider>
            <ToastProvider>
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                  name="discover/video/index"
                  options={{ animation: 'fade_from_bottom', contentStyle: { backgroundColor: colors.night } }}
                />
                <Stack.Screen
                  name="discover/video/user"
                  options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.night } }}
                />
                <Stack.Screen
                  name="profile/edit"
                  options={{ animation: 'slide_from_bottom', contentStyle: { backgroundColor: colors.night } }}
                />
              </Stack>
            </ToastProvider>
          </SocialProvider>
        </ProfileProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
