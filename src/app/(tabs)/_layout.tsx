import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import type { ComponentProps } from 'react';
import { StyleSheet, View, type ColorValue } from 'react-native';

import { ProfileTabIcon } from '@/components/profile/ProfileTabIcon';
import { colors } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, color, focused }: { name: IconName; color: ColorValue; focused: boolean }) {
  return (
    <View style={styles.iconWrap}>
      <Ionicons name={name} size={26} color={color} />
      <View style={[styles.indicator, focused && styles.indicatorActive]} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => <TabIcon name="compass-outline" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          title: 'Nearby',
          tabBarIcon: ({ color, focused }) => <TabIcon name="location-outline" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create story',
          tabBarIcon: ({ color, focused }) => <TabIcon name="add-circle-outline" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, focused }) => <TabIcon name="notifications-outline" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <ProfileTabIcon focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
  },
  iconWrap: { alignItems: 'center', gap: 4, paddingTop: 6 },
  indicator: { width: 22, height: 3, borderRadius: 2, backgroundColor: 'transparent' },
  indicatorActive: { backgroundColor: colors.brand },
});
