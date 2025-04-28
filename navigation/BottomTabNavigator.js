import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import BarcodeScannerScreen from '../screens/BarcodeScannerScreen';
import HealthTipsScreen from '../screens/HealthTipsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import ChatbotButton from '../components/ChatbotButton';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <>
      <Tab.Navigator   
        screenOptions={({ route }) => ({
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#6200ee',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Scanner') {
              iconName = 'barcode';
            } else if (route.name === 'HealthTips') {
              iconName = 'fitness';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        
        <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerTitle: '🏠 Dashboard' }}/>
        <Tab.Screen name="Scanner" component={BarcodeScannerScreen} />
        <Tab.Screen name="HealthTips" component={HealthTipsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      {/* Floating Chatbot Button */}
      <ChatbotButton />
    </>
  );
};

export default BottomTabNavigator;

