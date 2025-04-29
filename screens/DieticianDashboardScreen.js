import React, { useState, useCallback } from 'react';
import {
  View, FlatList, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import {
  collection, query, where, getDocs, deleteDoc, doc,
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FAB, Appbar } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';

const DieticianDashboardScreen = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dieticianName, setDieticianName] = useState('');
  const navigation = useNavigation();

  const fetchMyTips = async () => {
    try {
      const q = query(collection(db, 'healthTips'), where('dieticianId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const tipsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTips(tipsData);
    } catch (err) {
      console.error('Error fetching tips:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDieticianName = async () => {
    try {
      const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', auth.currentUser.uid)));
      if (!userDoc.empty) {
        setDieticianName(userDoc.docs[0].data().name);
      }
    } catch (e) {
      console.error('Failed to get name:', e);
    }
  };

  const deleteTip = async (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this tip?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'healthTips', id));
          fetchMyTips(); // refresh
        },
      },
    ]);
  };

  const renderTipCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.category}>#{item.category}</Text>
      <Text style={{ marginBottom: 10 }}>{item.content}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => navigation.navigate('EditTip', { tip: item })}>
          <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTip(item.id)}>
          <Text style={styles.delete}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  useFocusEffect(
    useCallback(() => {
      fetchMyTips();
      fetchDieticianName();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title={`Welcome, Dr. ${dieticianName || 'Dietician'}`} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : tips.length > 0 ? (
          <FlatList
            data={tips}
            renderItem={renderTipCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        ) : (
          <Text style={styles.noTips}>No tips added yet.</Text>
        )}

        <FAB
          icon="plus"
          label="Add Tip"
          style={styles.fab}
          onPress={() => navigation.navigate('AddTip')}
          color="white"
        />
      </View>
    </View>
  );
};

export default DieticianDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    padding: 16,
  },
  card: {
    backgroundColor: '#e8f0ff',
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  category: {
    fontStyle: 'italic',
    color: '#6200ee',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
  },
  edit: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  delete: {
    color: 'red',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 30,
    backgroundColor: '#6200ee',
  },
  noTips: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: 'gray',
  },
});
