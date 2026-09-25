import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

type Props = { size?: number; outline?: string };

/** Brand-navy check badge; announced once by the parent label, so hidden here. */
export function VerifiedBadge({ size = 16, outline }: Props) {
  const ring = outline ? 2 : 0;
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.badge,
        {
          width: size + ring * 2,
          height: size + ring * 2,
          borderRadius: (size + ring * 2) / 2,
          borderWidth: ring,
          borderColor: outline ?? 'transparent',
        },
      ]}
    >
      <Ionicons name="checkmark" size={size * 0.7} color={colors.onBrand} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
});
