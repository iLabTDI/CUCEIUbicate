import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from "react-native";
import jsonData from "../../../assets/jsons/articles.json";

export const Articles = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{jsonData.section_description.name}</Text>
        {jsonData.section_description.description.map((desc, index) => (
          <Text key={index} style={styles.text}>{desc}</Text>
        ))}
        <TouchableOpacity onPress={() => Linking.openURL(jsonData.section_description.description[2])}>
          <Text style={styles.link}>Ver Ley</Text>
        </TouchableOpacity>
      </View>
      {Object.keys(jsonData.artículos).map((articuloId) => (
        <View key={articuloId} style={styles.card}>
          <Text style={styles.title}>Artículo {articuloId}</Text>
          {jsonData.artículos[articuloId].incisos.map((inciso, index) => (
            <Text key={index} style={styles.text}>{inciso}</Text>
          ))}
        </View>
      ))}
    </ScrollView>
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
