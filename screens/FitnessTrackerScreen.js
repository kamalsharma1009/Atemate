import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { firestore } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const FitnessTrackerScreen = () => {
  const [steps, setSteps] = useState('');
  const [calories, setCalories] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveFitnessData = async () => {
    if (!steps || !calories) {
      Alert.alert('Input Error', 'Please enter steps and calories.');
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const today = new Date().toISOString().split('T')[0];

      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);

        await updateDoc(userDocRef, {
          [`fitnessTracker.${today}`]: {
            steps: parseInt(steps),
            calories: parseInt(calories),
          },
        });

        Alert.alert('Success', 'Fitness data updated!');
        setSteps('');
        setCalories('');
      }
    } catch (error) {
      console.error('Error updating fitness data:', error);
      Alert.alert('Error', 'Failed to update fitness data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🏃 Track Your Fitness</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter steps"
        keyboardType="numeric"
        value={steps}
        onChangeText={setSteps}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter calories burned"
        keyboardType="numeric"
        value={calories}
        onChangeText={setCalories}
      />
      <Button
        title={loading ? 'Saving...' : 'Save Fitness Data'}
        onPress={handleSaveFitnessData}
        disabled={loading}
      />
    </View>
  );
};

export default FitnessTrackerScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20 },
});
