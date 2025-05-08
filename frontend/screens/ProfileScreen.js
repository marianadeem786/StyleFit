import React from 'react';
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

export default function ProfileScreen({ profile }) {
  const navigation = useNavigation();

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
            // 🔒 Placeholder for backend logout and navigation
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

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
  <TouchableOpacity>
    <Image
      source={
        profile?.profile_picture
          ? { uri: profile.profile_picture }
          : require('../assets/pp.png')
      }
      style={styles.profileImage}
    />
  </TouchableOpacity>
</View>


      {/* First Name */}
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        editable={false}
        value={profile?.first_name || ''}
        placeholder="First Name"
        placeholderTextColor="#888"
      />

      {/* Last Name */}
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        editable={false}
        value={profile?.last_name || ''}
        placeholder="Last Name"
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
