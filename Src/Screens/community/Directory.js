import * as React from "react";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Image } from "react-native";
import * as FileSystem from 'expo-file-system';

const { width } = Dimensions.get('window');
const LOCAL_JSON_PATH = `${FileSystem.documentDirectory}assets/jsons/directory.json`; // Ruta local
const API_URL = "http://148.202.152.59:8001/"; // Asegúrate de que esta URL sea correcta

export const Directory = () => {
  const [jsonData, setJsonData] = useState([]); // Inicializa como un array vacío
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Estado para manejar errores

  const fetchJsonData = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(LOCAL_JSON_PATH);
      console.log("Información del archivo:", fileInfo); // Verifica si el archivo existe

      // Si el archivo existe, borrarlo antes de la descarga
      if (fileInfo.exists) {
        console.log("Borrando archivo existente antes de la descarga...");
        await FileSystem.deleteAsync(LOCAL_JSON_PATH);
      }

      console.log("Iniciando la solicitud a la API...");
      const response = await fetch(API_URL);
      
      // Comprueba si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.statusText);
      }

      const data = await response.json();
    

      // Asegúrate de que los datos son un array
      if (Array.isArray(data)) {
        console.log("Guardando datos en el sistema de archivos local...");
        await FileSystem.writeAsStringAsync(LOCAL_JSON_PATH, JSON.stringify(data));
        setJsonData(data);
      } else {
        throw new Error("Los datos de la API no son un array");
      }
    } catch (error) {
      console.error("Error al cargar el JSON:", error);
      setError("Error al cargar los datos: " + error.message); // Proporciona más información sobre el error
      
      // Si hay un error, intenta cargar el archivo existente si está disponible
      if (fileInfo.exists) {
        console.log("Cargando datos desde el archivo existente...");
        try {
          const existingData = await FileSystem.readAsStringAsync(LOCAL_JSON_PATH);
          setJsonData(JSON.parse(existingData)); // Establece los datos existentes
        } catch (readError) {
          console.error("Error al leer el archivo existente:", readError);
        }
      } else {
        console.log("No hay archivo existente para cargar.");
      }
    } finally {
      console.log("Finalizando el proceso de carga.");
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Iniciando la carga inicial de datos...");
    fetchJsonData(); // Carga inicial de datos

    // Establece un intervalo para volver a cargar el archivo cada mes (30 días)
    const intervalId = setInterval(() => {
      console.log("Actualizando datos de la API...");
      fetchJsonData();
    }, 30 * 24 * 60 * 60 * 1000); // 30 días en milisegundos

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0b34b0" />
      </View>
    );
  }

  // Manejo de error
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Verifica que jsonData existe y es un array
  if (!jsonData || !Array.isArray(jsonData)) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Datos no disponibles.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {jsonData.map((contact, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.sectionHeader}>
              <Image
                source={{ uri: contact.imagen }}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.sectionTitle}>{contact.nombre}</Text>
            </View>
            <Text style={styles.descriptionText}>Departamento: {contact.departamento}</Text>
            <Text style={styles.descriptionText}>Puesto: {contact.puesto}</Text>
            <Text style={styles.descriptionText}>Dirección: {contact.direccion}</Text>
            <Text style={styles.descriptionText}>Conmutador: {contact.conmutador}</Text>
            <Text style={styles.descriptionText}>Correo: {contact.correo_electronico}</Text>
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
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
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
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25, // Para hacer la imagen circular
  },
});

export default Directory;
