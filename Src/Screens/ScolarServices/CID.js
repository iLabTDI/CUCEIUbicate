import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as FileSystem from "expo-file-system";
import { ScrollView } from "react-native-gesture-handler";
import { ErrorComponent } from "../Components/ErrorComponent";

const jsonFilePath = `${FileSystem.documentDirectory}cid.json`;
const cidUrl = "http://148.202.152.59:8001/json/cid";
// const cidUrl = "http://localhost:8001/json/cid";

export const CID = () => {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null); // Estado para manejar errores

  const loadJson = async () => {
    try {
      // Intentar cargar el archivo local si existe
      const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
      if (fileInfo.exists) {
        console.log(`Cargando archivo existente en: ${jsonFilePath}`);
        const json = await FileSystem.readAsStringAsync(jsonFilePath);
        setJsonData(JSON.parse(json)); // Establece los datos JSON desde el archivo local
        setError(null); // Reinicia el error si se pueden leer los datos locales
      } else {
        // Si el archivo no existe, intenta descargarlo
        await downloadJson();
      }
    } catch (error) {
      console.error("Error al cargar o descargar el archivo:", error);
      setError("No se pudo cargar el CID. Por favor, verifica tu conexión a internet e intenta nuevamente."); // Actualiza el mensaje de error
    }
  };

  const downloadJson = async () => {
    try {
      console.log(`Descargando desde ${cidUrl}...`);
      const response = await fetch(cidUrl);
      if (!response.ok) {
        throw new Error(`Error al descargar desde ${cidUrl}`);
      }

      const json = await response.json();

      // Guardar el nuevo archivo JSON
      await FileSystem.writeAsStringAsync(jsonFilePath, JSON.stringify(json));
      console.log(`Archivo guardado en: ${jsonFilePath}`);
      setJsonData(json); // Establece los datos JSON desde la descarga
      console.log(json);
      setError(null); // Reinicia el error si la descarga es exitosa
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      setError("No se pudo descargar el CID. Por favor, verifica tu conexión a internet e intenta nuevamente."); // Actualiza el mensaje de error
    }
  };

  useEffect(() => {
    loadJson(); // Inicia la carga del JSON al montar el componente
  }, []);

  // Renderiza un mensaje de error si no se pudieron obtener los datos
  if (error) {
    return (
      <ErrorComponent
        title="Error de carga"
        message={error}
        buttonText="Reintentar"
        onRetry={downloadJson} // Llamar a downloadJson al presionar el botón
      />
    );
  }

  if (!jsonData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0b34b0" />
        <Text style={styles.loadingText}>Cargando CID...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.ScrollView}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>{jsonData.section_description.name}</Text>
          {jsonData.section_description.description.map((desc, index) => (
            <Text key={index} style={styles.descriptionText}>
              {desc}
            </Text>
          ))}
        </View>
        {Object.keys(jsonData.section_description["sub-sections"]).map(
          (subsectionId) => {
            const subsection =
              jsonData.section_description["sub-sections"][subsectionId];
            return (
              <View key={subsectionId} style={styles.card}>
                <Text style={styles.subsectionTitle}>{subsection.title}</Text>
                {Object.keys(subsection["listed-elements"]).map((elementId) => {
                  const element = subsection["listed-elements"][elementId];
                  return (
                    <Text key={elementId} style={styles.descriptionText}>
                      {element}
                    </Text>
                  );
                })}
              </View>
            );
          }
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ScrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0b34b0",
    marginBottom: 10,
  },
  subsectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0b34b0",
    marginTop: 15,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0b34b0',
  },
  descriptionText: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});

export default CID;