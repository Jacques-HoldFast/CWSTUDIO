import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';



import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });


  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      console.log("USERTORKEN ", token)
      setIsLoggedIn(!!token);
      console.log("login ", isLoggedIn)
    };

    checkLoginStatus();
  }, []);

  // ⛔ Don’t run early return *before* hooks
  if (!loaded || isLoggedIn === null) {
    return null; // Can be replaced with splash screen
  }


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

      <Stack>
        {isLoggedIn ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="login" options={{ headerShown: false }} />
        )}

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
