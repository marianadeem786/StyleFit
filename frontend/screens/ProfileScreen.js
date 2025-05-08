import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage to get session_id
import config from '../config';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const sessionId = await AsyncStorage.getItem('session_id');
      if (!sessionId) {
        Alert.alert('Error', 'No session found.');
        return;
      }

      try {
        const res = await fetch(`${config.BACKEND_URL}/api/show_profile/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId }),
        });

        const data = await res.json();
        setLoading(false);

        if (res.ok) {
          setProfile(data); // Set the profile data from the response
        } else {
          Alert.alert('Error', data.error || 'Failed to fetch profile');
        }
      } catch (error) {
        setLoading(false);
        Alert.alert('Error', 'Failed to load profile. Please try again later.');
      }
    };

    fetchProfile();
  }, []);

  const goHome = () => {
    navigation.navigate('Home');
  };

  const goBack = () => {
    navigation.goBack();
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            AsyncStorage.removeItem('session_id'); // Clear session data
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return <Text>Loading...</Text>; // You can add a loading spinner here
  }

  return (
    <View style={styles.container}>
          {/* NAVBAR */}
          <View style={styles.navbar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={require('../assets/backicon.png')} style={styles.navIcon} />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Image source={require('../assets/homeicon.png')} style={styles.navIcon} />
            </TouchableOpacity>
          </View>
    

      {/* Header Title */}
      <View style={styles.headerBox}>
        <Text style={styles.headerText}>PROFILE</Text>
      </View>

      {/* Profile Image */}
      <TouchableOpacity>
        <Image
          source={
            profile?.picture
              ? { uri: profile.picture }
              : require('../assets/pp.png')
          }
          style={styles.profileImage}
        />
      </TouchableOpacity>

      {/* First Name */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        editable={false}
        value={profile?.name || ''}
        placeholder="Full Name"
        placeholderTextColor="#888"
      />


      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        editable={false}
        value={profile?.email || ''}
        placeholder="Email"
        placeholderTextColor="#888"
      />

      {/* Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EditProfile', { profile })}
      >
        <Text style={styles.buttonText}>EDIT PROFILE</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Wardrobe')}
      >
        <Text style={styles.buttonText}>WARDROBE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    padding: 16,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  navIcon: {
    width: 28,
    height: 28,
    tintColor: '#4d6a72',
  },
  headerBox: {
    backgroundColor: '#4d6a72',
    alignSelf: 'flex-start',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  input: {
    width: '100%',
    backgroundColor: '#e8e8e8',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4d6a72',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 15,
    alignSelf: 'center',
    alignItems: 'center',
  },
  
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
});