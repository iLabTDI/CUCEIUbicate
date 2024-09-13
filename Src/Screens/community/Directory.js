import * as React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFolder, faList } from '@fortawesome/free-solid-svg-icons';
import jsonData from "../../../assets/jsons/cid.json";

const { width } = Dimensions.get('window');

export const Directory = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesomeIcon icon={faFolder} size={24} color="#fff" />
        <Text style={styles.headerText}>Directorio</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{jsonData.section_description.name}</Text>
          <Text style={styles.descriptionText}>{jsonData.section_description.description}</Text>
        </View>
        {Object.keys(jsonData.section_description.sub_sections).map((sectionId) => {
          const section = jsonData.section_description.sub_sections[sectionId];
          return (
            <View key={sectionId} style={styles.card}>
              <View style={styles.sectionHeader}>
                <FontAwesomeIcon icon={faList} size={20} color="#0b34b0" />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              {Object.keys(section["listed-elements"]).map((elementId) => (
                <Text key={elementId} style={styles.elementText}>
                  • {section["listed-elements"][elementId]}
                </Text>
              ))}
            </View>
          );
        })}
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginLeft: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 10,
  },
  elementText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 8,
    paddingLeft: 15,
  },
});

export default Directory;