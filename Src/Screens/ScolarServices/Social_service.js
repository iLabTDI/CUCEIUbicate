import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity } from "react-native";
import * as FileSystem from "expo-file-system";
import { ScrollView } from "react-native-gesture-handler";
import { ErrorComponent } from "../Components/ErrorComponent";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faHandshake, 
  faGraduationCap, 
  faClipboardList, 
  faChevronRight,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { LinearGradient } from 'expo-linear-gradient';

const jsonFilePath = `${FileSystem.documentDirectory}social_service.json`;
const socialServiceUrl = "http://148.202.152.59:8001/json/social_service";

export const Social_service = () => {
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
      setError("No se pudo cargar el Servicio Social. Por favor, verifica tu conexión a internet e intenta nuevamente.");
    }
  };

  const downloadJson = async () => {
    setIsRefreshing(true);
    try {
      console.log(`Descargando desde ${socialServiceUrl}...`);
      const response = await fetch(socialServiceUrl);
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const json = await response.json();

      await FileSystem.writeAsStringAsync(jsonFilePath, JSON.stringify(json));
      setJsonData(json);
      setError(null);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      setError("No se pudo descargar el Servicio Social. Por favor, verifica tu conexión a internet e intenta nuevamente.");
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
        <FontAwesomeIcon icon={faSpinner} size={40} color="#0056b3" spin />
        <Text style={styles.loadingText}>Cargando Servicio Social...</Text>
      </View>
    );
  }

  const getIcon = (sectionId) => {
    const icons = {
      1: faHandshake,
      2: faGraduationCap,
      3: faClipboardList,
      default: faHandshake
    };
    return icons[sectionId] || icons.default;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={['#0056b3', '#007bff']}
          style={styles.header}
        >
          <FontAwesomeIcon icon={faHandshake} size={24} color="#fff" />
          <Text style={styles.headerTitle}>Servicio Social</Text>
        </LinearGradient>
        {Object.keys(jsonData.section_description["sub-sections"]).map((sectionId) => {
          const section = jsonData.section_description["sub-sections"][sectionId];
          return (
            <View key={sectionId} style={styles.card}>
              <View style={styles.sectionHeader}>
                <FontAwesomeIcon icon={getIcon(sectionId)} size={24} color="#0056b3" />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              {section.content && <Text style={styles.content}>{section.content}</Text>}
              {section["listed-elements"] && Object.keys(section["listed-elements"]).map((elementId) => {
                const element = section["listed-elements"][elementId];
                return (
                  <View key={elementId} style={styles.listItem}>
                    <FontAwesomeIcon icon={faChevronRight} size={14} color="#0056b3" />
                    <Text style={styles.listItemText}>{element}</Text>
                  </View>
                );
              })}
              {section["mini-subsections"] && Object.keys(section["mini-subsections"]).map((subsectionId) => {
                const subsection = section["mini-subsections"][subsectionId];
                return (
                  <View key={subsectionId} style={styles.miniSubsection}>
                    <Text style={styles.miniSubsectionTitle}>{subsection.title}</Text>
                    {subsection.content && <Text style={styles.content}>{subsection.content}</Text>}
                    {subsection["listed-elements"] && Object.keys(subsection["listed-elements"]).map((elementId) => {
                      const element = subsection["listed-elements"][elementId];
                      return (
                        <View key={elementId} style={styles.listItem}>
                          {/* <FontAwesomeIcon icon={faChevronRight} size={14} color="#0056b3" /> */}
                          <Text style={styles.listItemText}>{element}</Text>
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          );
        })}
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
    color: '#fff',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0056b3',
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000000',
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
    color: '#0056b3',
    marginLeft: 10,
  },
  content: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 24,
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
  miniSubsection: {
    marginTop: 15,
    marginLeft: 15,
  },
  miniSubsectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: 10,
  },
});

export default Social_service;