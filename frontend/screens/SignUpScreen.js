import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';

export default function CreateAccountScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />

        <View style={styles.headerBox}>
          <Text style={styles.headerText}>CREATE YOUR ACCOUNT</Text>
        </View>

        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} placeholder="" placeholderTextColor="#999" />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="" placeholderTextColor="#999" keyboardType="email-address" />

        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} placeholder="" placeholderTextColor="#999" secureTextEntry />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput style={styles.input} placeholder="" placeholderTextColor="#999" secureTextEntry />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>VERIFY</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f7f5d9',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 50,
  },
  logo: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  headerBox: {
    backgroundColor: '#4d6a72',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 40,
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    width: '80%',
    backgroundColor: '#e8e8e8',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
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
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
