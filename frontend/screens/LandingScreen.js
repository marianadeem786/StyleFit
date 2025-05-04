import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

export default function LandingScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.log("Error getting session:", sessionError.message);
        setLoading(false);
        return;
      }

      if (session && session.user) {
        setUserEmail(session.user.email);

        // Optional: Get full user info
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.log("Error fetching user data:", userError.message);
        } else {
          console.log("User data:", userData.user);
        }

        navigation.replace('Profile'); // Redirect if logged in
      }

      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4d6a72" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Greeting */}
      {userEmail && (
        <Text style={styles.slogan}>Welcome back, {userEmail}!</Text>
      )}

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.buttonText}>SIGN UP</Text>
      </TouchableOpacity>

      {/* Log In Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>LOG IN</Text>
      </TouchableOpacity>

      {/* Footer Text */}
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
