import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function LandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      
      {/* Logo */}
      <Image 
        source={require('../assets/logo.png')} // Replace with your logo file
        style={styles.logo}
        resizeMode="contain"
      />

     

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.buttonText}>SIGN UP</Text>
      </TouchableOpacity>

      {/* Log In Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>LOG IN</Text>
      </TouchableOpacity>

      {/* Already have an account */}
      <Text style={styles.footerText}>Already have an account?</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f5d9', // light pastel background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: 10,
  },
  slogan: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
    fontFamily: 'sans-serif-medium',
  },
  button: {
    backgroundColor: '#4d6a72', // blueish button color
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    letterSpacing: 1,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 20,
    color: '#333',
    fontSize: 14,
  },
});
