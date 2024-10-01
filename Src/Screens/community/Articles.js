import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Linking, 
  Dimensions, 
  Alert,
  ActivityIndicator
} from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faExternalLinkAlt, faBook } from '@fortawesome/free-solid-svg-icons';
import * as FileSystem from "expo-file-system";

const { width } = Dimensions.get('window');

// Ruta del archivo JSON local
const jsonFilePath = `${FileSystem.documentDirectory}articles.json`;
// URL de la API para obtener los artículos
const articlesUrl = "http://148.202.152.59:8001/json/articles";

export const Articles = () => {
  // Estado para almacenar los datos de los artículos
  const [jsonData, setJsonData] = useState(null);
  // Estado para controlar la visualización del indicador de carga
  const [isLoading, setIsLoading] = useState(true);

  // Función para descargar el archivo JSON
  const downloadJson = async () => {
    console.log(`Descargando desde ${articlesUrl}...`);
    try {
      setIsLoading(true);
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
      // Alert.alert("Error", `No se pudo descargar el archivo: ${error.message}`);
      
      // Si hay un error, intenta cargar el archivo existente si está disponible
      const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
      if (fileInfo.exists) {
        console.log(`Usando archivo existente en: ${jsonFilePath}`);
        try {
          const json = await FileSystem.readAsStringAsync(jsonFilePath);
          setJsonData(JSON.parse(json)); // Establece los datos JSON
        } catch (readError) {
          console.error("Error al leer el archivo:", readError);
          // Alert.alert("Error", `No se pudo leer el archivo: ${readError.message}`);
        }
      } else {
        console.log(`No se pudo descargar y el archivo no existe: ${jsonFilePath}`);
        // Alert.alert("Error", "Sin conexión a internet"); // Modificación aquí
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para descargar los datos al montar el componente
  useEffect(() => {
    downloadJson(); // Inicia la descarga y verificación
  }, []);

  // Función para abrir enlaces externos
  const openExternalLink = (url) => {
    Linking.openURL(url).catch((err) => console.error('Error al abrir el enlace:', err));
  };

  // Renderiza el indicador de carga mientras se obtienen los datos
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0b34b0" />
        <Text style={styles.loadingText}>Cargando artículos...</Text>
      </View>
    );
  }

  // Renderiza un mensaje de error si no se pudieron obtener los datos
  if (!jsonData)  {
    return (
      <ErrorComponent
        title="Sin conexión a internet"
        message="No se pudo cargar los articulos. Por favor, verifica tu conexión a internet e intenta nuevamente."
        buttonText="Reintentar"
        onRetry={downloadJson} // Llamar a downloadJson al presionar el botón
      />
    );
  }

  // Renderiza el contenido principal
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Sección de descripción */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesomeIcon icon={faBook} size={24} color="#0b34b0" />
            <Text style={styles.sectionTitle}>{jsonData.section_description.name}</Text>
          </View>
          {jsonData.section_description.description.map((desc, index) => (
            <Text key={index} style={styles.descriptionText}>{desc}</Text>
          ))}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => openExternalLink(jsonData.section_description.description[2])}
          >
            <Text style={styles.linkButtonText}>Ver Ley</Text>
            <FontAwesomeIcon icon={faExternalLinkAlt} size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Sección de artículos */}
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
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
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