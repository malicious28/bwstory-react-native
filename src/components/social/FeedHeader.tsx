import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, IconButton } from '@/components/ui';
import { colors, spacing } from '@/theme';

import { Wordmark } from './Wordmark';

type Props = { unreadMessages: number; onActivity: () => void; onMessages: () => void };

export function FeedHeader({ unreadMessages, onActivity, onMessages }: Props) {
  const { top } = useSafeAreaInsets();
  const badge = unreadMessages > 9 ? '9+' : String(unreadMessages);
  return (
    <View style={[styles.bar, { paddingTop: top + spacing.xs }]}>
      <Wordmark />
      <View style={styles.actions}>
        <IconButton icon="heart-outline" size={26} accessibilityLabel="Activity" onPress={onActivity} />
        <View>
          <IconButton
            icon="chatbubble-ellipses-outline"
            size={26}
            accessibilityLabel={unreadMessages ? `Messages, ${unreadMessages} unread` : 'Messages'}
            onPress={onMessages}
          />
          {unreadMessages > 0 ? (
            <View style={styles.badge} pointerEvents="none">
              <AppText variant="micro" color="textInverse" allowFontScaling={false}>
                {badge}
              </AppText>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing.xl,
    paddingRight: spacing.sm,
    paddingBottom: spacing.xs,
    backgroundColor: colors.surface,
  },
  actions: { flexDirection: 'row', alignItems: 'center' },
  badge: {
    position: 'absolute',
    top: 4,
    right: 3,
    minWidth: 19,
    height: 19,
    paddingHorizontal: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.surface,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
