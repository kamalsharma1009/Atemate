import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Image, SafeAreaView } from 'react-native';
import { getGeminiResponse } from '../utils/geminiApi';
import { db, auth } from '../firebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile();
    // Add welcome message
    setMessages([{ 
      role: 'bot', 
      text: 'Hello! I\'m your personal Health Assistant. How can I help you with your diet, fitness, or health concerns today?' 
    }]);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const personalizedPrompt = `
      User Info:
      Name: ${userProfile?.name || 'User'}
      Age: ${userProfile?.age || 'unknown'}
      Weight: ${userProfile?.weight || 'unknown'}
      Allergies: ${userProfile?.allergies || 'none'}
      Medical History: ${userProfile?.medicalHistory || 'none'}
      Fitness Goal: ${userProfile?.goal || 'General Fitness'}
      
      User's Question: ${input}
      
      Based on above profile, act like you are a professional dietician and health expert.
      Provide personalized advice considering the user's profile for fitness, diet, health, and habits.
      Keep responses concise (3-5 sentences maximum) but informative.
      Use a warm, professional tone and format responses for easy reading.
      `;

      const response = await getGeminiResponse(personalizedPrompt);
      const botMessage = { role: 'bot', text: response, timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error communicating with Gemini:', error);
      const errorMessage = { role: 'bot', text: "I'm having trouble connecting right now. Please try again shortly.", timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.messageContainer, 
      item.role === 'user' ? styles.userMessageContainer : styles.botMessageContainer
    ]}>
      {item.role === 'bot' && (
        <View style={styles.avatarContainer}>
          <Image 
            source={require('../assets/bot-avatar.png')} 
            style={styles.botAvatar}
          />
        </View>
      )}
      
      <View style={[
        styles.messageBubble, 
        item.role === 'user' ? styles.userMessageBubble : styles.botMessageBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.role === 'user' ? styles.userMessageText : styles.botMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      
      {item.role === 'user' && (
        <View style={styles.avatarContainer}>
          <Image 
            source={userProfile?.photoURL ? { uri: userProfile.photoURL } : require('../assets/user-avatar.png')}
            style={styles.userAvatar}
          />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Assistant</Text>
        <View style={styles.headerStatus}>
          <View style={styles.statusIndicator} />
          <Text style={styles.statusText}>Active</Text>
        </View>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesContainer}
          inverted={false}
          showsVerticalScrollIndicator={false}
          ref={ref => this.flatList = ref}
          onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <View style={styles.typingIndicator}>
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Ask me about nutrition, exercise, or health..."
            style={styles.input}
            value={input}
            onChangeText={setInput}
            multiline
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            onPress={handleSend} 
            style={styles.sendButton}
            disabled={!input.trim()}
          >
            <Ionicons 
              name="send" 
              size={22} 
              color={input.trim() ? "#fff" : "#ccc"} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatbotScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  headerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-end',
    maxWidth: '100%',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  avatarContainer: {
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 8,
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
  },
  botMessageBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  userMessageBubble: {
    backgroundColor: '#4285f4',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botMessageText: {
    color: '#2c3e50',
  },
  userMessageText: {
    color: '#ffffff',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
  botTimestamp: {
    color: '#95a5a6',
    textAlign: 'left',
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f3f4',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 120,
    color: '#2c3e50',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4285f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  loadingContainer: {
    paddingVertical: 8,
  },
  typingIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    alignSelf: 'flex-start',
    marginLeft: 52,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#95a5a6',
    marginHorizontal: 2,
    opacity: 0.4,
  },
});