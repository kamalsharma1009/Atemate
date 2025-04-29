import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Picker } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const SignupScreen = ({ navigation }) => {
  const [userType, setUserType] = useState('user'); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [goal, setGoal] = useState('');

  const [qualifications, setQualifications] = useState('');
  const [certificationLink, setCertificationLink] = useState('');
  const [bio, setBio] = useState('');

  const handleSignup = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      if (userType === 'user') {
        await setDoc(doc(db, 'users', uid), {
          name,
          email,
          age,
          gender,
          height,
          weight,
          allergies,
          userType: 'user',
          medicalHistory: medicalHistory.split(',').map(item => item.trim()),
          goal,
          waterTracker: {},
          fitnessTracker: {},
        });
      } else if (userType === 'dietician') {
        await setDoc(doc(db, 'dietician', uid), {
          name,
          email,
          qualifications,
          certificationLink,
          bio,
          userType: 'dietician',
          verified: false,
          suggestionsGivenCount: 0,
        });
      }

      Alert.alert('Success', 'Account created successfully!');
      navigation.replace('Login');

    } catch (error) {
      console.log(error);
      Alert.alert('Signup Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register to Atemate</Text>

      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.switchButton, userType === 'user' && styles.activeButton]}
          onPress={() => setUserType('user')}
        >
          <Text style={userType === 'user' ? styles.activeText : styles.inactiveText}>User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, userType === 'dietician' && styles.activeButton]}
          onPress={() => setUserType('dietician')}
        >
          <Text style={userType === 'dietician' ? styles.activeText : styles.inactiveText}>Dietician</Text>
        </TouchableOpacity>
      </View>

      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      {userType === 'user' ? (
        <>
          <TextInput style={styles.input} placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Gender (Male/Female)" value={gender} onChangeText={setGender} />
          <TextInput style={styles.input} placeholder="Height (cm)" value={height} onChangeText={setHeight} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Allergies (comma separated)" value={allergies} onChangeText={setAllergies} />
          <TextInput style={styles.input} placeholder="Medical History (comma separated)" value={medicalHistory} onChangeText={setMedicalHistory} />
          <TextInput style={styles.input} placeholder="Goal (fat loss / muscle gain)" value={goal} onChangeText={setGoal} />
        </>
      ) : (
        <>
          <TextInput style={styles.input} placeholder="Qualifications" value={qualifications} onChangeText={setQualifications} />
          <TextInput style={styles.input} placeholder="Certification Link" value={certificationLink} onChangeText={setCertificationLink} />
          <TextInput style={styles.input} placeholder="Short Bio" value={bio} onChangeText={setBio} />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 20,
    marginVertical: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  linkText: {
    color: '#6200ee',
    textAlign: 'center',
    marginTop: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  switchButton: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6200ee',
  },
  activeButton: {
    backgroundColor: '#6200ee',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#6200ee',
  },
});
