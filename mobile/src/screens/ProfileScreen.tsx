import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen(): React.JSX.Element {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Logged in as</Text>

        <Text style={styles.email}>
          {user?.email || 'Trader'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={logout}
      >
        <Text style={styles.logoutText}>
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131722',
    padding: 16,
  },

  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#1e222d',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },

  label: {
    color: '#787b86',
    fontSize: 14,
    marginBottom: 4,
  },

  email: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  logoutBtn: {
    backgroundColor: '#ef5350',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});