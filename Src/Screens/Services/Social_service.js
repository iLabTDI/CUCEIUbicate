import * as React from "react";
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import jsonData from "../../../assets/jsons/social_service.json";

const isURL = (text) => {
  const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
  return urlPattern.test(text);
};

const renderElement = (element, index) => {
  if (Array.isArray(element)) {
    return element.map((item, idx) => renderElement(item, idx));
  } else if (typeof element === 'string') {
    return isURL(element) ? (
      <TouchableOpacity key={index} onPress={() => Linking.openURL(element)}>
        <Text style={styles.link}>{element}</Text>
      </TouchableOpacity>
    ) : (
      <Text key={index} style={styles.text}>{element}</Text>
    );
  } else if (typeof element === 'object') {
    return Object.keys(element).map((key) => renderElement(element[key], key));
  }
  return null;
};

export const Social_service = () => {
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
            {section.content && renderElement(section.content)}
            {section["listed-elements"] && Object.keys(section["listed-elements"]).map((elementId) => {
              const element = section["listed-elements"][elementId];
              return renderElement(element, elementId);
            })}
            {section["mini-subsections"] && Object.keys(section["mini-subsections"]).map((subsectionId) => {
              const subsection = section["mini-subsections"][subsectionId];
              return (
                <View key={subsectionId}>
                  <Text style={styles.title}>{subsection.title}</Text>
                  {subsection.content && renderElement(subsection.content)}
                  {subsection["listed-elements"] && Object.keys(subsection["listed-elements"]).map((elementId) => {
                    const element = subsection["listed-elements"][elementId];
                    return renderElement(element, elementId);
                  })}
                </View>
              );
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


