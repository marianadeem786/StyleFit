import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Button,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen({ route, navigation }) {
  const {
    email,
    imageUri,
    setImageUri,
    handleUploadProfilePicture,
    handleRemoveProfilePicture,
    firstName,
    lastName,
    setFirstName,
    setLastName,
    handleUpdateProfileName,
    password,
    newPassword,
    confirmNewPassword,
    setPassword,
    setNewPassword,
    setConfirmNewPassword,
    handleChangePassword,
  } = route.params;

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      {/* Profile Picture Section */}
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={imageUri ? { uri: imageUri } : require('../assets/profilepic.png')}
          style={styles.profileImage}
        />
        <Text style={styles.changePicText}>Tap to choose picture</Text>
      </TouchableOpacity>

      <Button title="Upload Picture" onPress={handleUploadProfilePicture} />
      <Button title="Remove Profile Picture" onPress={handleRemoveProfilePicture} />

      {/* Update Name Section */}
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <Button title="Update Name" onPress={handleUpdateProfileName} />

      {/* Change Password Section */}
      <Text style={styles.label}>Old Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Old Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        secureTextEntry
      />
      <Button title="Change Password" onPress={handleChangePassword} />

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
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
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
    fontSize: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginTop: 5,
  },
  cancelButton: {
    marginTop: 30,
    alignSelf: 'center',
  },
  cancelText: {
    color: '#555',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
