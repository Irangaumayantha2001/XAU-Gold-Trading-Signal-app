import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import { auth } from '../config/firebase';

interface LoginScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export default function LoginScreen({
  navigation,
}: LoginScreenProps): React.JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [fullName, setFullName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (!isLogin && !fullName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Firebase login
        const userCredential =
          await signInWithEmailAndPassword(
            auth,
            email.trim(),
            password
          );

        console.log('Logged in:', userCredential.user.uid);

        Alert.alert('Success', 'Login successful');

        // Navigate after login
        navigation.navigate('Home');
      } else {
        // Firebase registration
        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            email.trim(),
            password
          );

        // Save full name to Firebase user profile
        await updateProfile(userCredential.user, {
          displayName: fullName.trim(),
        });

        console.log('Registered:', userCredential.user.uid);

        Alert.alert('Success', 'Account created successfully');

        // Navigate after registration
        navigation.navigate('Home');
      }
    } catch (error: any) {
      console.log('Firebase Auth Error:', error);

      let message = 'Something went wrong';

      switch (error.code) {
        case 'auth/invalid-email':
          message = 'Please enter a valid email address.';
          break;

        case 'auth/user-not-found':
          message = 'No account found with this email.';
          break;

        case 'auth/wrong-password':
          message = 'Incorrect password.';
          break;

        case 'auth/invalid-credential':
          message = 'Incorrect email or password.';
          break;

        case 'auth/email-already-in-use':
          message = 'An account already exists with this email.';
          break;

        case 'auth/weak-password':
          message = 'Password should be at least 6 characters.';
          break;

        case 'auth/network-request-failed':
          message = 'Network error. Please check your internet connection.';
          break;

        default:
          message = error.message || 'Authentication failed.';
      }

      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>
          📈 XAU Signals
        </Text>

        <Text style={styles.subtitle}>
          {isLogin
            ? 'Welcome Back'
            : 'Create Account'}
        </Text>

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#787b86"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            autoCorrect={false}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#787b86"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#787b86"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin
                ? 'Sign In'
                : 'Sign Up'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchBtn}
          onPress={() => setIsLogin((prev) => !prev)}
          disabled={loading}
        >
          <Text style={styles.switchText}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Sign In'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131722',
  },

  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  logo: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },

  input: {
    backgroundColor: '#1e222d',
    color: '#d1d4dc',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2B2B43',
  },

  button: {
    backgroundColor: '#2962FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  switchBtn: {
    marginTop: 20,
    alignItems: 'center',
  },

  switchText: {
    color: '#787b86',
    fontSize: 14,
  },
});