import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, ScrollView, ActivityIndicator, Alert
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://10.0.2.2:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert('Success', 'Logged in successfully');
        navigation.navigate('Home');
      } else {
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />

        <View style={styles.headerBox}>
          <Text style={styles.headerText}>LOG INTO YOUR ACCOUNT</Text>
        </View>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>ENTER</Text>
          )}
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
  forgotPassword: {
    alignSelf: 'flex-start',
    marginLeft: 18,
    color: '#333',
    fontSize: 14,
    marginBottom: 20,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#4d6a72',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
