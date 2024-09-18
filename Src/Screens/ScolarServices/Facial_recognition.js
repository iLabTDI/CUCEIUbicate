import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import jsonData from '../../../assets/jsons/face_access.json';

export const Facial_recognition = () => {
  return (
    <View style={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>{jsonData["section-description"].name}</Text>
        <Text style={styles.descriptionText}>
          {jsonData["section-description"].description}
        </Text>
      </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});