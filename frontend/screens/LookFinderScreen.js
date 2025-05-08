import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function LookFinderScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Enable gallery access to use this feature');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      // You can trigger backend search logic here
    }
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
      <View style={styles.titleContainer}>
        <Text style={styles.title}>LOOK FINDER</Text>
      </View>

      {/* Description */}
      <Text style={styles.description}>
        Found something you love? Upload an image and we'll help you find exact or similar styles!
      </Text>

      {/* Upload Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
        <Text style={styles.uploadButtonText}>UPLOAD</Text>
      </TouchableOpacity>

      {/* Preview if selected */}
      {selectedImage && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Your Upload:</Text>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          {/* Later: show matching items below */}
        </View>
      )}
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
  titleContainer: {
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
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
  },
  description: {
    fontSize: 24,
    color: '#4d6a72',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 30,
    marginTop: 23,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#4d6a72',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
  previewContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 16,
    color: '#4d6a72',
    marginBottom: 10,
    fontFamily: 'Montserrat-Medium',
  },
  previewImage: {
    width: 250,
    height: 300,
    borderRadius: 15,
    resizeMode: 'cover',
  },
});
