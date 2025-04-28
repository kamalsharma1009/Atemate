import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ChatbotButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => navigation.navigate('Chatbot')}
    >
      <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: '#6200ee',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default ChatbotButton;
