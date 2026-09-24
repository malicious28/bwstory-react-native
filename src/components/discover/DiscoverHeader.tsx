import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef } from 'react';
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppHeader, IconButton } from '@/components/ui';
import { MAX_QUERY_LENGTH } from '@/features/discover/useStoryFeed';
import { colors, fonts, radius, spacing } from '@/theme';

type Props = {
  query: string;
  onQueryChange: (text: string) => void;
  filtersOpen: boolean;
  filtersActive: boolean;
  onToggleFilters: () => void;
  onMenu: () => void;
};

export function DiscoverHeader({ query, onQueryChange, filtersOpen, filtersActive, onToggleFilters, onMenu }: Props) {
  const inputRef = useRef<TextInput>(null);

  return (
    <AppHeader
      left={<IconButton icon="menu" size={28} color={colors.onBrand} accessibilityLabel="Open menu" onPress={onMenu} />}
      center={
        <Pressable style={styles.search} onPress={() => inputRef.current?.focus()} accessible={false}>
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={onQueryChange}
            placeholder="Search stories, people, places"
            placeholderTextColor={colors.textSubtle}
            accessibilityLabel="Search stories"
            returnKeyType="search"
            onSubmitEditing={Keyboard.dismiss}
            autoCorrect={false}
            autoCapitalize="none"
            maxLength={MAX_QUERY_LENGTH}
            selectionColor={colors.brand}
            cursorColor={colors.brand}
            maxFontSizeMultiplier={1.3}
            style={styles.input}
          />
          {query ? (
            <IconButton
              icon="close-circle"
              size={20}
              color={colors.textSubtle}
              accessibilityLabel="Clear search"
              onPress={() => onQueryChange('')}
              style={styles.trailing}
            />
          ) : (
            <Ionicons name="search" size={20} color={colors.text} style={styles.searchIcon} />
          )}
        </Pressable>
      }
      right={
        <View>
          <IconButton
            icon="options-outline"
            size={26}
            color={colors.onBrand}
            accessibilityLabel={filtersOpen ? 'Hide categories' : 'Show categories'}
            accessibilityState={{ expanded: filtersOpen }}
            onPress={onToggleFilters}
          />
          {filtersActive ? <View style={styles.dot} pointerEvents="none" /> : null}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  search: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingLeft: spacing.lg,
  },
  input: {
    flex: 1,
    height: 40,
    paddingVertical: 0,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
  searchIcon: { marginHorizontal: spacing.md },
  trailing: { minWidth: 40, minHeight: 40 },
  dot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.brand,
  },
});
