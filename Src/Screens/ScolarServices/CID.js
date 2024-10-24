import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as FileSystem from "expo-file-system";
import { ScrollView } from "react-native-gesture-handler";
import { ErrorComponent } from "../Components/ErrorComponent";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faInfoCircle, faListUl, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

// Static JSON data
import staticCidData from '../../../json/cid.json';

const jsonFilePath = `${FileSystem.documentDirectory}cid.json`;
// const cidUrl = "http://148.202.152.59:8001/json/cid";
// const cidUrl = "http://localhost:8001/json/cid";

export const CID = () => {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);

  const loadJson = async () => {
    try {
      // Use static JSON data
      setJsonData(staticCidData);
      setError(null);

      // Commented out for future use:
      // const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
      // if (fileInfo.exists) {
      //   console.log(` Loading existing file from: ${jsonFilePath}`);
      //   const json = await FileSystem.readAsStringAsync(jsonFilePath);
      //   setJsonData(JSON.parse(json));
      //   setError(null);
      // } else {
      //   await downloadJson();
      // }
    } catch (error) {
      console.error(" Error loading data:", error);
      setError("No se pudo cargar el CID. Por favor, inténtalo de nuevo más tarde.");
    }
  };

  const downloadJson = async () => {
    // Commented out for future use:
    // try {
    //   console.log(` Downloading from ${cidUrl}...`);
    //   const response = await fetch(cidUrl);
    //   if (!response.ok) {
    //     throw new Error(`Error downloading from ${cidUrl}`);
    //   }
    //   const json = await response.json();
    //   await FileSystem.writeAsStringAsync(jsonFilePath, JSON.stringify(json));
    //   console.log(` File saved to: ${jsonFilePath}`);
    //   setJsonData(json);
    //   setError(null);
    // } catch (error) {
    //   console.error(" Error downloading file:", error);
    //   setError("No se pudo descargar el CID. Por favor, verifica tu conexión a internet e intenta nuevamente.");
    // }
  };

  useEffect(() => {
    loadJson();
  }, []);

  if (error) {
    return (
      <ErrorComponent
        title="Error de carga"
        message={error}
        buttonText="Reintentar"
        onRetry={loadJson}
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
    <ScrollView style={styles.scrollView}>
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <FontAwesomeIcon icon={faInfoCircle} size={24} color="#0b34b0" />
            <Text style={styles.title}>{jsonData.section_description.name}</Text>
          </View>
          {jsonData.section_description.description.map((desc, index) => (
            <Text key={index} style={styles.descriptionText}>
              {desc}
            </Text>
          ))}
        </View>
        {Object.entries(jsonData.section_description["sub-sections"]).map(
          ([subsectionId, subsection]) => (
            <View key={subsectionId} style={styles.card}>
              <View style={styles.subsectionTitleContainer}>
                <FontAwesomeIcon icon={faListUl} size={20} color="#0b34b0" />
                <Text style={styles.subsectionTitle}>{subsection.title}</Text>
              </View>
              {Object.values(subsection["listed-elements"]).map((element, index) => (
                <Text key={index} style={styles.descriptionText}>
                  • {element}
                </Text>
              ))}
            </View>
          )
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0b34b0",
    marginLeft: 10,
  },
  subsectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  subsectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0b34b0",
    marginLeft: 10,
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