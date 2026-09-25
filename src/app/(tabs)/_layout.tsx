import { Tabs } from 'expo-router/js-tabs';

import { SocialTabBar } from '@/components/navigation/SocialTabBar';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="discover"
      tabBar={(props) => <SocialTabBar {...props} />}
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
    >
      <Tabs.Screen name="discover" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="create" options={{ title: 'Create' }} />
      <Tabs.Screen name="stories" options={{ title: 'Stories' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
