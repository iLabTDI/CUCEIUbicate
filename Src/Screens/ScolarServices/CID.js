import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl, act } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ErrorComponent } from "../Components/ErrorComponent";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faListUl, faBook, faGraduationCap, faUniversity, faUsers, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Static JSON data
import staticCidData from '../../../json/cid.json';

export const CID = () => {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadJson = useCallback(async () => {
    try {
      setJsonData(staticCidData);
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("No se pudo cargar el CID. Por favor, inténtalo de nuevo más tarde.");
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      setJsonData(staticCidData);
      setRefreshing(false);
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    loadJson();
  }, [loadJson]);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={24} color="#0b34b0" />
        <Text style={styles.loadingText}>Cargando CID...</Text>
      </View>
    );
  }

  const getIcon = (title) => {
    switch (title.toLowerCase()) {
      case 'misión':
        return faGraduationCap;
      case 'visión':
        return faLightbulb;
      case 'objetivos':
        return faBook;
      case 'funciones':
        return faUniversity;
      default:
        return faUsers;
    }
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearGradient
        colors={['#0b34b0', '#4a90e2']}
        style={styles.header}
      >
        <FontAwesomeIcon icon={faBook} size={40} color="#FFFFFF" />
        <Text style={styles.headerTitle}>{jsonData.section_description.name}</Text>
      </LinearGradient>
      <View style={styles.content}>
        <View style={styles.card}>
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
                <FontAwesomeIcon icon={getIcon(subsection.title)} size={24} color="#0b34b0" />
                <Text style={styles.subsectionTitle}>{subsection.title}</Text>
              </View>
              {Object.values(subsection["listed-elements"]).map((element, index) => (
                <View key={index} style={styles.listItemContainer}>
                  <FontAwesomeIcon icon={faListUl} size={16} color="#4a90e2" style={styles.listItemIcon} />
                  <Text style={styles.listItemText}>{element}</Text>
                </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 10,
    textAlign: 'center',
    marginLeft: 10,
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
  subsectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  subsectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0b34b0",
    marginLeft: 10,
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
    color: '#0b34b0',
  },
  descriptionText: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
    marginBottom: 8,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  listItemIcon: {
    marginTop: 4,
    marginRight: 10,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
  },
});

export default CID;