import React from 'react';
import config from './config';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import GetStartedScreen from './screens/GetStartedScreen';
import LandingScreen from './screens/LandingScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import OTPScreen from './screens/OTPScreen'; 
import UpdatePasswordScreen from './screens/UpdatePasswordScreen';
import HomeScreen from './screens/HomeScreen'; 
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import LookFinderScreen from './screens/LookFinderScreen';
import TrendsScreen from './screens/TrendsScreen';
import SuggestMatching from './screens/SuggestMatchingScreen';
import GlobalStoreScreen from './screens/GlobalStoreScreen';
import WardrobeScreen from './screens/WardrobeScreen';

// Example of checking login status (you can replace this with your own authentication check)
const isUserLoggedIn = false;  // Set this dynamically based on actual login status

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isUserLoggedIn ? "Home" : "GetStarted"} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="LandingScreen" component={LandingScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="EnterOTP" component={OTPScreen} /> 
        <Stack.Screen name="UpdatePassword" component={UpdatePasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="LookFinder" component={LookFinderScreen} />
        <Stack.Screen name="Trends" component={TrendsScreen} />
        <Stack.Screen name="SuggestMatching" component={SuggestMatching} />
        <Stack.Screen name="GlobalStore" component={GlobalStoreScreen} />
        <Stack.Screen name="Wardrobe" component={WardrobeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
