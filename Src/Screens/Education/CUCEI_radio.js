import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView, // Agregamos ScrollView para permitir desplazamiento si es necesario
} from 'react-native';
import * as FileSystem from 'expo-file-system';

const jsonFilePath = `${FileSystem.documentDirectory}radio_cucei.json`; // Ruta para guardar el JSON
const radioCuceiUrl = "http://148.202.152.59:8001/json/radio_cucei";

export const CUCEI_radio = () => {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null); // Estado para manejar errores

  const downloadJson = async () => {
    console.log(`Descargando desde ${radioCuceiUrl}...`);
    try {
      // Intentar descargar el nuevo archivo JSON sin eliminar el anterior
      const response = await fetch(radioCuceiUrl);
      if (!response.ok) {
        throw new Error(`Error al descargar desde ${radioCuceiUrl}`);
      }

      const json = await response.json();
      await FileSystem.writeAsStringAsync(jsonFilePath, JSON.stringify(json));
      console.log(`Archivo guardado en: ${jsonFilePath}`);
      setJsonData(json); // Establece los datos JSON
      setError(null); // Reinicia el error si la descarga es exitosa

      // No es necesario eliminar el archivo viejo porque ya se ha sobrescrito con éxito
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      setError("Sin conexión a internet"); // Establece el mensaje de error

      // Si hay un error, intenta cargar el archivo existente si está disponible
      const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
      if (fileInfo.exists) {
        console.log(`Usando archivo existente en: ${jsonFilePath}`);
        try {
          const json = await FileSystem.readAsStringAsync(jsonFilePath);
          setJsonData(JSON.parse(json)); // Establece los datos JSON
          setError(null); // Reinicia el error si se pueden leer los datos locales
        } catch (readError) {
          console.error("Error al leer el archivo:", readError);
          setError("No se pudo leer el archivo local"); // Actualiza el mensaje de error
        }
      } else {
        console.log(`No se pudo descargar y el archivo no existe: ${jsonFilePath}`);
        // Mantiene el mensaje de error existente
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
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>{jsonData["section-description"].name}</Text>
          <Text style={styles.descriptionText}>
            {jsonData["section-description"].description}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default CUCEI_radio;
