import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from "react-native";
import * as FileSystem from "expo-file-system";
import { ScrollView } from "react-native-gesture-handler";
import { ErrorComponent } from "../Components/ErrorComponent";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faHospital, 
  faUserMd, 
  faProcedures,
} from '@fortawesome/free-solid-svg-icons';
import { LinearGradient } from 'expo-linear-gradient';

const jsonFilePath = `${FileSystem.documentDirectory}medical_services.json`;
const medicalServicesUrl = "http://148.202.152.59:8001/json/medical_services";

export const Medical_services = () => {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadJson = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
      if (fileInfo.exists) {
        console.log(`Cargando archivo existente en: ${jsonFilePath}`);
        const json = await FileSystem.readAsStringAsync(jsonFilePath);
        setJsonData(JSON.parse(json));
        setError(null);
      } else {
        await downloadJson();
      }
    } catch (error) {
      console.error("Error al cargar o descargar el archivo:", error);
      setError("No se pudo cargar los Servicios Médicos. Por favor, verifica tu conexión a internet e intenta nuevamente.");
    }
  };

  const downloadJson = async () => {
    setIsRefreshing(true);
    try {
      console.log(`Descargando desde ${medicalServicesUrl}...`);
      const response = await fetch(medicalServicesUrl);
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const json = await response.json();

      await FileSystem.writeAsStringAsync(jsonFilePath, JSON.stringify(json));
      setJsonData(json);
      setError(null);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      setError("No se pudo descargar los Servicios Médicos. Por favor, verifica tu conexión a internet e intenta nuevamente.");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadJson();
  }, []);

  if (error) {
    return (
      <ErrorComponent
        title="Error de carga"
        message={error}
        buttonText="Reintentar"
        onRetry={downloadJson}
      />
    );
  }

  if (!jsonData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0056b3" />
        <Text style={styles.loadingText}>Cargando Servicios Médicos...</Text>
      </View>
    );
  }

  const getIcon = (sectionId) => {
    const icons = {
      1: faUserMd,
      2: faProcedures,
    };
    return icons[sectionId];
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
          <Text style={styles.description}>{jsonData.section_description.description}</Text>
        </View>
        {jsonData.section_description["sub-sections"] &&
          Object.entries(jsonData.section_description["sub-sections"]).map(
            ([sectionId, section]) => (
              <View key={`section-${sectionId}`} style={styles.card}>
                <View style={styles.sectionHeader}>
                  <FontAwesomeIcon icon={getIcon(sectionId)} size={24} color="#0b34b0" />
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
                {section["listed-elements"] &&
                  Object.entries(section["listed-elements"]).map(
                    ([elementId, element]) => (
                      <View key={`element-${sectionId}-${elementId}`} style={styles.listItem}>
                        <Text style={styles.listItemText}>{element}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#0056b3",
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