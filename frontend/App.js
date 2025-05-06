import 'react-native-gesture-handler';
import config from './config';
import * as React from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
  Image
} from 'react-native';
import Navigation from './Navigation';

export default function App() {
  // Common state
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [resetOtp, setResetOtp] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
  const [imageUri, setImageUri] = React.useState('');
  const [wardrobeImageUri, setWardrobeImageUri] = React.useState('');
  const [wardrobeCategory, setWardrobeCategory] = React.useState('');
  const [removeItemId, setRemoveItemId] = React.useState('');
  const [wardrobeItems, setWardrobeItems] = React.useState([]);
  const [message, setMessage] = React.useState('');

  // Sign Up

  const handleSignUp = async () => {
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    Alert.alert('Error', 'All fields are required.');
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Error', 'Passwords do not match.');
    return;
  }

  try {
    const res = await fetch(`${config.BACKEND_URL}/api/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        confirm_password: confirmPassword,
        first_name: firstName,
        last_name: lastName,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      Alert.alert('Success', data.message || 'Signed up successfully.');
      navigation.navigate('Login');
    } else {
      Alert.alert('Error', data.error || 'Signup failed.');
    }
  } catch {
    Alert.alert('Error', 'Network error.');
  }
};

  
  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!email || !otp) {
      Alert.alert('Error', 'Email and OTP are required.');
      return;
    }
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/verify-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        Alert.alert('Success', data.message);
      } else {
        setMessage(data.error);
        Alert.alert('Error', data.error);
      }
    } catch {
      Alert.alert('Error', 'Network error.');
    }
  };

  // Login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        Alert.alert('Success', data.message);
      } else {
        setMessage(data.error);
        Alert.alert('Error', data.error);
      }
    } catch {
      Alert.alert('Error', 'Network error.');
    }
  };

  // Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Email is required.');
      return;
    }
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/forgot_password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        Alert.alert('Success', data.message);
      } else {
        setMessage(data.error);
        Alert.alert('Error', data.error);
      }
    } catch {
      Alert.alert('Error', 'Network error.');
    }
  };

  // Reset Password
  const handleResetPassword = async () => {
    if (!email || !resetOtp || !newPassword || !confirmNewPassword) {
      Alert.alert('Error', 'All fields are required for password reset.');
      return;
    }
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/reset_password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: resetOtp,
          new_password: newPassword,
          confirm_password: confirmNewPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        Alert.alert('Success', data.message);
      } else {
        setMessage(data.error);
        Alert.alert('Error', data.error);
      }
    } catch {
      Alert.alert('Error', 'Network error.');
    }
  };

  // Upload Profile Picture
  const handleUploadProfilePicture = async () => {
    if (!email || !imageUri) {
      Alert.alert('Error', 'Email and image URI are required.');
      return;
    }
    const formData = new FormData();
    formData.append('email', email);
    formData.append('image', {
      uri: imageUri,
      name: 'profile.jpg',
      type: 'image/jpeg',
    });
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/upload_profile_picture/`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        Alert.alert('Success', data.message);
      } else {
        setMessage(data.error);
        Alert.alert('Error', data.error);
      }
    } catch {
      Alert.alert('Error', 'Network error.');
    }
  };

  // Remove Profile Picture
  const handleRemoveProfilePicture = async () => {
    if (!email) {
      Alert.alert('Error', 'Email is required.');
      return;
    }
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/remove_profile_picture/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        Alert.alert('Success', data.message);
      } else {
        setMessage(data.error);
        Alert.alert('Error', data.error);
      }
    } catch {
      Alert.alert('Error', 'Network error.');
    }
  };

  // Upload Wardrobe Item
  const handleUploadWardrobeItem = async () => {
    if (!email || !wardrobeImageUri) {
      Alert.alert('Error', 'Email and image URI are required.');
      return;
    }
    const formData = new FormData();
    formData.append('email', email);
    formData.append('category', wardrobeCategory);
    formData.append('image', {
      uri: wardrobeImageUri,
      name: 'wardrobe.jpg',
      type: 'image/jpeg',
    });
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/upload_wardrobe_item/`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', data.message);
        fetchWardrobeItems(); // refresh list
      } else {
        Alert.alert('Error', data.error);
      }
    } catch {
      Alert.alert('Error', 'Network error.');
    }
  };

  // Remove Wardrobe Item
  const handleRemoveWardrobeItem = async () => {
    if (!email || !removeItemId) {
      Alert.alert('Error', 'Email and item ID are required.');
      return;
    }
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/remove_wardrobe_item/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, id: removeItemId }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', data.message);
        fetchWardrobeItems();
      } else {
        Alert.alert('Error', data.error);
      }
    } catch {
      Alert.alert('Error', 'Network error.');
    }
  };

  // View Wardrobe Items
  const fetchWardrobeItems = async () => {
    if (!email) {
      Alert.alert('Error', 'Email is required.');
      return;
    }
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/view_wardrobe_items/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setWardrobeItems(data.items);
      } else {
        Alert.alert('Error', data.error);
      }
    } catch {
      Alert.alert('Error', 'Network error.');
    }

    // 11. Show Profile
  const handleShowProfile = async () => {
    if (!email) return Alert.alert('Error', 'Email is required.');
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/show_profile/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      res.ok
        ? Alert.alert('Profile', `Name: ${data.name}\nPicture: ${data.picture}`)
        : Alert.alert('Error', data.error);
    } catch {
      Alert.alert('Error', 'Network error.');
    }
  };

  // // 12. Update Profile Name
  // const handleUpdateProfileName = async () => {
  //   if (!email || !firstName || !lastName)
  //     return Alert.alert('Error', 'Email, first and last name are required.');
  //   try {
  //     const res = await fetch(`${config.BACKEND_URL}/api/update_profile_name/`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email, first_name: firstName, last_name: lastName }),
  //     });
  //     const data = await res.json();
  //     res.ok
  //       ? Alert.alert('Success', data.message)
  //       : Alert.alert('Error', data.error);
  //   } catch {
  //     Alert.alert('Error', 'Network error.');
  //   }
  // };

  // // 13. Change Password
  // const handleChangePassword = async () => {
  //   if (!email || !password || !newPassword || !confirmNewPassword)
  //     return Alert.alert('Error', 'All fields are required.');
  //   try {
  //     const res = await fetch(`${config.BACKEND_URL}/api/change_password_view/`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         email,
  //         old_password: password,
  //         new_password: newPassword,
  //         confirm_password: confirmNewPassword,
  //       }),
  //     });
  //     const data = await res.json();
  //     res.ok
  //       ? Alert.alert('Success', data.message)
  //       : Alert.alert('Error', data.error);
  //   } catch {
  //     Alert.alert('Error', 'Network error.');
  //   }
  // };

  // // 14. Search by Name
  // const handleSearchByName = async () => {
  //   if (!email || !firstName) return Alert.alert('Error', 'Email and product name are required.');
  //   try {
  //     const res = await fetch(`${config.BACKEND_URL}/api/search_by_name_view/`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email, name: firstName }),
  //     });
  //     const data = await res.json();
  //     if (res.ok) {
  //       // handle data.results
  //     } else {
  //       Alert.alert('Error', data.error);
  //     }
  //   } catch {
  //     Alert.alert('Error', 'Network error.');
  //   }
  // };

  // // 15. Search by Store
  // const handleSearchByStore = async () => {
  //   if (!email || !lastName) return Alert.alert('Error', 'Email and store name are required.');
  //   try {
  //     const res = await fetch(`${config.BACKEND_URL}/api/search_by_store_view/`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email, store: lastName }),
  //     });
  //     const data = await res.json();
  //     if (res.ok) {
  //       // handle data.results
  //     } else {
  //       Alert.alert('Error', data.error);
  //     }
  //   } catch {
  //     Alert.alert('Error', 'Network error.');
  //   }
  // };

  // // 16. Filter by Category
  // const handleFilterByCategory = async () => {
  //   if (!email || !wardrobeCategory) return Alert.alert('Error', 'Email and category are required.');
  //   try {
  //     const res = await fetch(`${config.BACKEND_URL}/api/filter_by_category_view/`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email, category: wardrobeCategory, subtype: '', gender: '' }),
  //     });
  //     const data = await res.json();
  //     if (res.ok) {
  //       // handle data.results
  //     } else {
  //       Alert.alert('Error', data.error);
  //     }
  //   } catch {
  //     Alert.alert('Error', 'Network error.');
  //   }
  // };

  // // 17. Advanced Search
  // const handleAdvancedSearch = async () => {
  //   if (!email) return Alert.alert('Error', 'Email is required.');
  //   try {
  //     const res = await fetch(`${config.BACKEND_URL}/api/advanced_search_view/`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         email,
  //         name: firstName,
  //         store: lastName,
  //         category: wardrobeCategory,
  //         subtype: '',
  //         gender: '',
  //       }),
  //     });
  //     const data = await res.json();
  //     if (res.ok) {
  //       // handle data.results
  //     } else {
  //       Alert.alert('Error', data.error);
  //     }
  //   } catch {
  //     Alert.alert('Error', 'Network error.');
  //   }
  // };
    
  };

  return (
    <Navigation>
      {/* Sign Up */}
      <Text style={styles.title}>Sign Up</Text>
      <TextInput style={styles.input} placeholder="First name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last name" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      <Button title="Sign Up" onPress={handleSignUp} />
  
      {/* Verify OTP */}
      <Text style={styles.title}>Verify OTP</Text>
      <TextInput style={styles.input} placeholder="Enter OTP" value={otp} onChangeText={setOtp} keyboardType="numeric" />
      <Button title="Verify OTP" onPress={handleVerifyOtp} />
  
      {/* Log In */}
      <Text style={styles.title}>Log In</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Log In" onPress={handleLogin} />
  
      {/* Forgot Password */}
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none" />
      <Button title="Send OTP" onPress={handleForgotPassword} />
  
      {/* Reset Password */}
      <Text style={styles.title}>Reset Password</Text>
      <TextInput style={styles.input} placeholder="OTP" value={resetOtp} onChangeText={setResetOtp} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="New password" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm password" value={confirmNewPassword} onChangeText={setConfirmNewPassword} secureTextEntry />
      <Button title="Reset Password" onPress={handleResetPassword} />
  
      {/* Upload Profile Picture */}
      <Text style={styles.title}>Upload Profile Picture</Text>
      <TextInput style={styles.input} placeholder="Image URI" value={imageUri} onChangeText={setImageUri} />
      <Button title="Upload Picture" onPress={handleUploadProfilePicture} />
  
      {/* Remove Profile Picture */}
      <Text style={styles.title}>Remove Profile Picture</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none" />
      <Button title="Remove Picture" onPress={handleRemoveProfilePicture} />
  
      {/* Upload Wardrobe Item */}
      <Text style={styles.title}>Upload Wardrobe Item</Text>
      <TextInput style={styles.input} placeholder="Category" value={wardrobeCategory} onChangeText={setWardrobeCategory} />
      <TextInput style={styles.input} placeholder="Image URI" value={wardrobeImageUri} onChangeText={setWardrobeImageUri} />
      <Button title="Upload Item" onPress={handleUploadWardrobeItem} />
  
      {/* Remove Wardrobe Item */}
      <Text style={styles.title}>Remove Wardrobe Item</Text>
      <TextInput style={styles.input} placeholder="Item ID" value={removeItemId} onChangeText={setRemoveItemId} keyboardType="numeric" />
      <Button title="Remove Item" onPress={handleRemoveWardrobeItem} />
  
      {/* View Wardrobe Items */}
      <Text style={styles.title}>Your Wardrobe Items</Text>
      <Button title="Refresh Wardrobe" onPress={fetchWardrobeItems} />
      {wardrobeItems.map((item) => (
        <View key={item.id} style={styles.item}>
          <Image source={{ uri: item.image_url }} style={styles.image} />
          <Text>Category: {item.category}</Text>
          <Text>ID: {item.id}</Text>
        </View>
      ))}
  
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </Navigation>
  );
  
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'stretch' },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 12, textAlign: 'center' },
  input: {
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  message: { marginTop: 12, textAlign: 'center', color: 'red' },
  item: {
    marginVertical: 8,
    padding: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
  },
  image: { width: 100, height: 100, marginBottom: 4 },
});
