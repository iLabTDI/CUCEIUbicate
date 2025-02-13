import { useEffect, useState } from "react";
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
  SafeAreaView,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faGraduationCap,
  faClipboardList,
  faFileAlt,
  faCreditCard,
  faCalendarAlt,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

const jsonFilePath = `${FileSystem.documentDirectory}scholar_services.json`;

const isURL = (text) => {
  const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
  return urlPattern.test(text);
};

const isEmail = (text) => {
  const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailPattern.test(text);
};

const sectionIcons = {
  "Justificación de faltas": faClipboardList,
  "Solicitud de documentos": faFileAlt,
  "Orden de pago": faCreditCard,
  Agenda: faCalendarAlt,
};

export const School_services = () => {
  const [jsonData, setJsonData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadJsonFromStorage();
  }, []);

  const loadJsonFromStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem("scholarServicesData");
      if (storedData !== null) {
        setJsonData(JSON.parse(storedData));
      } else {
        const json = require("../../../json/scholar_services.json");
        setJsonData(json);
        await AsyncStorage.setItem("scholarServicesData", JSON.stringify(json));
      }
    } catch (error) {
      console.error("Error loading data from storage:", error);
      const json = require("../../../json/scholar_services.json");
      setJsonData(json);
    }
  };

  const loadJson = async () => {
    setRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const json = require("../../../json/scholar_services.json");
      await AsyncStorage.setItem("scholarServicesData", JSON.stringify(json));
      setJsonData(json);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const RenderTextPart = ({ text }) => {
    if (isURL(text) || isEmail(text)) {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            Linking.openURL(isEmail(text) ? `mailto:${text}` : text)
          }>
          <Text style={styles.linkText}>{text}</Text>
        </TouchableOpacity>
      );
    }
    return <Text style={styles.listItemText}>{text}</Text>;
  };

  const renderListItem = (text, index) => {
    const parts = text.split(/(\s+)/);

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

  const renderContent = (content) => {
    if (Array.isArray(content)) {
      return content.map((item, index) => renderListItem(item, index));
    } else if (typeof content === "string") {
      return renderListItem(content, 0);
    }
    return null;
  };

  const renderSection = (sectionId, section) => (
    <View key={sectionId} style={styles.card}>
      <View style={styles.sectionHeader}>
        <FontAwesomeIcon
          icon={sectionIcons[section.title] || faGraduationCap}
          size={isTablet ? 24 : 20}
          color="#0056b3"
          style={styles.sectionIcon}
        />
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {renderContent(section.content)}
        {section["listed-elements"] &&
          Object.entries(section["listed-elements"]).map(([key, element]) =>
            Array.isArray(element)
              ? element.map((subElement, subIndex) =>
                  renderListItem(subElement, `${key}-${subIndex}`)
                )
              : renderListItem(element, key)
          )}
      </View>
    </View>
  );

  if (!jsonData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0056b3" />
          <Text style={styles.loadingText}>
            Cargando servicios escolares...
          </Text>
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
              icon={faGraduationCap}
              size={isTablet ? 32 : 24}
              color="#fff"
            />
            <Text style={styles.headerTitle}>
              {jsonData.section_description.name}
            </Text>
          </View>
        </LinearGradient>
        {Object.entries(jsonData.section_description["sub-sections"]).map(
          ([sectionId, section]) => renderSection(sectionId, section)
        )}
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
});

export default School_services;
