import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import config from '../config'; 


export default function GetStartedScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Montserrat-Bold': require('../assets/Montserrat-Bold.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#50808E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      {/* Sign Up Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SignUp')} // Navigate to SignUpScreen
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.button, styles.loginButton]} // Added different style for distinction
        onPress={() => navigation.navigate('Login')} // Navigate to LoginScreen
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5DC',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f5d9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: -100,
    marginTop: -30,
  },
  slogan: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
    fontFamily: 'sans-serif-medium',
  },
  button: {
    backgroundColor: '#4d6a72',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '40%',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: -40,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
  },
  footerText: {
    color: '#333',
    fontSize: 16,
    marginTop: 50,
  },
});
