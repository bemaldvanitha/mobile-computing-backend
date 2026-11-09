import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PlacesProvider } from '../context/PlacesContext';
import { colors } from '../theme/colors';

export default function RootLayout() {
  return (
    <PlacesProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.green },
          headerTintColor: colors.paper,
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="place/[id]" options={{ title: 'Trail details' }} />
      </Stack>
    </PlacesProvider>
  );
}
