// HomeScreen.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

// Import the logos
import lookFinderLogo from '../assets/lookFinder.png';
import profileLogo from '../assets/profile.png';
import trendsLogo from '../assets/trends.png';
import globalStoreLogo from '../assets/globalStore.png';
import styleFitLogo from '../assets/logo.png';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* StyleFit Logo */}
      <Image source={styleFitLogo} style={styles.styleFitLogo} />

      {/* Greeting Text */}
      <Text style={styles.greetingText}>
        Hello, Fashion Explorer! Let's find your next look
      </Text>

      {/* Logo buttons */}
      <View style={styles.logoContainer}>
        <TouchableOpacity style={styles.logoButton}>
          <Image source={lookFinderLogo} style={styles.logo} />
          <Text style={styles.logoText}>Look Finder</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoButton}>
          <Image source={profileLogo} style={styles.logo} />
          <Text style={styles.logoText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoButton}>
          <Image source={trendsLogo} style={styles.logo} />
          <Text style={styles.logoText}>Trends</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoButton}>
          <Image source={globalStoreLogo} style={styles.logo} />
          <Text style={styles.logoText}>Global Store</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  styleFitLogo: {
    width: 100, // Adjust size as needed
    height: 100,
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  logoButton: {
    alignItems: 'center',
    margin: 10,
  },
  logo: {
    width: 50,
    height: 50, // Adjust based on logo size
  },
  logoText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default HomeScreen;
