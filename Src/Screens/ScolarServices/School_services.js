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
  Dimensions,
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

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

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
          <FontAwesomeIcon icon={faLink} size={isTablet ? 20 : 16} color="#0b34b0" />
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
        <ActivityIndicator size={isTablet ? 32 : 24} color="#0b34b0" />
        <Text style={styles.loadingText}>Cargando servicios escolares...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {jsonData?.section_description && (
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <FontAwesomeIcon icon={faGraduationCap} size={isTablet ? 32 : 24} color="#0b34b0" />
            <Text style={styles.mainTitle}>{jsonData.section_description.name}</Text>
          </View>
        </View>
      )}

      {jsonData?.section_description?.["sub-sections"] &&
        Object.entries(jsonData.section_description["sub-sections"]).map(
          ([sectionId, section]) => (
            <View key={sectionId} style={styles.card}>
              <View style={styles.sectionTitleContainer}>
                <FontAwesomeIcon 
                  icon={sectionIcons[section.title] || faGraduationCap} 
                  size={isTablet ? 24 : 20} 
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
  contentContainer: {
    paddingHorizontal: isTablet ? 24 : 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: isTablet ? 20 : 16,
    color: "#0b34b0",
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginVertical: isTablet ? 15 : 10,
    padding: isTablet ? 24 : 20,
    borderRadius: isTablet ? 16 : 12,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet ? 15 : 10,
  },
  mainTitle: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: "bold",
    color: "#0b34b0",
    marginLeft: isTablet ? 15 : 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet ? 20 : 15,
  },
  sectionTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: "bold",
    color: "#0b34b0",
    marginLeft: isTablet ? 15 : 10,
  },
  text: {
    fontSize: isTablet ? 18 : 16,
    color: "#333333",
    marginBottom: isTablet ? 12 : 8,
    lineHeight: isTablet ? 28 : 24,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: isTablet ? 12 : 8,
    flexWrap: "wrap",
  },
  link: {
    fontSize: isTablet ? 18 : 16,
    color: "#0b34b0",
    textDecorationLine: "underline",
    marginLeft: isTablet ? 12 : 8,
  },
  listItem: {
    marginBottom: isTablet ? 12 : 8,
  },
});

export default School_services;