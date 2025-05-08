import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { profile } = route.params || {};

  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [imageUri, setImageUri] = useState(profile?.profile_picture || null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const sessionId = await AsyncStorage.getItem('session_id');
    if (!sessionId) {
      alert('Session ID not found.');
      setLoading(false);
      return;
    }

    let nameUpdated = false;
    let passwordUpdated = false;

    try {
      // --- Update name if changed ---
      const nameChanged =
        firstName !== profile?.first_name || lastName !== profile?.last_name;

      if (nameChanged) {
        const nameRes = await fetch(`${config.BACKEND_URL}/api/update_profile_name/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: sessionId,
            first_name: firstName,
            last_name: lastName,
          }),
        });
        const nameData = await nameRes.json();
        if (nameRes.ok) {
          nameUpdated = true;
        } else {
          alert(nameData.error || 'Failed to update name.');
        }
      }

      // --- Change password if fields are filled ---
      if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
          alert('Please fill all password fields to change password.');
          setLoading(false);
          return;
        }

        if (newPassword !== confirmPassword) {
          alert('New passwords do not match.');
          setLoading(false);
          return;
        }

        const passRes = await fetch(`${config.BACKEND_URL}/api/change_password_view/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: sessionId,
            old_password: currentPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        });

        const passData = await passRes.json();
        console.log('Password change response:', passData);

        if (passRes.status === 200 && passData.message === 'Password changed successfully') {
          passwordUpdated = true;
        } else {
          alert(passData.error || 'Failed to change password.');
          setLoading(false);
          return;
        }
      }

      // Final combined feedback
      if (nameUpdated && passwordUpdated) {
        alert('Name and password updated successfully.');
      } else if (nameUpdated) {
        alert('Name updated successfully.');
      } else if (passwordUpdated) {
        alert('Password updated successfully.');
      }

    } catch (error) {
      console.error('Update failed:', error);
      alert('An error occurred. Please try again later.');
    }

    setLoading(false);
    navigation.goBack();
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

      {/* Title */}
      <View style={styles.headerBox}>
        <Text style={styles.headerText}>EDIT PROFILE</Text>
      </View>

      {/* Profile Picture */}
<View style={{ alignItems: 'center', marginBottom: 10 }}>
  <TouchableOpacity onPress={pickImage}>
    <Image
      source={imageUri ? { uri: imageUri } : require('../assets/pp.png')}
      style={styles.profileImage}
    />
  </TouchableOpacity>
  <Text style={styles.photoText}>Tap image to change</Text>
</View>


      {/* First Name */}
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
        placeholderTextColor="#888"
      />

      {/* Last Name */}
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
        placeholderTextColor="#888"
      />

      {/* Current Password */}
      <Text style={styles.label}>Current Password</Text>
      <TextInput
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Enter current password"
        secureTextEntry
      />

      {/* New Password */}
      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Enter new password"
        secureTextEntry
      />

      {/* Confirm Password */}
      <Text style={styles.label}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm new password"
        secureTextEntry
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Saving...' : 'SAVE CHANGES'}
        </Text>
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
    marginBottom: 5,
  },
  photoText: {
    fontSize: 12,
    color: '#4d6a72',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#4d6a72',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'center',
    alignItems: 'center',
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
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
});
