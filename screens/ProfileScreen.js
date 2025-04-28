import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const user = getAuth().currentUser;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user?.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{user?.displayName || 'Guest User'}</Text>
      <Text style={styles.email}>{user?.email || 'guest@example.com'}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('WaterTracker')}
        >
          <Text style={styles.buttonText}>💧 Track Water</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('FitnessTracker')}
        >
          <Text style={styles.buttonText}>🏃‍♂️ Track Fitness</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', padding: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginTop: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  email: { fontSize: 16, color: 'gray', marginBottom: 30 },
  buttonContainer: { width: '100%', alignItems: 'center' },
  button: {
    width: '80%',
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
