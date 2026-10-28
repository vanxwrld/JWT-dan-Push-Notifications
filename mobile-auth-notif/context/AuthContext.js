import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getMe, loginUser } from '../services/authService';
import { hapusPushToken } from '../services/notificationService';

const AuthContext = createContext(null);
const TOKEN_KEY = 'access_token';
const PUSH_TOKEN_KEY = 'expo_push_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const saved = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!saved) return;

      const me = await getMe(saved);
      setToken(saved);
      setUser(me);
    } catch (e) {
      if (e.status === 401 || e.status === 404) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password) {
    const data = await loginUser(email, password);
    await SecureStore.setItemAsync(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function signOut() {
    try {
      const pushToken = await SecureStore.getItemAsync(PUSH_TOKEN_KEY);
      if (pushToken && token) await hapusPushToken(token, pushToken);
    } catch (e) {
      console.warn('Gagal melepas push token:', e.message);
    }
    await SecureStore.deleteItemAsync(PUSH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}