import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity, ActivityIndicator } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import * as FileSystem from 'expo-file-system';

const jsonFilePath = `${FileSystem.documentDirectory}social_service.json`;
const socialServiceUrl = "http://148.202.152.59:8001/json/social_service";

const isURL = (text) => {
  const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
  return urlPattern.test(text);
};

const renderElement = (element, index) => {
  if (Array.isArray(element)) {
    return element.map((item, idx) => renderElement(item, idx));
  } else if (typeof element === 'string') {
    return isURL(element) ? (
      <TouchableOpacity key={index} onPress={() => Linking.openURL(element)} style={styles.linkContainer}>
        <FontAwesomeIcon icon={faLink} size={16} color="#0b34b0" />
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
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null); // Nuevo estado para manejar errores

  const downloadJson = async () => {
    console.log(`Descargando desde ${socialServiceUrl}...`);
    try {
      const response = await fetch(socialServiceUrl);
      if (!response.ok) {
        throw new Error(`Error al descargar desde ${socialServiceUrl}`);
      }

      const json = await response.json();
      await FileSystem.writeAsStringAsync(jsonFilePath, JSON.stringify(json));
      console.log(`Archivo guardado en: ${jsonFilePath}`);
      setJsonData(json); // Establece los datos JSON
      setError(null); // Reinicia el error si la descarga es exitosa

      // Eliminar el archivo viejo solo después de guardar el nuevo con éxito
      const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(jsonFilePath);
      }
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      setError("Sin conexión a internet"); // Establece el mensaje de error

      // Si hay un error, intenta cargar el archivo existente si está disponible
      try {
        const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
        if (fileInfo.exists) {
          console.log(`Usando archivo existente en: ${jsonFilePath}`);
          const json = await FileSystem.readAsStringAsync(jsonFilePath);
          setJsonData(JSON.parse(json)); // Establece los datos JSON
          setError(null); // Reinicia el error si se pueden leer los datos locales
        } else {
          console.log(`No se pudo descargar y el archivo no existe: ${jsonFilePath}`);
          // Mantiene el mensaje de error existente
        }
      } catch (readError) {
        console.error("Error al leer el archivo:", readError);
        setError("No se pudo leer el archivo local"); // Actualiza el mensaje de error
      }
    }
  };

  useEffect(() => {
    downloadJson(); // Inicia la descarga y verificación
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!jsonData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0b34b0" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {Object.keys(jsonData.section_description["sub-sections"]).map((sectionId) => {
        const section = jsonData.section_description["sub-sections"][sectionId];
        return (
          <View key={sectionId} style={styles.card}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.content && renderElement(section.content)}
            {section["listed-elements"] && Object.keys(section["listed-elements"]).map((elementId) => {
              const element = section["listed-elements"][elementId];
              return (
                <View key={elementId}>
                  {renderElement(element, elementId)}
                </View>
              );
            })}
            {section["mini-subsections"] && Object.keys(section["mini-subsections"]).map((subsectionId) => {
              const subsection = section["mini-subsections"][subsectionId];
              return (
                <View key={subsectionId} style={styles.subsection}>
                  <Text style={styles.subsectionTitle}>{subsection.title}</Text>
                  {subsection.content && renderElement(subsection.content)}
                  {subsection["listed-elements"] && Object.keys(subsection["listed-elements"]).map((elementId) => {
                    const element = subsection["listed-elements"][elementId];
                    return (
                      <View key={elementId}>
                        {renderElement(element, elementId)}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  subsection: {
    marginTop: 15,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginBottom: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: { // Estilos para el mensaje de error
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  errorText: { // Estilos para el texto de error
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default Social_service;
