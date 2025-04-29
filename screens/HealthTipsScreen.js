// screens/HealthTipsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Button, Alert } from 'react-native';
import { collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { app, db, auth } from '../firebaseConfig';
import { Card, Paragraph, IconButton, Avatar } from 'react-native-paper';
import { GeminiAPI_KEY } from '../config';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// const db = getFirestore(app);

// These 10 AI prompts with titles & categories for health tips
const aiPrompts = [
  { title: 'Healthy Eating', category: 'Diet', prompt: 'Give a short healthy eating tip (2 lines max).' },
  { title: 'Gym Workout', category: 'Gym', prompt: 'Suggest a quick gym workout tip for beginners (2 lines max).' },
  { title: 'Morning Habit', category: 'Habit', prompt: 'Share a morning routine health habit tip (2 lines max).' },
  { title: 'Stay Hydrated', category: 'Hydration', prompt: 'Give a hydration tip (2 lines max).' },
  { title: 'Better Sleep', category: 'Sleep', prompt: 'Suggest a sleep habit for better rest (2 lines max).' },
  { title: 'Mental Wellbeing', category: 'Mental', prompt: 'Provide a short mental health tip (2 lines max).' },
  { title: 'Desk Stretch', category: 'Stretching', prompt: 'Give a quick stretching tip for desk workers (2 lines max).' },
  { title: 'Cardio Boost', category: 'Cardio', prompt: 'Suggest a simple cardio exercise tip (2 lines max).' },
  { title: 'Motivation', category: 'Motivation', prompt: 'Share a motivational fitness quote (2 lines max).' },
  { title: 'Immunity', category: 'Immunity', prompt: 'Give an immunity boosting tip (2 lines max).' },
];

// Map categories to icons
const categoryIcons = {
  Diet: 'food-apple',
  Gym: 'dumbbell',
  Habit: 'calendar-check',
  Hydration: 'water',
  Sleep: 'sleep',
  Mental: 'brain',
  Stretching: 'run-fast',
  Cardio: 'heart-pulse',
  Motivation: 'lightbulb',
  Immunity: 'shield-check',
};

const HealthTipsScreen = () => {
  const [firestoreTips, setFirestoreTips] = useState([]);
  const [aiTips, setAiTips] = useState([]);
  const [likedTips, setLikedTips] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch tips from Firestore
  const fetchFirestoreTips = async () => {
    try {
      const snap = await getDocs(collection(db, 'healthTips'));
      setFirestoreTips(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load saved tips.');
    }
  };

  // Fetch AI tips from Gemini
  const fetchAiTips = async () => {
    try {
      const results = [];
      for (let { title, category, prompt } of aiPrompts) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GeminiAPI_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        });
        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        if (text) results.push({ title, category, text });
      }
      setAiTips(results);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load AI tips.');
    }
  };

  useEffect(() => {
    (async () => {
      await fetchFirestoreTips();
      await fetchAiTips();
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  // Function to handle like
const handleLike = async (tipId) => {
  const userId = auth.currentUser.uid;

  setLikedTips(prev => {
    const copy = new Set(prev);
    copy.has(tipId) ? copy.delete(tipId) : copy.add(tipId);
    return copy;
  });

  try {
    const likesRef = collection(db, 'likes');

    // Check if already liked
    const q = query(likesRef, where('userId', '==', userId), where('tipId', '==', tipId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // If liked, remove like (unlike)
      await deleteDoc(querySnapshot.docs[0].ref);
      console.log('Unliked!');
    } else {
      // Else, add like
      await addDoc(likesRef, {
        userId,
        tipId,
        createdAt: new Date(),
      });
      console.log('Liked!');
    }
  } catch (error) {
    console.error('Error handling like:', error);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Dietician’s Tips</Text>
      {firestoreTips.map(tip => (
        <Card key={tip.id} style={styles.card}>
          <Card.Title
            title={tip.title}
            titleStyle={styles.cardTitle}
            left={props => <Avatar.Icon {...props} icon={categoryIcons[tip.category] || 'lightbulb'} />}
            right={props => (
              <IconButton
                {...props}
                icon={likedTips.has(tip.id) ? 'heart' : 'heart-outline'}
                color={likedTips.has(tip.id) ? 'red' : 'gray'}
                onPress={() => handleLike(tip.id)}
              />
            )}
          />
          <Card.Content>
            <Paragraph style={styles.cardContent}>{tip.content}</Paragraph>
          </Card.Content>
        </Card>
      ))}

      <Text style={styles.header}>AI-Generated Tips</Text>
      {aiTips.map((tip, idx) => (
        <Card key={idx} style={styles.card}>
          <Card.Title
            title={tip.title}
            subtitle={tip.category}
            titleStyle={styles.cardTitle}
            subtitleStyle={styles.cardSubtitle}
            left={props => (
              <Avatar.Icon {...props} icon={categoryIcons[tip.category] || 'lightbulb'} />
            )}
          />
          <Card.Content>
            <Paragraph style={styles.cardContent}>{tip.text}</Paragraph>
          </Card.Content>
        </Card>
      ))}

      <Button
        title="Refresh All Tips"
        onPress={async () => {
          setLoading(true);
          await fetchFirestoreTips();
          await fetchAiTips();
          setLoading(false);
        }}
        color="#6200ee"
      />
    </ScrollView>
  );
};

export default HealthTipsScreen;

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6200ee',
    marginVertical: 12,
  },
  card: { marginBottom: 12, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#1976d2' },
  cardSubtitle: { fontSize: 14, color: '#555' },
  cardContent: { fontSize: 16, color: '#333' },
});
