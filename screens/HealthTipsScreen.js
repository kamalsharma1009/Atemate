import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HealthTipsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Health Tips</Text>
    </View>
  );
};

export default HealthTipsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 22, fontWeight: 'bold' },
});
