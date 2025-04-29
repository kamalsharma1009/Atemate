import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { db } from '../firebaseConfig'; // Your Firebase config file
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { GeminiAPI_KEY } from '../config';

const screenWidth = Dimensions.get('window').width;

const BarcodeScannerScreen = () => {
  const [barcode, setBarcode] = useState('');
  const [nutritionInfo, setNutritionInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [summary, setSummary] = useState('');

  const fetchNutritionInfo = async (scannedBarcode) => {
    setLoading(true);
    try {
      const appId = 'b10c957d'; // Replace
      const appKey = '6d8c7c707b7f74d11e9bfadb1324d3e6'; // Replace

      const response = await fetch(`https://trackapi.nutritionix.com/v2/search/item?upc=${scannedBarcode}`, {
        method: 'GET',
        headers: {
          'x-app-id': appId,
          'x-app-key': appKey,
          'x-remote-user-id': '0'
        }
      });

      const data = await response.json();
      if (data.foods && data.foods.length > 0) {
        setNutritionInfo(data.foods[0]);
        await fetchSummary(data.foods[0]);
      } else {
        Alert.alert('Not Found', 'No nutrition information found for this product.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch nutrition info');
    }
    setLoading(false);
  };

  const fetchSummary = async (foodData) => {
    try {
      const prompt = `
      Give a short summary of nutritional values for the following food:
      Name: ${foodData.food_name}
      Calories: ${foodData.nf_calories}
      Fat: ${foodData.nf_total_fat}g
      Protein: ${foodData.nf_protein}g
      Sugar: ${foodData.nf_sugars}g
      Fiber: ${foodData.nf_dietary_fiber}g
      Give a short fitness or diet tip related to this food.
      `;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GeminiAPI_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setSummary(generatedText || 'No summary available.');
    } catch (error) {
      console.error(error);
    }
  };

  const saveToFirestore = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Login required', 'Please login to save data.');
      return;
    }

    try {
      const nutritionRef = collection(db, 'users', user.uid, 'scannedProducts');
      await addDoc(nutritionRef, {
        productName: nutritionInfo.food_name,
        calories: nutritionInfo.nf_calories,
        fat: nutritionInfo.nf_total_fat,
        protein: nutritionInfo.nf_protein,
        sugar: nutritionInfo.nf_sugars,
        date: new Date().toISOString(),
        summary: summary,
      });
      Alert.alert('Success', 'Product saved to your history!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save product');
    }
  };

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Please grant camera roll permissions inside your settings');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      // In future OCR implementation
    }
  };

  const handleManualEntry = () => {
    if (barcode.length === 0) {
      Alert.alert('Enter barcode');
      return;
    }
    fetchNutritionInfo(barcode);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter barcode manually"
          value={barcode}
          onChangeText={setBarcode}
          keyboardType="number-pad"
        />
        <Button title="Search" onPress={handleManualEntry} color="#6200ee" />
      </View>

      <View style={{ marginVertical: 10 }}>
        <Button title="Upload Image (optional)" onPress={pickImage} color="#03dac5" />
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>

      {loading && <ActivityIndicator size="large" color="#6200ee" />}

      {nutritionInfo && (
        <View style={styles.result}>
          <Text style={styles.title}>{nutritionInfo.food_name}</Text>
          <Text>Calories: {nutritionInfo.nf_calories}</Text>
          <Text>Fat: {nutritionInfo.nf_total_fat} g</Text>
          <Text>Protein: {nutritionInfo.nf_protein} g</Text>
          <Text>Sugar: {nutritionInfo.nf_sugars} g</Text>

          <Button title="Save to Firestore" onPress={saveToFirestore} color="#3700b3" />

          {summary ? (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Gemini AI Summary:</Text>
              <Text>{summary}</Text>
            </View>
          ) : null}

          {/* Chart */}
          <PieChart
            data={[
              {
                name: 'Fat',
                population: nutritionInfo.nf_total_fat,
                color: '#f44336',
                legendFontColor: '#333',
                legendFontSize: 12,
              },
              {
                name: 'Protein',
                population: nutritionInfo.nf_protein,
                color: '#4caf50',
                legendFontColor: '#333',
                legendFontSize: 12,
              },
              {
                name: 'Sugar',
                population: nutritionInfo.nf_sugars,
                color: '#2196f3',
                legendFontColor: '#333',
                legendFontSize: 12,
              },
            ]}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      )}
    </ScrollView>
  );
};

export default BarcodeScannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  input: {
    borderWidth: 1,
    borderColor: '#6200ee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 12,
  },
  result: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#6200ee',
    textAlign: 'center',
  },
  summaryBox: {
    marginTop: 10,
    backgroundColor: '#f1f8e9',
    padding: 10,
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  }
});
