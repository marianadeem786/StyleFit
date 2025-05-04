import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';

export default function EnterOTPScreen({ route, navigation }) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const email = route.params?.email;

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  const handleSend = async () => {
    const enteredOtp = otp.join('');

    try {
      const response = await fetch('http://10.0.2.2:8000/verify-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });
      

      const data = await response.json();
      if (response.status === 200) {
        Alert.alert('Verified!', 'OTP is correct.');
        navigation.navigate('UpdatePassword');
      } else {
        Alert.alert('Invalid OTP', data.error || 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error.');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />

        <View style={styles.headerBox}>
          <Text style={styles.headerText}>ENTER OTP</Text>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="numeric"
              value={value}
              onChangeText={(text) => handleOtpChange(text, index)}
            />
          ))}
        </View>

        <TouchableOpacity onPress={() => {/* implement resend OTP */}}>
          <Text style={styles.resendText}>Resend OTP?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>SEND</Text>
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
    resizeMode: 'contain',
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
    marginBottom: 30,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    backgroundColor: '#e8e8e8',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resendText: {
    color: '#333',
    fontSize: 14,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4d6a72',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
