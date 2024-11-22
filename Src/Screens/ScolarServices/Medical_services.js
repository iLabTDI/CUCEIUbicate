import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from "react-native";
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

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

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
          <FontAwesomeIcon icon={faHospital} size={isTablet ? 32 : 24} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Servicios Médicos</Text>
        </LinearGradient>
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.description}>{medicalServicesData.section_description.description}</Text>
          </View>
          {medicalServicesData.section_description["sub-sections"] &&
            Object.entries(medicalServicesData.section_description["sub-sections"]).map(
              ([sectionId, section]) => (
                <View key={`section-${sectionId}`} style={styles.card}>
                  <View style={styles.sectionHeader}>
                    <FontAwesomeIcon icon={getIcon(parseInt(sectionId))} size={isTablet ? 28 : 24} color="#0b34b0" />
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
        </View>
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
    padding: isTablet ? 30 : 20,
    borderBottomLeftRadius: isTablet ? 30 : 20,
    borderBottomRightRadius: isTablet ? 30 : 20,
  },
  headerTitle: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: isTablet ? 15 : 10,
  },
  content: {
    padding: isTablet ? 24 : 16,
    maxWidth: isTablet ? 800 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginBottom: isTablet ? 24 : 20,
    padding: isTablet ? 24 : 20,
    borderRadius: isTablet ? 16 : 10,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  description: {
    fontSize: isTablet ? 18 : 16,
    color: '#333333',
    lineHeight: isTablet ? 28 : 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet ? 20 : 15,
  },
  sectionTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginLeft: isTablet ? 15 : 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet ? 15 : 10,
  },
  listItemText: {
    fontSize: isTablet ? 18 : 16,
    color: '#333',
    marginLeft: isTablet ? 15 : 10,
    flex: 1,
  },
});

export default Medical_services;