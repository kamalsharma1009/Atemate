// ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
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
      <Text style={styles.name}>{userData.name}</Text>
      <Text style={styles.info}>Email: {userData.email}</Text>
      <Text style={styles.info}>Age: {userData.age}</Text>
      <Text style={styles.info}>Goal: {userData.goal}</Text>
      <Text style={styles.info}>Medical History: {userData.medicalHistory}</Text>
      <Text style={styles.info}>Allergies: {userData.allergies}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    backgroundColor: '#f9f9f9',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  info: {
    fontSize: 16,
    marginTop: 10,
    color: '#555',
  },
});

export default ProfileScreen;
