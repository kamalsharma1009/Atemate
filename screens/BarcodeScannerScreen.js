import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BarcodeScannerScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Barcode Scanner</Text>
    </View>
  );
};

export default BarcodeScannerScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 22, fontWeight: 'bold' },
});
