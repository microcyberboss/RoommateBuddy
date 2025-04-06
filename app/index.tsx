import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>FinTrack</Text>
      <Text style={styles.subtitle}>Roommate Expense Tracking</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>Version: 1.0.0</Text>
        <Text style={styles.cardText}>Track expenses with your roommates</Text>
        <Text style={styles.cardText}>Split bills easily</Text>
        <Text style={styles.cardText}>See who owes what</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#075985',
    marginBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 8,
    textAlign: 'center',
  }
});
