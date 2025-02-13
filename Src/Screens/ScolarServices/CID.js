import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from "react-native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faBook, faChevronRight, faGraduationCap, faLanguage } from "@fortawesome/free-solid-svg-icons"
import { LinearGradient } from "expo-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"

const { width } = Dimensions.get("window")
const isTablet = width >= 768

export const CID = () => {
  const [jsonData, setJsonData] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadJsonFromStorage()
  }, [])

  const loadJsonFromStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem("cidData")
      if (storedData !== null) {
        setJsonData(JSON.parse(storedData))
      } else {
        const json = require("../../../json/cid.json")
        setJsonData(json)
        await AsyncStorage.setItem("cidData", JSON.stringify(json))
      }
    } catch (error) {
      console.error("Error loading data from storage:", error)
      const json = require("../../../json/cid.json")
      setJsonData(json)
    }
  }

  const loadJson = async () => {
    setRefreshing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const json = require("../../../json/cid.json")
      await AsyncStorage.setItem("cidData", JSON.stringify(json))
      setJsonData(json)
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setRefreshing(false)
    }
  }

  const renderListItem = (text, index) => (
    <View key={index} style={styles.listItem}>
      <FontAwesomeIcon icon={faChevronRight} size={isTablet ? 16 : 14} color="#0056b3" style={styles.listItemIcon} />
      <Text style={styles.listItemText}>{text}</Text>
    </View>
  )

  if (!jsonData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0056b3" />
          <Text style={styles.loadingText}>Cargando información del CID...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadJson} />}
      >
        <LinearGradient
          colors={["#0056b3", "#007bff"]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.centrar}>
            <FontAwesomeIcon icon={faBook} size={isTablet ? 32 : 24} color="#fff" />
            <Text style={styles.headerTitle}>{jsonData.section_description.name}</Text>
          </View>
        </LinearGradient>

        <View style={styles.card}>
          {jsonData.section_description.description.map((desc, index) => (
            <Text key={index} style={styles.description}>
              {desc}
            </Text>
          ))}
        </View>

        {Object.entries(jsonData.section_description["sub-sections"]).map(([sectionId, section]) => (
          <View key={sectionId} style={styles.card}>
            <View style={styles.sectionHeader}>
              <FontAwesomeIcon
                icon={section.title === "CAG" ? faLanguage : faGraduationCap}
                size={isTablet ? 24 : 20}
                color="#0056b3"
                style={styles.sectionIcon}
              />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.sectionContent}>
              {Object.values(section["listed-elements"]).map((item, index) => renderListItem(item, index))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

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
  centrar: {
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    // textAlign: "center",
    padding: isTablet ? 30 : 20,
    borderBottomLeftRadius: isTablet ? 30 : 20,
    borderBottomRightRadius: isTablet ? 30 : 20,
  },
  headerTitle: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: isTablet ? 15 : 10,
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
  listItemText: {
    flex: 1,
    fontSize: isTablet ? 18 : 16,
    color: "#333",
    lineHeight: isTablet ? 28 : 24,
  },
})

export default CID

