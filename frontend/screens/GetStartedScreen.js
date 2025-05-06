import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import config from '../config';


export default function GetStartedScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  // Memoized function for loading fonts
  const loadFonts = useCallback(async () => {
    await Font.loadAsync({
      'Montserrat-Bold': require('../assets/Montserrat-Bold.ttf'),
    });
    setFontsLoaded(true);
  }, []);

  useEffect(() => {
    loadFonts();
  }, [loadFonts]);

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
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LandingScreen')} // Ensure LandingScreen is registered
      >
        <Text style={styles.buttonText}>Get Started</Text>
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
    backgroundColor: '#F5F5DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 300, // Reduced size for faster loading
    height: 300, // Reduced size for faster loading
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#50808E',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: -40, // Adjusted margin for better layout
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
  },
});
