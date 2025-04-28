import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure Expo Vector Icons is installed

export default function UpdatePasswordScreen({ navigation }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdatePassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
    } else if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
    } else {
      Alert.alert('Success', 'Password updated successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>

        {/* Logo */}
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

        {/* Heading */}
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>UPDATE PASSWORD</Text>
        </View>

        {/* Instruction Text */}
        <Text style={styles.instruction}>
          Please enter your new password below to reset your account password.
        </Text>

        {/* New Password Input */}
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

        {/* Confirm Password Input */}
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

        {/* Update Button */}
        <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
          <Text style={styles.buttonText}>UPDATE</Text>
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
