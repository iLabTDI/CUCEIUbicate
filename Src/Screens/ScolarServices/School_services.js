import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faLink,
  faSync,
  faGraduationCap,
  faClipboardList,
  faFileAlt,
  faCreditCard,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import * as FileSystem from "expo-file-system";
import { ErrorComponent } from "../Components/ErrorComponent";

const jsonFilePath = `${FileSystem.documentDirectory}scholar_services.json`;

const isURL = (text) => {
  const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
  return urlPattern.test(text);
};

const sectionIcons = {
  "Justificación de faltas": faClipboardList,
  "Solicitud de documentos": faFileAlt,
  "Orden de pago": faCreditCard,
  "Agenda": faCalendarAlt,
};

export const School_services = () => {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const downloadJson = useCallback(async () => {
    setIsLoading(true);
    try {
      const json = require("../../../json/scholar_services.json");
      await FileSystem.writeAsStringAsync(jsonFilePath, JSON.stringify(json));
      setJsonData(json);
      setError(null);
    } catch (error) {
      console.error("Error al cargar el archivo local:", error);
      setError("Error al cargar el archivo local");
      try {
        const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
        if (fileInfo.exists) {
          const localJson = await FileSystem.readAsStringAsync(jsonFilePath);
          setJsonData(JSON.parse(localJson));
          setError(null);
        } else {
          console.log("No hay datos locales disponibles.");
        }
      } catch (readError) {
        console.error("Error al leer el archivo local:", readError);
        setError("No se pudo leer el archivo local");
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    downloadJson();
  }, [downloadJson]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    downloadJson();
  }, [downloadJson]);

  const renderListItem = (item, index) => {
    if (isURL(item)) {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => Linking.openURL(item)}
          style={styles.linkContainer}
        >
          <FontAwesomeIcon icon={faLink} size={16} color="#0b34b0" />
          <Text style={styles.link}>{item}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <Text key={index} style={styles.text}>
          • {item}
        </Text>
      );
    }
  };

  if (error) {
    return (
      <ErrorComponent
        title="Error al cargar datos"
        message={error}
        buttonText="Reintentar"
        onRetry={downloadJson}
      />
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0b34b0" />
        <Text style={styles.loadingText}>Cargando servicios escolares...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* <TouchableOpacity style={styles.updateButton} onPress={downloadJson}>
        <FontAwesomeIcon icon={faSync} size={16} color="#FFFFFF" />
        <Text style={styles.updateButtonText}>Actualizar</Text>
      </TouchableOpacity> */}

      {jsonData?.section_description && (
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <FontAwesomeIcon icon={faGraduationCap} size={24} color="#0b34b0" />
            <Text style={styles.mainTitle}>{jsonData.section_description.name}</Text>
          </View>
          {/* <Text style={styles.description}>
            {jsonData.section_description.description}
          </Text> */}
        </View>
      )}

      {jsonData?.section_description?.["sub-sections"] &&
        Object.entries(jsonData.section_description["sub-sections"]).map(
          ([sectionId, section]) => (
            <View key={sectionId} style={styles.card}>
              <View style={styles.sectionTitleContainer}>
                <FontAwesomeIcon 
                  icon={sectionIcons[section.title] || faGraduationCap} 
                  size={20} 
                  color="#0b34b0" 
                />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              {section["listed-elements"] &&
                Object.entries(section["listed-elements"]).map(([elementId, element]) => (
                  <View key={elementId} style={styles.listItem}>
                    {Array.isArray(element)
                      ? element.map((item, index) =>
                          renderListItem(item, `${elementId}-${index}`)
                        )
                      : renderListItem(element, elementId)}
                  </View>
                ))}
            </View>
          )
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
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b34b0",
    padding: 12,
    margin: 10,
    borderRadius: 8,
    elevation: 2,
  },
  updateButtonText: {
    color: "#FFFFFF",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#FFFFFF",
    margin: 10,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0b34b0",
    marginLeft: 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0b34b0",
    marginLeft: 10,
  },
  text: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 8,
    lineHeight: 24,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  link: {
    fontSize: 16,
    color: "#0b34b0",
    textDecorationLine: "underline",
    marginLeft: 8,
  },
  listItem: {
    marginBottom: 8,
  },
});

export default School_services;