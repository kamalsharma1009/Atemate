// ProfileScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({});
  const navigation = useNavigation(); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setEditableData(data);
          } else {
            console.log('No user document found.');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const currentUser = auth.currentUser;
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, editableData);
      setUserData(editableData);
      setIsEditing(false);
      Alert.alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Failed to update profile');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged out successfully!');
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout failed');
    }
  };

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/user-avatar.png')}
        style={styles.avatar}
      />

      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={editableData.name}
            onChangeText={(text) =>
              setEditableData((prev) => ({ ...prev, name: text }))
            }
            placeholder="Name"
          />
          <TextInput
            style={styles.input}
            value={editableData.age}
            onChangeText={(text) =>
              setEditableData((prev) => ({ ...prev, age: text }))
            }
            placeholder="Age"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={editableData.goal}
            onChangeText={(text) =>
              setEditableData((prev) => ({ ...prev, goal: text }))
            }
            placeholder="Goal"
          />
          <TextInput
            style={styles.input}
            value={editableData.medicalHistory}
            onChangeText={(text) =>
              setEditableData((prev) => ({ ...prev, medicalHistory: text }))
            }
            placeholder="Medical History"
          />
          <TextInput
            style={styles.input}
            value={editableData.allergies}
            onChangeText={(text) =>
              setEditableData((prev) => ({ ...prev, allergies: text }))
            }
            placeholder="Allergies"
          />
          <Button title="Save" onPress={handleUpdateProfile} />
        </>
      ) : (
        <>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.info}>Email: {userData.email}</Text>
          <Text style={styles.info}>Age: {userData.age}</Text>
          <Text style={styles.info}>Goal: {userData.goal}</Text>
          <Text style={styles.info}>Medical History: {userData.medicalHistory}</Text>
          <Text style={styles.info}>Allergies: {userData.allergies}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#666' },
  container: { flex: 1, alignItems: 'center', paddingTop: 40, backgroundColor: '#f9f9f9' },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  info: { fontSize: 16, marginTop: 10, color: '#555' },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#E53935',
    padding: 10,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
