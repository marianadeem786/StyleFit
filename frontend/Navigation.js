import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import LandingScreen from './screens/LandingScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import OTPScreen from './screens/OTPScreen'; 
import UpdatePasswordScreen from './screens/UpdatePasswordScreen';


const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="EnterOTP" component={OTPScreen} /> 
        <Stack.Screen name="UpdatePassword" component={UpdatePasswordScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
