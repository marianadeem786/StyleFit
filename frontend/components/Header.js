import React from 'react'; 
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButtonLeft}>
        <Image source={require('../assets/backicon.png')} style={styles.icon} />
      </TouchableOpacity>

      {/* Logo in the middle */}
      <Text style={styles.logo}>Your Logo</Text> {/* Replace with Image if you have a logo image */}

      {/* Home Button */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.iconButtonRight}>
        <Image source={require('../assets/homeicon.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#E6E6E6', // Light gray like in screenshot
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    position: 'relative', // Ensures positioning for the icons
  },
  iconButtonLeft: {
    position: 'absolute',
    left: 15,
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8888FF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  iconButtonRight: {
    position: 'absolute',
    right: 15,
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8888FF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: '#8888FF',
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8888FF',
  },
});
