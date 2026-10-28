import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { registerUser } from '../services/authService';

export default function RegisterScreen() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister() {
    try {
      await registerUser(nama.trim(), email.trim(), password);
      Alert.alert('Berhasil', 'Akun dibuat. Silakan login.');
      router.replace('/sign-in');
    } catch (e) {
      Alert.alert('Registrasi gagal', e.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buat Akun</Text>
      <TextInput
        style={styles.input}
        placeholder="Nama"
        value={nama}
        onChangeText={setNama}
      />
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
        placeholder="Password min. 8 karakter"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Daftar" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  title: { fontSize: 28, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#bbb', padding: 12, borderRadius: 8 },
});