import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      await signIn(email.trim(), password);
    } catch (e) {
      Alert.alert('Login gagal', e.message);
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Masuk</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title={loading ? 'Memproses...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />
      <Link href="/register" style={styles.link}>
        Belum punya akun? Daftar
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  title: { fontSize: 28, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#bbb', padding: 12, borderRadius: 8 },
  link: { marginTop: 16, textAlign: 'center' },
});