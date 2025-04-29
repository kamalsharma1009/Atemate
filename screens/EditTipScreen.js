import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FAB, Appbar } from 'react-native-paper';

const EditTipScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { tip } = route.params;

  const [title, setTitle] = useState(tip.title);
  const [content, setDescription] = useState(tip.content);
  const [category, setCategory] = useState(tip.category);

  const handleUpdate = async () => {
    if (!title || !content || !category) {
      return Alert.alert('Error', 'All fields are required.');
    }

    try {
      await updateDoc(doc(db, 'healthTips', tip.id), {
        title,
        content,
        category,
      });
      Alert.alert('Success', 'Tip updated!');
      navigation.goBack();
    } catch (err) {
      console.error('Error updating tip:', err);
      Alert.alert('Error', 'Could not update tip.');
    }
  };

  return (
    <>
    <Appbar.Header>
        <Appbar.Content style={styles.header} title={`Edit Tip`} />
    </Appbar.Header>
    <View style={styles.container}>
      <Text style={styles.header}>Edit the tip and save the changes</Text>

      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput
        placeholder="Description"
        value={content}
        onChangeText={setDescription}
        style={[styles.input, { height: 100 }]}
        multiline
      />
      <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={styles.input} />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Tip</Text>
      </TouchableOpacity>
    </View>
    </>
  );
};

export default EditTipScreen;

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
