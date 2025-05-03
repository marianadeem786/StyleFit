import React, { useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';

export default function ProfileScreen({ navigation }) {
  
  // Using useLayoutEffect to customize the header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Image source={require('../assets/backicon.png')} style={styles.icon} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.iconButton}>
          <Image source={require('../assets/homeicon.png')} style={styles.icon} />
        </TouchableOpacity>
      ),
      headerTitle: null, // Remove the page title
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Profile Picture */}
        <View style={styles.profileContainer}>
          <Image
            source={require('../assets/profilepic.png')} // Add your profile image here
            style={styles.profilePic}
          />
        </View>

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
        <TouchableOpacity style={styles.wardrobeButton}>
          <Text style={styles.wardrobeButtonText}>WARDROBE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f7f5d9',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 50,
  },
  profileContainer: {
    marginBottom: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,  // Make it circular
    borderWidth: 1,
    borderColor: '#333',
  },
  headerBox: {
    backgroundColor: '#4d6a72',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 40,
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    width: '80%',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4d6a72',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  wardrobeButton: {
    backgroundColor: '#4d6a72',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  wardrobeButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'serif',
    letterSpacing: 1,
  },
  iconButton: {
    paddingHorizontal: 15,
  },
  icon: {
    width: 30,  // Adjust size as needed
    height: 30, // Adjust size as needed
    tintColor: '#8888FF', // Set the color of the icons
  },
});
