import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleEnterPress = () => {
    if (email.trim() !== '') {
      navigation.navigate('EnterOTP');
    } else {
      alert('Please enter your email address.');
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

        {/* Instruction Text */}
        <Text style={styles.instruction}>
          Please enter your email address and we will send you an OTP to change your password.
        </Text>

        {/* Email Input */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Enter Button */}
        <TouchableOpacity style={styles.button} onPress={handleEnterPress}>
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
    paddingTop: 50,
    paddingBottom: 50,
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: 10,
  },
  headerBox: {
    backgroundColor: '#4d6a72',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  instruction: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginRight: 20,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 20,
  },
  input: {
    width: '85%',
    backgroundColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
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
