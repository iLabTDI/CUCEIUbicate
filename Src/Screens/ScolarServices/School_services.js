import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import * as FileSystem from "expo-file-system";

const jsonFilePath = `${FileSystem.documentDirectory}scholar_services.json`;
const scholarServicesUrl = "http://148.202.152.59:8001/json/scholar_services";

const isURL = (text) => {
  const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
  return urlPattern.test(text);
};

export const School_services = () => {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null); // Estado para manejar errores

  const downloadJson = async () => {
    try {
      // Intentar descargar el nuevo archivo JSON sin eliminar el anterior
      const response = await fetch(scholarServicesUrl);
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const json = await response.json();
      if (!json || typeof json !== "object") {
        throw new Error("Respuesta JSON no válida");
      }

      // Guardar el nuevo archivo JSON
      await FileSystem.writeAsStringAsync(jsonFilePath, JSON.stringify(json));
      setJsonData(json);
      setError(null); // Reinicia el error si la descarga es exitosa

      // No es necesario eliminar el archivo viejo porque ya se ha sobrescrito con éxito
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      setError("Sin conexión a internet"); // Establece el mensaje de error

      // Intentar cargar desde el archivo local si existe
      try {
        const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
        if (fileInfo.exists) {
          console.log(`Usando archivo existente en: ${jsonFilePath}`);
          const json = await FileSystem.readAsStringAsync(jsonFilePath);
          setJsonData(JSON.parse(json));
          setError(null); // Reinicia el error si se pueden leer los datos locales
        } else {
          console.log("No hay datos locales disponibles.");
          // Mantiene el mensaje de error existente
        }
      } catch (readError) {
        console.error("Error al leer el archivo:", readError);
        setError("No se pudo leer el archivo local");
      }
    }
  };

  useEffect(() => {
    downloadJson();
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!jsonData || !jsonData.section_description) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0b34b0" />
        <Text style={styles.loadingText}>Cargando servicios escolares...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {jsonData.section_description["sub-sections"] &&
        Object.keys(jsonData.section_description["sub-sections"]).map(
          (sectionId) => {
            const section =
              jsonData.section_description["sub-sections"][sectionId];
            return (
              <View key={sectionId} style={styles.card}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section["listed-elements"] &&
                  Object.keys(section["listed-elements"]).map((elementId) => {
                    const element = section["listed-elements"][elementId];
                    if (Array.isArray(element)) {
                      return element.map((item, index) => (
                        <View key={index}>
                          {isURL(item) ? (
                            <TouchableOpacity
                              onPress={() => Linking.openURL(item)}
                              style={styles.linkContainer}>
                              <FontAwesomeIcon
                                icon={faLink}
                                size={16}
                                color="#0b34b0"
                              />
                              <Text style={styles.link}>{item}</Text>
                            </TouchableOpacity>
                          ) : (
                            <Text style={styles.text}>{item}</Text>
                          )}
                        </View>
                      ));
                    } else {
                      return (
                        <View key={elementId} style={styles.listItem}>
                          {isURL(element) ? (
                            <TouchableOpacity
                              onPress={() => Linking.openURL(element)}
                              style={styles.linkContainer}>
                              <FontAwesomeIcon
                                icon={faLink}
                                size={16}
                                color="#0b34b0"
                              />
                              <Text style={styles.link}>{element}</Text>
                            </TouchableOpacity>
                          ) : (
                            <Text style={styles.text}>{element}</Text>
                          )}
                        </View>
                      );
                    }
                  })}
              </View>
            );
          }
        )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#0b34b0",
  },
  errorContainer: { // Estilos para el mensaje de error
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
  card: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0b34b0",
    marginBottom: 15,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    lineHeight: 24,
    textAlign: "justify",
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  link: {
    flex: 1,
    fontSize: 16,
    color: "#0b34b0",
    textDecorationLine: "underline",
    marginLeft: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
});

export default School_services;
