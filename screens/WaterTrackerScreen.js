import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const WaterTrackerScreen = () => {
  const [waterIntake, setWaterIntake] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveWaterIntake = async () => {
    if (!waterIntake) {
      Alert.alert('Input Error', 'Please enter water intake.');
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);

        await updateDoc(userDocRef, {
          [`waterTracker.${today}`]: parseInt(waterIntake),
        });

        Alert.alert('Success', 'Water intake updated!');
        setWaterIntake('');
      }
    } catch (error) {
      console.error('Error updating water intake:', error);
      Alert.alert('Error', 'Failed to update water intake.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>💧 Track Your Water Intake</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter water intake (ml)"
        keyboardType="numeric"
        value={waterIntake}
        onChangeText={setWaterIntake}
      />
      <Button
        title={loading ? 'Saving...' : 'Save Intake'}
        onPress={handleSaveWaterIntake}
        disabled={loading}
      />
    </View>
  );
};

export default WaterTrackerScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20 },
});
