import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function WardrobeScreen({ navigation }) {
  const [uploads, setUploads] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);

  const pickImage = async (type) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setUploads([...uploads, { uri: result.assets[0].uri, type }]);
    }
  };

  const handleImagePress = (index) => {
    if (removeMode) {
      Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updated = [...uploads];
            updated.splice(index, 1);
            setUploads(updated);
          },
          style: 'destructive',
        },
      ]);
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
        <Text style={styles.title}>WARDROBE</Text>
      </View>

      {/* Action Row */}
      <View style={styles.actionRow}>
        <View style={styles.actionItem}>
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <Image source={require('../assets/add.png')} style={styles.actionIcon} />
          </TouchableOpacity>
          <Text style={styles.actionLabel}>Add</Text>
        </View>

        <View style={{ flex: 1 }} />

        <View style={styles.actionItem}>
          <TouchableOpacity onPress={() => setRemoveMode(!removeMode)}>
            <Image source={require('../assets/remove.png')} style={styles.actionIcon} />
          </TouchableOpacity>
          <Text style={styles.actionLabel}>{removeMode ? 'Done' : 'Remove'}</Text>
        </View>
      </View>

      {/* Image Uploads */}
      <ScrollView contentContainerStyle={uploads.length === 0 ? styles.scrollContainer : null}>
        {uploads.length === 0 ? (
          <Text style={styles.emptyText}>Nothing uploaded yet, this page is empty</Text>
        ) : (
          <View style={styles.uploadGrid}>
            {uploads.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.uploadBox}
                onPress={() => handleImagePress(index)}
              >
                <Image source={{ uri: item.uri }} style={styles.imagePlaceholder} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Category</Text>
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowAddModal(false);
                  pickImage('top');
                }}
              >
                <Text style={styles.modalButtonText}>Top</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowAddModal(false);
                  pickImage('bottom');
                }}
              >
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
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 28,
    height: 28,
    marginHorizontal: 8,
    resizeMode: 'contain',
  },
  actionLabel: {
    marginTop: 4,
    fontSize: 14,
    color: '#4d6a72',
    fontWeight: '500',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  uploadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  uploadBox: {
    width: '48%',
    height: 160,
    backgroundColor: '#ccc',
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4d6a72',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#4d6a72',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelButtonText: {
    color: '#4d6a72',
    fontSize: 16,
    fontWeight: '600',
  },
});
