import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { FAB, Appbar } from 'react-native-paper';

const AddTipScreen = () => {
  const [title, setTitle] = useState('');
  const [content, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!title || !content || !category) {
      return Alert.alert('Error', 'All fields are required.');
    }

    try {
      await addDoc(collection(db, 'healthTips'), {
        title,
        content,
        category,
        dieticianId: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
      });
      Alert.alert('Success', 'Tip added successfully!');
      navigation.goBack();
    } catch (err) {
      console.error('Error adding tip:', err);
      Alert.alert('Error', 'Could not add tip. Please try again.');
    }
  };

  return (
    <>
    <Appbar.Header>
        <Appbar.Content style={styles.header} title={`Add New Tip`} />
    </Appbar.Header>
    
    <View style={styles.container}>
    
    <Text style={styles.header}>Add new tip and submit</Text>
    
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        value={content}
        onChangeText={setDescription}
        style={[styles.input, { height: 100 }]}
        multiline
      />

      <TextInput
        placeholder="Category (Diet, Gym, Mental)"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Tip</Text>
      </TouchableOpacity>
    </View>
    </>
  );
};

export default AddTipScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6ff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
