import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getMe } from '../../services/authService';

export default function ProfileScreen() {
  const { token, signOut } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getMe(token)
      .then(setProfile)
      .catch((e) => {
        if (e.status === 401) signOut();
        else console.error(e);
      });
  }, [token]);

  if (!profile) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text>Nama: {profile.nama}</Text>
      <Text>Email: {profile.email}</Text>
      <Text>ID: {profile.id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 10 },
});