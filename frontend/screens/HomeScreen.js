import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { supabase } from '../lib/supabase';

export default function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    'Montserrat-Bold': require('../assets/Montserrat-Bold.ttf'),
  });

  const [username, setUsername] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log('User fetch error', userError);
      return;
    }

    const { data, error: profileError } = await supabase
      .from('users')
      .select('username')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.log('Profile fetch error', profileError.message);
    } else {
      setUsername(data.username);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <Text style={styles.welcomeText}>
        {username ? `Hello, ${username}!` : 'Hello, Fashion Explorer!'}
      </Text>
      <Text style={styles.subText}>Let's find your next look</Text>

      <View style={styles.iconRow}>
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => navigation.navigate('LookFinder')}
        >
          <Image source={require('../assets/lookFinder.png')} style={styles.icon} />
          <Text style={styles.iconLabel}>Look Finder</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image source={require('../assets/profile.png')} style={styles.icon} />
          <Text style={styles.iconLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.iconRow}>
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => navigation.navigate('Trends')}
        >
          <Image source={require('../assets/trends.png')} style={styles.icon} />
          <Text style={styles.iconLabel}>Trends</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => navigation.navigate('GlobalStore')}
        >
          <Image source={require('../assets/globalStore.png')} style={styles.icon} />
          <Text style={styles.iconLabel}>Global Store</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    alignItems: 'center',
    paddingTop: 60,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 50,
    marginTop: -80,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#333',
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#4d6a72',
    marginBottom: 30,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 30,
    marginTop: 30,
  },
  iconWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  iconLabel: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: '#333',
  },
});
