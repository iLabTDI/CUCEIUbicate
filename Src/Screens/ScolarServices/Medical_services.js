import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import * as FileSystem from 'expo-file-system';

const jsonFilePath = `${FileSystem.documentDirectory}medical_services.json`;
const medicalServicesUrl = "http://148.202.152.59:8001/json/medical_services";

export const Medical_services = () => {
  const [jsonData, setJsonData] = useState(null);

  const downloadJson = async () => {
    try {
      // Verifica si el archivo existe y lo borra antes de la descarga
      const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(jsonFilePath);
      }

      const response = await fetch(medicalServicesUrl);
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const json = await response.json();
      if (!json || typeof json !== 'object') {
        throw new Error('Respuesta JSON no válida');
      }

      await FileSystem.writeAsStringAsync(jsonFilePath, JSON.stringify(json));
      setJsonData(json); // Establece los datos JSON
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      Alert.alert("Error de descarga", error.toString());

      // Intenta cargar el archivo existente si está disponible
      try {
        const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
        if (fileInfo.exists) {
          const json = await FileSystem.readAsStringAsync(jsonFilePath);
          setJsonData(JSON.parse(json));
        } else {
          Alert.alert("Error", "No hay datos locales disponibles.");
        }
      } catch (readError) {
        console.error("Error al leer el archivo:", readError);
        Alert.alert("Error de lectura", readError.toString());
      }
    }
  };

  useEffect(() => {
    downloadJson(); // Inicia la descarga y verificación
  }, []);

  if (!jsonData || !jsonData.section_description) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0b34b0" />
        <Text style={styles.loadingText}>Cargando servicios médicos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.descriptionText}>{jsonData.section_description.description}</Text>
      </View>
      {jsonData.section_description.sub_sections && Object.keys(jsonData.section_description.sub_sections).map((sectionId) => {
        const section = jsonData.section_description.sub_sections[sectionId];
        return (
          <View key={sectionId} style={styles.card}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section["listed-elements"] && Object.keys(section["listed-elements"]).map((elementId) => (
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#0b34b0",
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
