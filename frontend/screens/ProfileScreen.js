import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [wardrobe, setWardrobe] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchWardrobe();
  }, []);

  const fetchProfile = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      Alert.alert("Error", "Unable to fetch user.");
      return;
    }

    const { data, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      Alert.alert("Error", "Could not fetch profile.");
    } else {
      setProfile(data);
    }
  };

  const fetchWardrobe = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("wardrobe")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.log("Error fetching wardrobe", error);
    } else {
      setWardrobe(data);
    }

    setLoading(false);
  };

  const handleUploadProfilePicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied", "Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const image = result.assets[0];

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;

      const fileExt = image.uri.split(".").pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `profile_pictures/${fileName}`;

      const response = await fetch(image.uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, blob, { upsert: true });

      if (uploadError) {
        Alert.alert("Upload Error", uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(filePath);

      const profile_picture_url = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from("users")
        .update({ profile_picture: profile_picture_url })
        .eq("id", userId);

      if (updateError) {
        Alert.alert("Update Error", updateError.message);
      } else {
        fetchProfile();
      }
    }
  };

  const handleRemoveProfilePicture = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    const { error } = await supabase
      .from("users")
      .update({ profile_picture: null })
      .eq("id", userId);

    if (error) {
      Alert.alert("Error", "Could not remove profile picture.");
    } else {
      fetchProfile();
    }
  };

  const handleRemoveWardrobeItem = async (itemId) => {
    const { error } = await supabase
      .from("wardrobe")
      .delete()
      .eq("id", itemId);

    if (error) {
      Alert.alert("Error", "Could not delete item.");
    } else {
      fetchWardrobe();
    }
  };

  const renderWardrobeItem = ({ item }) => (
    <View style={styles.wardrobeItem}>
      <Image source={{ uri: item.image_url }} style={styles.wardrobeImage} />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemoveWardrobeItem(item.id)}
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleUploadProfilePicture}>
        {profile?.profile_picture ? (
          <Image source={{ uri: profile.profile_picture }} style={styles.profileImage} />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={styles.placeholderText}>Upload Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {profile?.profile_picture && (
        <TouchableOpacity onPress={handleRemoveProfilePicture}>
          <Text style={styles.removeText}>Remove Picture</Text>
        </TouchableOpacity>
      )}

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
