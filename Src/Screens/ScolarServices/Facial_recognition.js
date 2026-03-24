import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronRight,
  faUserGraduate,
  faExclamationTriangle,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

export const Facial_recognition = () => {
  const [jsonData, setJsonData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadJsonFromStorage();
  }, []);

  const loadJsonFromStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem("facialRecognitionData");
      if (storedData !== null) {
        setJsonData(JSON.parse(storedData));
      } else {
        const json = require("../../../json/face_access.json");
        setJsonData(json);
        await AsyncStorage.setItem(
          "facialRecognitionData",
          JSON.stringify(json)
        );
      }
    } catch (error) {
      console.error("Error loading data from storage:", error);
      const json = require("../../../json/face_access.json");
      setJsonData(json);
    }
  };

  const loadJson = async () => {
    setRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const json = require("../../../json/face_access.json");
      await AsyncStorage.setItem("facialRecognitionData", JSON.stringify(json));
      setJsonData(json);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const RenderTextPart = ({ text }) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (urlRegex.test(text)) {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => Linking.openURL(text)}>
          <Text style={styles.linkText}>{text}</Text>
        </TouchableOpacity>
      );
    }
    return <Text style={styles.listItemText}>{text}</Text>;
  };

  const renderListItem = (text, index) => {
    const parts = text.split(/(https?:\/\/[^\s]+)/g);

    return (
      <View key={index} style={styles.listItem}>
        <FontAwesomeIcon
          icon={faChevronRight}
          size={isTablet ? 16 : 14}
          color="#0056b3"
          style={styles.listItemIcon}
        />
        <View style={styles.listItemTextContainer}>
          {parts.map((part, i) => (
            <RenderTextPart key={i} text={part} />
          ))}
        </View>
      </View>
    );
  };

  if (!jsonData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0056b3" />
          <Text style={styles.loadingText}>Cargando información...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadJson} />
        }>
        <LinearGradient
          colors={["#0056b3", "#007bff"]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <View style={styles.headerContent}>
            <FontAwesomeIcon
              icon={faCamera}
              size={isTablet ? 32 : 24}
              color="#fff"
            />
            <Text style={styles.headerTitle}>
              {jsonData["section-description"].name}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.description}>
            {jsonData["section-description"].description}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <FontAwesomeIcon
              icon={faUserGraduate}
              size={isTablet ? 24 : 20}
              color="#0056b3"
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>
              {jsonData["section-description"].tittle}
            </Text>
          </View>
          <View style={styles.sectionContent}>
            {Object.values(
              jsonData["section-description"]["listed-elements"]
            ).map((item, index) => renderListItem(item, index))}
          </View>
          <View style={styles.noteContainer}>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              size={isTablet ? 18 : 16}
              color="#f39c12"
            />
            <Text style={styles.noteText}>
              Si tienes problemas, acude a la Coordinación de Seguridad y
              Protección Universitaria.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: isTablet ? 20 : 16,
    color: "#0056b3",
    marginTop: 10,
  },
  header: {
    padding: isTablet ? 30 : 20,
    borderBottomLeftRadius: isTablet ? 30 : 20,
    borderBottomRightRadius: isTablet ? 30 : 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: isTablet ? 15 : 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: isTablet ? 24 : 16,
    marginVertical: isTablet ? 15 : 10,
    borderRadius: isTablet ? 16 : 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    overflow: "hidden",
  },
  description: {
    fontSize: isTablet ? 18 : 16,
    color: "#333",
    lineHeight: isTablet ? 28 : 24,
    padding: isTablet ? 20 : 15,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: isTablet ? 20 : 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  sectionIcon: {
    marginRight: isTablet ? 15 : 10,
  },
  sectionTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: "bold",
    color: "#0056b3",
    flex: 1,
  },
  sectionContent: {
    padding: isTablet ? 20 : 15,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: isTablet ? 15 : 10,
  },
  listItemIcon: {
    marginTop: isTablet ? 6 : 4,
    marginRight: isTablet ? 15 : 10,
  },
  listItemTextContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  listItemText: {
    fontSize: isTablet ? 18 : 16,
    color: "#333",
  },
  linkText: {
    fontSize: isTablet ? 18 : 16,
    color: "#0056b3",
    textDecorationLine: "underline",
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff9c4",
    padding: isTablet ? 15 : 10,
    borderRadius: isTablet ? 8 : 5,
    margin: isTablet ? 20 : 15,
  },
  noteText: {
    fontSize: isTablet ? 16 : 14,
    color: "#333",
    marginLeft: isTablet ? 15 : 10,
    flex: 1,
  },
});

export default Facial_recognition;
