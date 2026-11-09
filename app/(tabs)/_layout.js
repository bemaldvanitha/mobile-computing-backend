import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { usePlaces } from '../../context/PlacesContext';
import { colors } from '../../theme/colors';

export default function TabLayout() {
  const { favoriteIds, trips } = usePlaces();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.green },
        headerTintColor: colors.paper,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.line,
        },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
          tabBarBadge: trips.length > 0 ? trips.length : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Shortlist',
          tabBarBadge: favoriteIds.length > 0 ? favoriteIds.length : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
