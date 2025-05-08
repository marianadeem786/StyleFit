import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function SuggestMatchingScreen() {
  const navigation = useNavigation();

  const handleUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      // Later you'll send imageUri to AI to detect & suggest match
      alert('Image uploaded! (matching logic coming soon)');
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

      {/* Title Box */}
      <View style={styles.headerBox}>
        <Text style={styles.headerText}>SUGGEST MATCHING</Text>
      </View>

      {/* Description */}
      <Text style={styles.description}>
        Let us suggest the perfect match for your style.{"\n"}Upload an image of a top or bottom, and we’ll find a stylish match for it!
      </Text>

      {/* Upload Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.uploadButtonText}>UPLOAD</Text>
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
  description: {
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
    color: '#333',
    marginBottom: 30,
    marginHorizontal: 10,
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
    color: 'white',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
});
