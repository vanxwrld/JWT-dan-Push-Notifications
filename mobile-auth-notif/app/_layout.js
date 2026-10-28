import { useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';

SplashScreen.preventAutoHideAsync();

function Navigator() {
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync();
  }, [loading]);

  if (loading) return null;

  return (
    <Stack>
      <Stack.Protected guard={!token}>
        <Stack.Screen name="sign-in" options={{ title: 'Login' }} />
        <Stack.Screen name="register" options={{ title: 'Daftar' }} />
      </Stack.Protected>

      <Stack.Protected guard={!!token}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Navigator />
    </AuthProvider>
  );
}