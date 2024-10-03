import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronRight,
  faMedkit,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import * as FileSystem from "expo-file-system";
import { ErrorComponent } from "../Components/ErrorComponent";

const { width } = Dimensions.get("window");
const jsonFilePath = `${FileSystem.documentDirectory}medical_services.json`;
const medicalServicesUrl = "http://148.202.152.59:8001/json/medical_services";

export const Medical_services = () => {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const downloadJson = async () => {
    setIsRefreshing(true);
    try {
      // Attempt to download the new JSON file
      const response = await fetch(medicalServicesUrl);
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const json = await response.json();
      if (!json || typeof json !== "object") {
        throw new Error("Invalid JSON response");
      }

      // Save the new JSON file
      await FileSystem.writeAsStringAsync(jsonFilePath, JSON.stringify(json));
      setJsonData(json);
      setError(null);
    } catch (error) {
      console.error("Error downloading file:", error);
      setError("No internet connection");

      // Try to load existing file if available
      try {
        const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
        if (fileInfo.exists) {
          console.log(`Using existing file at: ${jsonFilePath}`);
          const json = await FileSystem.readAsStringAsync(jsonFilePath);
          setJsonData(JSON.parse(json));
          setError(null);
        } else {
          console.log("No local data available.");
        }
      } catch (readError) {
        console.error("Error reading local file:", readError);
        setError("Could not read local file");
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    downloadJson();
  }, []);

  if (error) {
    return (
      <ErrorComponent
        title="No internet connection"
        message="Unable to load Medical Services. Please check your internet connection and try again."
        buttonText="Retry"
        onRetry={downloadJson}
      />
    );
  }

  if (!jsonData || !jsonData.section_description) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0b34b0" />
        <Text style={styles.loadingText}>Cargando Servicios Medicos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Description Card */}
      <View style={styles.card}>
        <Text style={styles.descriptionText}>
          {jsonData.section_description.description}
        </Text>
      </View>

      {/* Sections */}
      {jsonData.section_description["sub-sections"] &&
        Object.entries(jsonData.section_description["sub-sections"]).map(
          ([sectionId, section]) => (
            <View key={`section-${sectionId}`} style={styles.card}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section["listed-elements"] &&
                Object.entries(section["listed-elements"]).map(
                  ([elementId, element]) => (
                    <View
                      key={`element-${sectionId}-${elementId}`}
                      style={styles.listItem}>
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        size={12}
                        color="#0b34b0"
                        style={styles.listIcon}
                      />
                      <Text style={styles.text}>{element}</Text>
                    </View>
                  )
                )}
            </View>
          )
        )}
      {/* Refresh Button */}
      <TouchableOpacity
        onPress={downloadJson}
        style={styles.refreshButton}
        disabled={isRefreshing}>
        <FontAwesomeIcon
          icon={faSync}
          size={16}
          color="#FFFFFF"
          style={isRefreshing ? styles.rotating : null}
        />
        <Text style={styles.refreshButtonText}>
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#0b34b0",
  },

  refreshButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  rotating: {
    transform: [{ rotate: "45deg" }],
  },
  card: {
    backgroundColor: "#FFFFFF",
    margin: 10,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000000",
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
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#333333",
    textAlign: "justify",
    lineHeight: 24,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  listIcon: {
    marginRight: 10,
    marginTop: 5,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
    textAlign: "justify",
    lineHeight: 24,
  },
});

export default Medical_services;
