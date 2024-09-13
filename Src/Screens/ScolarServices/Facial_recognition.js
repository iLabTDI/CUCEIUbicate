import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from "react-native";
import jsonData from "../../../assets/jsons/face_access.json";

export const Facial_recognition = () => {
  return (
    <View style={styles.container}>
        <View style={styles.card}>
            <Text style={styles.title}>{jsonData["section-description"].name}</Text>
            <Text style={styles.text}>{jsonData["section-description"].description}</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  link: {
    color: "blue",
    marginTop: 10,
  },
});
