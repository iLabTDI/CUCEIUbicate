import * as React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import jsonData from "../../../assets/jsons/medical_services.json";

export const Medical_services = () => {
  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>{jsonData.section_description.name}</Text>
      </View> */}
      <View style={styles.card}>
        <Text style={styles.descriptionText}>{jsonData.section_description.description}</Text>
      </View>
      {Object.keys(jsonData.section_description.sub_sections).map((sectionId) => {
        const section = jsonData.section_description.sub_sections[sectionId];
        return (
          <View key={sectionId} style={styles.card}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {Object.keys(section["listed-elements"]).map((elementId) => (
              <View key={elementId} style={styles.listItem}>
                <FontAwesomeIcon icon={faChevronRight} size={12} color="#0b34b0" style={styles.listIcon} />
                <Text style={styles.text}>
                  {section["listed-elements"][elementId]}
                </Text>
              </View>
            ))}
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
  descriptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'justify',
    lineHeight: 24,
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
  text: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: 'justify',
    lineHeight: 24,
  },
});

export default Medical_services;