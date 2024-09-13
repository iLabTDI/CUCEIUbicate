import * as React from "react";
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLink, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import jsonData from "../../../assets/jsons/scholar_services.json";

const isURL = (text) => {
  const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
  return urlPattern.test(text);
};

export const School_services = () => {
  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>{jsonData.section_description.name}</Text>
      </View> */}
      {Object.keys(jsonData.section_description["sub-sections"]).map((sectionId) => {
        const section = jsonData.section_description["sub-sections"][sectionId];
        return (
          <View key={sectionId} style={styles.card}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {Object.keys(section["listed-elements"]).map((elementId) => {
              const element = section["listed-elements"][elementId];
              if (Array.isArray(element)) {
                return element.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <FontAwesomeIcon icon={faChevronRight} size={12} color="#0b34b0" style={styles.listIcon} />
                    {isURL(item) ? (
                      <TouchableOpacity onPress={() => Linking.openURL(item)} style={styles.linkContainer}>
                        <FontAwesomeIcon icon={faLink} size={16} color="#0b34b0" />
                        <Text style={styles.link}>{item}</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.text}>{item}</Text>
                    )}
                  </View>
                ));
              } else {
                return (
                  <View key={elementId} style={styles.listItem}>
                    <FontAwesomeIcon icon={faChevronRight} size={12} color="#0b34b0" style={styles.listIcon} />
                    {isURL(element) ? (
                      <TouchableOpacity onPress={() => Linking.openURL(element)} style={styles.linkContainer}>
                        <FontAwesomeIcon icon={faLink} size={16} color="#0b34b0" />
                        <Text style={styles.link}>{element}</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.text}>{element}</Text>
                    )}
                  </View>
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
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0b34b0',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginBottom: 15,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'justify',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  link: {
    flex: 1,
    fontSize: 16,
    color: '#0b34b0',
    textDecorationLine: 'underline',
    marginLeft: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listIcon: {
    marginRight: 8,
    marginTop: 5,
  },
});

export default School_services;