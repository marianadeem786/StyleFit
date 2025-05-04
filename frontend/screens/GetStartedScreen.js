import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { supabase } from '../lib/supabase'; // Make sure this is the path to your supabase client

export default function GetStartedScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Montserrat-Bold': require('../assets/Montserrat-Bold.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    // Check if the user is logged in
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.log('Error checking user status:', error);
      setLoading(false);
      return;
    }

    if (user) {
      // User is logged in, redirect to the main screen (LandingScreen or HomeScreen)
      navigation.navigate('LandingScreen'); // Or HomeScreen, depending on your app flow
    } else {
      // User is not logged in, stay on GetStartedScreen or navigate to login/signup screen
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#50808E" />
      </View>
    );
  }

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
        onPress={() => navigation.navigate('LandingScreen')} // <-- adjust target screen
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
    width: 400,
    height: 400,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#50808E',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: -60,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
  },
});
