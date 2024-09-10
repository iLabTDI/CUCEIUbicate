import * as React from "react";
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import jsonData from "../../../assets/jsons/scholar_services.json";

// Regex para las urls
const isURL = (text) => {
  const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
  return urlPattern.test(text);
};
export const School_services = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.title}>{jsonData.section_description.name}</Text>
      </View>
      {Object.keys(jsonData.section_description["sub-sections"]).map((sectionId) => {
        const section = jsonData.section_description["sub-sections"][sectionId];
        return (
          <View key={sectionId} style={styles.card}>
            <Text style={styles.title}>{section.title}</Text>
            {Object.keys(section["listed-elements"]).map((elementId) => {
              const element = section["listed-elements"][elementId];
              if (Array.isArray(element)) {
                return element.map((item, index) => (
                  <Text key={index} style={styles.text}>
                    {isURL(item) ? (
                      <TouchableOpacity onPress={() => Linking.openURL(item)}>
                        <Text style={styles.link}>{item}</Text>
                      </TouchableOpacity>
                    ) : (
                      item
                    )}
                  </Text>
                ));
              } else {
                return (
                  <Text key={elementId} style={styles.text}>
                    {isURL(element) ? (
                      <TouchableOpacity onPress={() => Linking.openURL(element)}>
                        <Text style={styles.link}>{element}</Text>
                      </TouchableOpacity>
                    ) : (
                      element
                    )}
                  </Text>
                );
              }
            })}
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
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
