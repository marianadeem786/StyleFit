import React from "react";
import config from '../config';

import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";

const ProfileScreen = ({
  profile,
  wardrobe,
  loading,
  onUploadProfilePicture,
  onRemoveProfilePicture,
  onRemoveWardrobeItem,
}) => {
  const renderWardrobeItem = ({ item }) => (
    <View style={styles.wardrobeItem}>
      <Image source={{ uri: item.image_url }} style={styles.wardrobeImage} />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onRemoveWardrobeItem(item.id)}
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onUploadProfilePicture}>
        {profile?.profile_picture ? (
          <Image source={{ uri: profile.profile_picture }} style={styles.profileImage} />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={styles.placeholderText}>Upload Photo</Text>
          </View>
        )}
      </TouchableOpacity>

        {/* Header Label */}
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>PROFILE</Text>
        </View>

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          placeholderTextColor="#888"
          editable={false}
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="john@example.com"
          placeholderTextColor="#888"
          editable={false}
        />

        {/* Edit Profile Button */}
        <TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate('EditProfile')}
>
  <Text style={styles.buttonText}>EDIT PROFILE</Text>
</TouchableOpacity>


        {/* Wardrobe Button */}
        <TouchableOpacity style={styles.wardrobeButton}
          onPress={() => navigation.navigate('Wardrobe')}>
          <Text style={styles.wardrobeButtonText}>WARDROBE</Text>
        </TouchableOpacity>
      
      <Text style={styles.username}>{profile?.username || "User"}</Text>

      <Text style={styles.sectionTitle}>Your Wardrobe</Text>
      <FlatList
        data={wardrobe}
        renderItem={renderWardrobeItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.wardrobeList}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  placeholderText: {
    color: "#888",
  },
  removeText: {
    color: "#f00",
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  wardrobeList: {
    width: "100%",
  },
  wardrobeItem: {
    width: "48%",
    margin: "1%",
    aspectRatio: 1,
    position: "relative",
  },
  wardrobeImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
  loading: {
    marginTop: 50,
    fontSize: 18,
  },
});
