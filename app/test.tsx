import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function TestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FinTrack - Test Page</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>This is a test page</Text>
        <Text style={styles.cardText}>Testing Expo Router</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  cardText: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 8,
  }
});