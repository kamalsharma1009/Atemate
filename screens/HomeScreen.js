import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 
import moment from 'moment'; 
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native';
import Header from '../components/Header';

const HomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const [waterToday, setWaterToday] = useState(0);
  const [stepsToday, setStepsToday] = useState(0);
  const [latestTip, setLatestTip] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const auth = getAuth();
  const user = auth.currentUser;
  const todayDate = moment().format('YYYY-MM-DD');

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    try {
      // Fetch user basic data
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);

        // Water Intake
        if (data.waterTracker && data.waterTracker[todayDate]) {
          setWaterToday(data.waterTracker[todayDate]);
        } else {
          setWaterToday(0);
        }

        // Fitness Tracker (Steps Today)
        if (data.fitnessTracker && data.fitnessTracker[todayDate] && data.fitnessTracker[todayDate].steps) {
          setStepsToday(data.fitnessTracker[todayDate].steps);
        } else {
          setStepsToday(0);
        }
      }

      // Fetch latest health tip
      const tipsRef = collection(db, 'healthTips');
      const tipsQuery = query(tipsRef, orderBy('date', 'desc'), limit(1));
      const tipsSnap = await getDocs(tipsQuery);
      if (!tipsSnap.empty) {
        const tipDoc = tipsSnap.docs[0].data();
        setLatestTip(tipDoc);
      } else {
        setLatestTip(null);
      }
    } catch (error) {
      console.error('Error fetching home screen data:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllData().then(() => setRefreshing(false));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    else if (hour < 18) return 'Good Afternoon';
    else return 'Good Evening';
  };

  return (
    <>
    {/* <Header title="Home" /> */}
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.greeting}>
        {getGreeting()}, {userData?.name || 'Guest'}! 👋
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Water Intake 💧</Text>
        <Text style={styles.cardData}>{waterToday} ml</Text>
        <Button style={styles.editButton} title="Track Water" onPress={() => navigation.navigate('WaterTracker')} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Steps 🚶‍♂️</Text>
        <Text style={styles.cardData}>{stepsToday} steps</Text>
        <Button style={styles.editButton} title="Track Fitness" onPress={() => navigation.navigate('FitnessTracker')} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Motivation of the Day 🧠</Text>
        <Text style={styles.cardData}>"Small steps every day lead to big results."</Text>
      </View>

      {latestTip && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Latest Health Tip 🍎</Text>
          <Text style={styles.cardData}>{latestTip.title}</Text>
          <Text style={styles.tipContent}>{latestTip.content}</Text>
        </View>
      )}
    </ScrollView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  greeting: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#6200ee' },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, color: '#333', marginBottom: 10, fontWeight: '600' },
  cardData: { fontSize: 22, fontWeight: 'bold', color: '#6200ee' },
  tipContent: { marginTop: 8, fontSize: 16, color: '#555' },
  editButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
  },
});
