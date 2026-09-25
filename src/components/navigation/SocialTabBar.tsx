import Ionicons from '@expo/vector-icons/Ionicons';
import type { Tabs } from 'expo-router/js-tabs';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Avatar, type IoniconName } from '@/components/ui';
import { useProfile } from '@/features/profile/ProfileContext';
import { colors, shadow, spacing } from '@/theme';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const ICONS: Record<string, { on: IoniconName; off: IoniconName; label: string }> = {
  discover: { on: 'home', off: 'home-outline', label: 'Home' },
  search: { on: 'search', off: 'search-outline', label: 'Search' },
  stories: { on: 'play-circle', off: 'play-circle-outline', label: 'Stories' },
};

const CREATE_SIZE = 66;

/** White rounded tab bar with a raised brand "Create" button in the middle. */
export function SocialTabBar({ state, navigation, descriptors }: TabBarProps) {
  const { bottom } = useSafeAreaInsets();
  const { profile } = useProfile();

  const go = (routeKey: string, routeName: string, focused: boolean) => {
    const event = navigation.emit({ type: 'tabPress', target: routeKey, canPreventDefault: true });
    if (!focused && !event.defaultPrevented) navigation.navigate(routeName);
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(bottom, spacing.sm) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key]!;
        const color = focused ? colors.brand : colors.textSubtle;

        if (route.name === 'create') {
          return (
            <View key={route.key} style={styles.slot}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Create a story"
                onPress={() => go(route.key, route.name, focused)}
                style={({ pressed }) => [styles.create, pressed && styles.pressed]}
              >
                <Ionicons name="add" size={32} color={colors.onBrand} />
              </Pressable>
            </View>
          );
        }

        const meta = ICONS[route.name];
        const label = meta?.label ?? (typeof options.title === 'string' ? options.title : route.name);
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            onPress={() => go(route.key, route.name, focused)}
            style={({ pressed }) => [styles.slot, pressed && styles.pressed]}
          >
            {route.name === 'profile' ? (
              <View style={[styles.avatarRing, focused && { borderColor: colors.brand }]}>
                <Avatar name={profile.name} uri={profile.photoUri} size={26} />
              </View>
            ) : (
              <Ionicons name={focused ? meta!.on : meta!.off} size={25} color={color} />
            )}
            <AppText variant="micro" allowFontScaling={false} style={{ color }}>
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    ...shadow.card,
    shadowOffset: { width: 0, height: -4 },
  },
  slot: { flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center', gap: 3 },
  create: {
    width: CREATE_SIZE,
    height: CREATE_SIZE,
    marginTop: -CREATE_SIZE / 2 - 4,
    borderRadius: CREATE_SIZE / 2,
    borderWidth: 5,
    borderColor: colors.surface,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.raised,
  },
  avatarRing: { padding: 1.5, borderRadius: 16, borderWidth: 1.5, borderColor: 'transparent' },
  pressed: { opacity: 0.7 },
});
