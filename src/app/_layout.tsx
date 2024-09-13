// Import  global CSS file
import '../../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import TrackPlayer from 'react-native-track-player';

import { APIProvider } from '@/api';
import { playbackService } from '@/constants/playback-service';
import { hydrateAuth, loadSelectedTheme } from '@/core';
import { useThemeConfig } from '@/core/use-theme-config';
import { useInitializePlayer } from '@/hooks/use-track-player';
export { ErrorBoundary } from 'expo-router';

try {
  TrackPlayer.registerPlaybackService(() => playbackService);
  console.log('TrackPlayer registered');
} catch (error) {
  console.log(error);
}

export const unstable_settings = {
  initialRouteName: '(app)',
};

hydrateAuth();
loadSelectedTheme();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const queryClient = React.useMemo(() => new QueryClient(), []);
  useInitializePlayer();
  return (
    <Providers>
      <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="song/[id]" options={{ headerShown: false }} />
      </Stack>
      </QueryClientProvider>
    </Providers>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();
  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? `dark` : undefined}
    >
      <KeyboardProvider>
        <ThemeProvider value={theme}>
          <APIProvider>
            <BottomSheetModalProvider>
              {children}
              <FlashMessage position="top" />
            </BottomSheetModalProvider>
          </APIProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
