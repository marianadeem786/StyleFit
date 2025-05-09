import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

export default function WardrobeScreen({ navigation }) {
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('wardrobe');
  const [showAddModal, setShowAddModal] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const getSessionId = async () => {
    try {
      const id = await AsyncStorage.getItem('session_id');
      setSessionId(id);
    } catch (error) {
      console.error('Session error:', error);
    }
  };

  useEffect(() => {
    getSessionId();
  }, []);

  useEffect(() => {
    if (sessionId) fetchWardrobe();
  }, [sessionId]);

  const fetchWardrobe = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/view_wardrobe_items/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });
      const data = await response.json();
      if (response.ok) {
        const items = data.items || [];
        // Optional: Adjust image URL as per backend's response
        const adjustedItems = items.map((item) => ({
          ...item,
          image_url: item.image_url.startsWith('https://')
            ? item.image_url
            : `https://storage.supabase.com/wardrobe1/${item.image_url}`,
        }));
        setWardrobeItems(adjustedItems);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch wardrobe.');
      }
    } catch (error) {
      Alert.alert('Error', 'Error loading wardrobe.');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (imageUri, type) => {
    if (!sessionId) return;
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('type', type);
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/upload_wardrobe_item/`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        fetchWardrobe();
      } else {
        Alert.alert('Error', data.error || 'Upload failed.');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not upload image.');
    }
  };

  const pickImage = async (type) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission denied', 'Enable access to continue');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) uploadImage(result.assets[0].uri, type);
  };

  const removeItem = async (id) => {
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/remove_wardrobe_item_view/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, item_id: id }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchWardrobe();
      } else {
        Alert.alert('Error', data.error || 'Could not delete item.');
      }
    } catch (err) {
      Alert.alert('Error', 'Deletion failed.');
    }
  };

  const handleImagePress = (id) => {
    if (removeMode) {
      Alert.alert('Delete Item', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => removeItem(id), style: 'destructive' },
      ]);
    }
  };

  const generateOutfits = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/view_wardrobe_items/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });
      const data = await response.json();
      if (response.ok) setOutfits(data.outfits || []);
      else Alert.alert('Error', data.error || 'No outfits found.');
    } catch (err) {
      Alert.alert('Error', 'Failed to load outfits.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/recommend_wardrobe_view/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });
      const data = await response.json();
      if (response.ok) setRecommendations(data.suggestions || []);
      else Alert.alert('Error', data.error || 'No recommendations found.');
    } catch (err) {
      Alert.alert('Error', 'Failed to load recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const renderWardrobe = () => wardrobeItems.map((item) => (
    <TouchableOpacity key={item.id} onPress={() => handleImagePress(item.id)}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
    </TouchableOpacity>
  ));

  const renderOutfits = () => outfits.map((outfit, index) => (
    <View key={index} style={styles.outfitRow}>
      <Image source={{ uri: outfit.top.images[0] }} style={styles.image} />
      <Image source={{ uri: outfit.bottom.images[0] }} style={styles.image} />
    </View>
  ));

  const renderRecommendations = () => recommendations.map((item, index) => (
    <Image key={index} source={{ uri: item.images[0] }} style={styles.image} />
  ));

  return (
    <View style={styles.container}>
      {/* NAVBAR */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/backicon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>WARDROBE</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/homeicon.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>

      {/* MODE SWITCH */}
      <View style={styles.modeSwitch}>
        <TouchableOpacity onPress={() => setMode('wardrobe')} style={styles.modeButton}>
          <Text>Wardrobe</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setMode('outfits'); generateOutfits(); }} style={styles.modeButton}>
          <Text>Outfits</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setMode('recommend'); fetchRecommendations(); }} style={styles.modeButton}>
          <Text>Recommend</Text>
        </TouchableOpacity>
      </View>

      {/* ACTIONS */}
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.actionItem}>
          <Image source={require('../assets/add.png')} style={styles.actionIcon} />
          <Text style={styles.actionLabel}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRemoveMode(!removeMode)} style={styles.actionItem}>
          <Image source={require('../assets/remove.png')} style={styles.actionIcon} />
          <Text style={styles.actionLabel}>{removeMode ? 'Done' : 'Remove'}</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      {loading && <ActivityIndicator size="large" color="#4d6a72" />}
      <ScrollView contentContainerStyle={styles.scrollView}>
        {mode === 'wardrobe' && renderWardrobe()}
        {mode === 'outfits' && renderOutfits()}
        {mode === 'recommend' && renderRecommendations()}
      </ScrollView>

      {/* MODAL */}
      <Modal transparent visible={showAddModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Category</Text>
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity onPress={() => { setShowAddModal(false); pickImage('top'); }} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Top</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setShowAddModal(false); pickImage('bottom'); }} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Bottom</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  navIcon: {
    width: 25,
    height: 25,
  },
  modeSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  modeButton: {
    padding: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 30,
    height: 30,
  },
  actionLabel: {
    marginTop: 5,
  },
  scrollView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  outfitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#4d6a72',
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
  },
});
