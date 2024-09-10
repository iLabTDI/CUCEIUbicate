import * as React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import jsonData from "../../../assets/jsons/medical_services.json";

export const Medical_services = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{jsonData.section_description.name}</Text>
        <Text style={styles.text}>{jsonData.section_description.description}</Text>
      </View>
      {Object.keys(jsonData.section_description.sub_sections).map((sectionId) => {
        const section = jsonData.section_description.sub_sections[sectionId];
        return (
          <View key={sectionId} style={styles.card}>
            <Text style={styles.title}>{section.title}</Text>
            {Object.keys(section["listed-elements"]).map((elementId) => (
              <Text key={elementId} style={styles.text}>
                {section["listed-elements"][elementId]}
              </Text>
            ))}
          </View>
        );
      })}
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
});
