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
    width: 350,
    height: 350,
    marginBottom: 50,
    marginTop: 85,
  },
  button: {
    backgroundColor: '#4d6a72',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: -100,
    marginBottom: 150,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
  },
});
