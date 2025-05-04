import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, ScrollView, ActivityIndicator, Alert
} from 'react-native';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnterPress = async () => {
    if (email.trim() === '') {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://10.0.2.2:8000/send-reset-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert('Success', 'OTP sent to your email.');
        navigation.navigate('EnterOTP', { email }); // pass email to next screen
      } else {
        Alert.alert('Error', data.error || 'Failed to send OTP');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

        <View style={styles.headerBox}>
          <Text style={styles.headerText}>FORGOT PASSWORD?</Text>
        </View>

        <Text style={styles.instruction}>
          Please enter your email address and we will send you an OTP to change your password.
        </Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.button} onPress={handleEnterPress} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>ENTER</Text>
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
