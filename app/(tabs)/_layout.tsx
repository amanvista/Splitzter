import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View, ViewToken } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Import screens
import DiscoverScreen from './discover/discover';
import MenuScreen from './menu/menu';
import OrdersScreen from './orders/orders';
import ReportsScreen from './reports/reports';
import TablesScreen from './tables/tables';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SCREENS = [
  { key: 'tables', component: TablesScreen, title: 'Tables' },
  { key: 'discover', component: DiscoverScreen, title: 'Discover' },
  { key: 'menu', component: MenuScreen, title: 'Menu' },
  { key: 'orders', component: OrdersScreen, title: 'Orders' },
  { key: 'reports', component: ReportsScreen, title: 'Reports' },
];

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderScreen = ({ item }: { item: typeof SCREENS[0] }) => {
    const ScreenComponent = item.component;
    return (
      <View style={styles.screenContainer}>
        <ScreenComponent />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SCREENS}
        renderItem={renderScreen}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="center"
        disableIntervalMomentum
      />
      
      {/* Page Indicator */}
      <View style={[styles.indicatorContainer, { backgroundColor: Colors[colorScheme ?? 'light'].surface }]}>
        {SCREENS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor: index === activeIndex 
                  ? Colors[colorScheme ?? 'light'].primary 
                  : Colors[colorScheme ?? 'light'].border,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 'auto',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
