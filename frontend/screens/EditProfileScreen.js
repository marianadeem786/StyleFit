import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { supabase } from '../lib/supabase'; // Ensure this is the path to your Supabase client

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(require('../assets/profilepic.png')); // Replace with default image
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const getUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.log('Error fetching user:', error);
        return;
      }
      setUser(user);
      setName(user?.user_metadata?.full_name || '');
    };

    getUserData();
  }, []);

  const handleSave = async () => {
    if (!name || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      // Call Supabase API to update user profile
      const updates = {
        full_name: name,
        password: password,
      };

      // Update profile info in Supabase
      const { error } = await supabase.auth.updateUser(updates);

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Profile updated successfully.');
      navigation.goBack(); // Go back to previous screen after successful update
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong, please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      {/* Profile Picture */}
      <TouchableOpacity onPress={() => Alert.alert('Change Picture', 'Image picker not implemented.')}>
        <Image source={profilePic} style={styles.profilePic} />
        <Text style={styles.changePicText}>Change Picture</Text>
      </TouchableOpacity>

      {/* Name Input */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      {/* Password Input */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      {/* Cancel */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f5d9',
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#333',
  },
  changePicText: {
    marginTop: 8,
    color: '#4d6a72',
    fontSize: 14,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  label: {
    marginTop: 20,
    alignSelf: 'flex-start',
    marginLeft: 50,
    fontSize: 16,
    color: '#333',
  },
  input: {
    width: '80%',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#4d6a72',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelText: {
    color: '#555',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
