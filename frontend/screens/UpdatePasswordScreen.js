import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function UpdatePasswordScreen({ navigation, route }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Assume you passed email via route.params from ForgotPassword or OTP screen
  const email = route?.params?.email;

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
    } else if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
    } else {
      setLoading(true);
      try {
        const response = await fetch('http://10.0.2.2:8000/update-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            new_password: newPassword,
          }),
        });

        const data = await response.json();
        setLoading(false);

        if (response.ok) {
          Alert.alert('Success', 'Password updated successfully!', [
            { text: 'OK', onPress: () => navigation.navigate('Login') },
          ]);
        } else {
          Alert.alert('Error', data.error || 'Could not update password');
        }
      } catch (error) {
        setLoading(false);
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>UPDATE PASSWORD</Text>
        </View>
        <Text style={styles.instruction}>
          Please enter your new password below to reset your account password.
        </Text>

        <Text style={styles.label}>New Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor="#888"
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
            <Ionicons name={showNewPassword ? 'eye-off' : 'eye'} size={24} color="#555" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor="#888"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
            <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="#555" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdatePassword} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>UPDATE</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f7f5d9',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: 10,
  },
  headingContainer: {
    backgroundColor: '#4d6a72',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  heading: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'left',
    lineHeight: 28,
  },
  instruction: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    paddingRight: 40, // space for the eye icon
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  button: {
    backgroundColor: '#4d6a72',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
