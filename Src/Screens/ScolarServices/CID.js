import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ErrorComponent } from "../Components/ErrorComponent";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faListUl, faBook, faGraduationCap, faUniversity, faUsers, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Static JSON data
import staticCidData from '../../../json/cid.json';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

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
        <ActivityIndicator size={isTablet ? 32 : 24} color="#0b34b0" />
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
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearGradient
        colors={['#0b34b0', '#4a90e2']}
        style={styles.header}
      >
        <FontAwesomeIcon icon={faBook} size={isTablet ? 48 : 40} color="#FFFFFF" />
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
                <FontAwesomeIcon icon={getIcon(subsection.title)} size={isTablet ? 28 : 24} color="#0b34b0" />
                <Text style={styles.subsectionTitle}>{subsection.title}</Text>
              </View>
              {Object.values(subsection["listed-elements"]).map((element, index) => (
                <View key={index} style={styles.listItemContainer}>
                  <FontAwesomeIcon icon={faListUl} size={isTablet ? 18 : 16} color="#4a90e2" style={styles.listItemIcon} />
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
  contentContainer: {
    paddingHorizontal: isTablet ? 24 : 16,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 10,
    textAlign: 'center',
    marginLeft: isTablet ? 15 : 10,
  },
  content: {
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: isTablet ? 24 : 20,
    marginBottom: 20,
    borderRadius: isTablet ? 12 : 10,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  subsectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet ? 20 : 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: isTablet ? 15 : 10,
  },
  subsectionTitle: {
    fontSize: isTablet ? 26 : 22,
    fontWeight: "bold",
    color: "#0b34b0",
    marginLeft: isTablet ? 15 : 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: isTablet ? 18 : 16,
    color: '#0b34b0',
  },
  descriptionText: {
    fontSize: isTablet ? 18 : 16,
    color: "#333333",
    lineHeight: isTablet ? 28 : 24,
    marginBottom: isTablet ? 12 : 8,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: isTablet ? 15 : 10,
  },
  listItemIcon: {
    marginTop: isTablet ? 6 : 4,
    marginRight: isTablet ? 15 : 10,
  },
  listItemText: {
    flex: 1,
    fontSize: isTablet ? 18 : 16,
    color: "#333333",
    lineHeight: isTablet ? 28 : 24,
  },
});

export default CID;