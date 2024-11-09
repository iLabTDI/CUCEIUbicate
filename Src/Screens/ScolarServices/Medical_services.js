import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faHospital, 
  faUserMd, 
  faProcedures,
  faFirstAid
} from '@fortawesome/free-solid-svg-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Import the static JSON data
import medicalServicesData from '../../../json/medical_services.json';

export const Medical_services = () => {
  const getIcon = (sectionId) => {
    const icons = {
      1: faUserMd,
      2: faProcedures,
      3: faFirstAid
    };
    return icons[sectionId] || faHospital;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={['#0056b3', '#007bff']}
          style={styles.header}
        >
          <FontAwesomeIcon icon={faHospital} size={24} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Servicios Médicos</Text>
        </LinearGradient>
        <View style={styles.card}>
          <Text style={styles.description}>{medicalServicesData.section_description.description}</Text>
        </View>
        {medicalServicesData.section_description["sub-sections"] &&
          Object.entries(medicalServicesData.section_description["sub-sections"]).map(
            ([sectionId, section]) => (
              <View key={`section-${sectionId}`} style={styles.card}>
                <View style={styles.sectionHeader}>
                  <FontAwesomeIcon icon={getIcon(parseInt(sectionId))} size={24} color="#0b34b0" />
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
                {section["listed-elements"] &&
                  Object.entries(section["listed-elements"]).map(
                    ([elementId, element]) => (
                      <View key={`element-${sectionId}-${elementId}`} style={styles.listItem}>
                        <Text style={styles.listItemText}>• {element}</Text>
                      </View>
                    )
                  )}
              </View>
            )
          )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    margin: 10,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  description: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
});

export default Medical_services;