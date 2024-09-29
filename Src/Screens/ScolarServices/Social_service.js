import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Linking, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Dimensions
} from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLink, faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import * as FileSystem from 'expo-file-system';

// Obtener el ancho de la pantalla para cálculos de estilo responsivos
const { width } = Dimensions.get('window');

// Ruta del archivo JSON local
const jsonFilePath = `${FileSystem.documentDirectory}social_service.json`;
// URL de la API para obtener los datos del servicio social
const socialServiceUrl = "http://148.202.152.59:8001/json/social_service";

// Función para verificar si un texto es una URL válida
const isURL = (text) => {
  const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
  return urlPattern.test(text);
};

// Función recursiva para renderizar elementos del JSON
const renderElement = (element, index) => {
  if (Array.isArray(element)) {
    return element.map((item, idx) => renderElement(item, `${index}-${idx}`));
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
    return Object.keys(element).map((key) => renderElement(element[key], `${index}-${key}`));
  }
  return null;
};

export const Social_service = () => {
  // Estado para almacenar los datos del JSON
  const [jsonData, setJsonData] = useState(null);
  // Estado para controlar la visualización del indicador de carga
  const [isLoading, setIsLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(null);

  // Función para descargar y guardar el JSON
  const downloadJson = async () => {
    console.log(`Descargando desde ${socialServiceUrl}...`);
    try {
      setIsLoading(true);
      // Verifica si el archivo existe y lo borra antes de la descarga
      const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(jsonFilePath);
      }

      const response = await fetch(socialServiceUrl);
      if (!response.ok) {
        throw new Error(`Error al descargar desde ${socialServiceUrl}`);
      }

      const json = await response.json();
      await FileSystem.writeAsStringAsync(jsonFilePath, JSON.stringify(json));
      console.log(`Archivo guardado en: ${jsonFilePath}`);
      setJsonData(json);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      setError(error.message);

      // Si hay un error, intenta cargar el archivo existente si está disponible
      const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
      if (fileInfo.exists) {
        console.log(`Usando archivo existente en: ${jsonFilePath}`);
        try {
          const json = await FileSystem.readAsStringAsync(jsonFilePath);
          setJsonData(JSON.parse(json));
        } catch (readError) {
          console.error("Error al leer el archivo:", readError);
          setError(`No se pudo leer el archivo: ${readError.message}`);
        }
      } else {
        console.log(`No se pudo descargar y el archivo no existe: ${jsonFilePath}`);
        setError(`No se pudo obtener el archivo: ${jsonFilePath}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para descargar los datos al montar el componente
  useEffect(() => {
    downloadJson();
  }, []);

  // Renderiza el indicador de carga mientras se obtienen los datos
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0b34b0" />
        <Text style={styles.loadingText}>Cargando servicio social...</Text>
      </View>
    );
  }

  // Renderiza un mensaje de error si ocurrió algún problema
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesomeIcon icon={faExclamationTriangle} size={50} color="#e74c3c" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Renderiza el contenido principal
  return (
    <ScrollView style={styles.container}>
      {Object.keys(jsonData.section_description["sub-sections"]).map((sectionId) => {
        const section = jsonData.section_description["sub-sections"][sectionId];
        return (
          <View key={sectionId} style={styles.card}>
            <View style={styles.sectionHeader}>
              {/* <FontAwesomeIcon icon={faCheckCircle} size={24} color="#0b34b0" /> */}
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {section.content && renderElement(section.content, `content-${sectionId}`)}
            {section["listed-elements"] && Object.keys(section["listed-elements"]).map((elementId) => {
              const element = section["listed-elements"][elementId];
              return (
                <View key={elementId} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <View style={styles.listItemContent}>
                    {renderElement(element, `listed-${sectionId}-${elementId}`)}
                  </View>
                </View>
              );
            })}
            {section["mini-subsections"] && Object.keys(section["mini-subsections"]).map((subsectionId) => {
              const subsection = section["mini-subsections"][subsectionId];
              return (
                <View key={subsectionId} style={styles.subsection}>
                  <Text style={styles.subsectionTitle}>{subsection.title}</Text>
                  {subsection.content && renderElement(subsection.content, `subsection-content-${subsectionId}`)}
                  {subsection["listed-elements"] && Object.keys(subsection["listed-elements"]).map((elementId) => {
                    const element = subsection["listed-elements"][elementId];
                    return (
                      <View key={elementId} style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <View style={styles.listItemContent}>
                          {renderElement(element, `subsection-listed-${subsectionId}-${elementId}`)}
                        </View>
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
    backgroundColor: '#f0f2f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0b34b0',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  errorText: {
    marginTop: 20,
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 20,
    borderRadius: 12,
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
    flex: 1,
  },
  subsection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 15,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  link: {
    fontSize: 16,
    color: '#0b34b0',
    textDecorationLine: 'underline',
    marginLeft: 8,
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 10,
  },
  bullet: {
    fontSize: 16,
    color: '#0b34b0',
    marginRight: 5,
  },
  listItemContent: {
    flex: 1,
  },
});

export default Social_service;