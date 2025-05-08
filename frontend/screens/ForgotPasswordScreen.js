import React, { useState } from 'react';
import config from '../config';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useFonts } from 'expo-font';

export default function ForgotPasswordScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    'Montserrat-Bold': require('../assets/Montserrat-Bold.ttf'),
  });

  if (!fontsLoaded) return null;
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Email is required.');
      return;
    }
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/forgot_password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', data.message);
        navigation.navigate('EnterOTP', { email }); // Navigate to OTPScreen with email
      } else {
        Alert.alert('Error', data.error || 'Something went wrong.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>

        {/* Logo */}
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

        {/* Header */}
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>FORGOT PASSWORD?</Text>
        </View>

        {/* Instruction */}
        <Text style={styles.instruction}>
          Please enter your email address and receive an OTP to change your password
        </Text>

        {/* Email Input */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
          <Text style={styles.buttonText}>ENTER</Text>
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
    paddingTop: 60,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 50,
    marginTop: -80,
  },
  headerBox: {
    backgroundColor: '#4d6a72',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 30,
    marginTop: -30,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 50,
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  instruction: {
    fontSize: 16,
    color: '#333',
    marginBottom: 40,
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginRight: 20,
  },
  input: {
    width: '80%',
    backgroundColor: '#e8e8e8',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4d6a72',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
  },
});
