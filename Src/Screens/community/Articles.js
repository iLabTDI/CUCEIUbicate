import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking, Dimensions, Alert } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import * as FileSystem from "expo-file-system";

const { width } = Dimensions.get('window');

const jsonFilePath = `${FileSystem.documentDirectory}assets/jsons/articles.json`;
const articlesUrl = "http://148.202.152.59:8001/articles";

export const Articles = () => {
  const [jsonData, setJsonData] = useState(null);

  // Función para descargar el archivo JSON
  const downloadJson = async () => {
    console.log(`Descargando desde ${articlesUrl}...`);
    try {
      // Verifica si el archivo existe y lo borra antes de la descarga
      const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(jsonFilePath);
      }

      const response = await fetch(articlesUrl);
      if (!response.ok) {
        throw new Error(`Error al descargar desde ${articlesUrl}`);
      }

      const json = await response.json();
      await FileSystem.writeAsStringAsync(jsonFilePath, JSON.stringify(json));
      console.log(`Archivo guardado en: ${jsonFilePath}`);
      setJsonData(json); // Establece los datos JSON
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      Alert.alert("Error", `No se pudo descargar el archivo: ${jsonFilePath}`);
      
      // Si hay un error, intenta cargar el archivo existente si está disponible
      const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
      if (fileInfo.exists) {
        console.log(`Usando archivo existente en: ${jsonFilePath}`);
        try {
          const json = await FileSystem.readAsStringAsync(jsonFilePath);
          setJsonData(JSON.parse(json)); // Establece los datos JSON
        } catch (readError) {
          console.error("Error al leer el archivo:", readError);
          Alert.alert("Error", `No se pudo leer el archivo: ${jsonFilePath}`);
        }
      } else {
        console.log(`No se pudo descargar y el archivo no existe: ${jsonFilePath}`);
        Alert.alert("Error", `No se pudo obtener el archivo: ${jsonFilePath}`);
      }
    }
  };

  useEffect(() => {
    downloadJson(); // Inicia la descarga y verificación
  }, []);

  if (!jsonData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{jsonData.section_description.name}</Text>
          {jsonData.section_description.description.map((desc, index) => (
            <Text key={index} style={styles.descriptionText}>{desc}</Text>
          ))}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL(jsonData.section_description.description[2])}
          >
            <Text style={styles.linkButtonText}>Ver Ley</Text>
            <FontAwesomeIcon icon={faExternalLinkAlt} size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        {Object.keys(jsonData.artículos).map((articuloId) => (
          <View key={articuloId} style={styles.card}>
            <Text style={styles.articleTitle}>Artículo {articuloId}</Text>
            {jsonData.artículos[articuloId].incisos.map((inciso, index) => (
              <Text key={index} style={styles.articleText}>{inciso}</Text>
            ))}
          </View>
        ))}
      </View>
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 10,
  },
  linkButton: {
    backgroundColor: '#0b34b0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginBottom: 15,
  },
  articleText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 10,
  },
});

export default Articles;
