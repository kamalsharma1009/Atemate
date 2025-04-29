import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import BottomTabNavigator from './BottomTabNavigator';
import WaterTrackerScreen from '../screens/WaterTrackerScreen';
import FitnessTrackerScreen from '../screens/FitnessTrackerScreen';
import BarcodeScannerScreen from '../screens/BarcodeScannerScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import DieticianDashboardScreen from '../screens/DieticianDashboardScreen';
import AddTipScreen from '../screens/AddTipScreen';
import EditTipScreen from '../screens/EditTipScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="WaterTracker" component={WaterTrackerScreen} />
      <Stack.Screen name="FitnessTracker" component={FitnessTrackerScreen} />
      <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} />
      <Stack.Screen name="Chatbot" component={ChatbotScreen} />
      <Stack.Screen name="DieticianDashboard" component={DieticianDashboardScreen} />
      <Stack.Screen name="AddTip" component={AddTipScreen} />
      <Stack.Screen name="EditTip" component={EditTipScreen} />
    </Stack.Navigator>
  );
};


export default AppNavigator;

