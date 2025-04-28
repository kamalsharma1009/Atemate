import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import BottomTabNavigator from './BottomTabNavigator';
import WaterTrackerScreen from '../screens/WaterTrackerScreen';
import FitnessTrackerScreen from '../screens/FitnessTrackerScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="WaterTracker" component={WaterTrackerScreen} />
      <Stack.Screen name="FitnessTracker" component={FitnessTrackerScreen} />
    </Stack.Navigator>
  );
};


export default AppNavigator;
