import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import config from '../config';

export default function LookFinderScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [results, setResults] = useState(null);

  // Async function to fetch session ID from AsyncStorage
  const getSessionId = async () => {
    try {
      const sessionId = await AsyncStorage.getItem('session_id'); // Assuming session ID is saved as 'session_id'
      return sessionId;
    } catch (error) {
      console.error('Failed to fetch session ID:', error);
      return null;
    }
  };

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
      fetchSimilarProducts(result.assets[0].uri);
    }
  };

  const fetchSimilarProducts = async (imageUri) => {
    const sessionId = await getSessionId(); // Get session ID asynchronously
    if (!sessionId) {
      Alert.alert('Error', 'Session ID not found.');
      return;
    }

    const formData = new FormData();
    formData.append('session_id', sessionId); // Use session ID
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg', // Adjust depending on the file type
      name: 'upload.jpg',
    });

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/find_similar_view/`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json(); // Parse JSON response

      if (response.ok) {
        console.log('Backend response:', data); // Log data for debugging
        if (data.results && data.results.length > 0) {
          setResults(data.results); // Update state with the search results
        } else {
          Alert.alert('No results found', 'No similar products were found.');
        }
      } else {
        Alert.alert('Error', data.error || 'Something went wrong.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while searching.');
    }
  };

  const openURL = (url) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        </View>
      )}

      {/* Show search results */}
      {results && results.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsLabel}>Similar Products:</Text>
          {results.map((item, index) => (
            <View key={index} style={styles.resultCard}>
              {item.images && item.images[0] && (
                <Image source={{ uri: item.images[0] }} style={styles.resultImage} />
              )}
              <Text style={styles.resultProductName}>{item.name}</Text>
              <TouchableOpacity onPress={() => openURL(item.url)}>
                <Text style={styles.resultPrice}>{item.url}</Text> {/* This is now clickable */}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  resultsContainer: {
    marginTop: 20,
  },
  resultsLabel: {
    fontSize: 18,
    color: '#4d6a72',
    fontFamily: 'Montserrat-Medium',
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  resultImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  resultProductName: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#333',
    marginTop: 10,
  },
  resultPrice: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#4d6a72',
    marginTop: 5,
    textDecorationLine: 'underline', // Make the URL look like a clickable link
  },
});
