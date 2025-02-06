import { useState, useCallback, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from "react-native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faExternalLinkAlt, faBook, faGavel, faListOl, faQuoteRight, faLink } from "@fortawesome/free-solid-svg-icons"
import { LinearGradient } from "expo-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"

const { width } = Dimensions.get("window")
const isTablet = width >= 768

export const Articles = () => {
  const [jsonData, setJsonData] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadArticlesFromStorage()
  }, [])

  const loadArticlesFromStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem("articlesData")
      if (storedData !== null) {
        setJsonData(JSON.parse(storedData))
      } else {
        const json = require("../../../json/articles.json")
        setJsonData(json)
        await AsyncStorage.setItem("articlesData", JSON.stringify(json))
      }
    } catch (error) {
      console.error("Error loading data from storage:", error)
      const json = require("../../../json/articles.json")
      setJsonData(json)
    }
  }

  const loadJson = useCallback(async () => {
    setRefreshing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const json = require("../../../json/articles.json")
      await AsyncStorage.setItem("articlesData", JSON.stringify(json))
      setJsonData(json)
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setRefreshing(false)
    }
  }, [])

  const openExternalLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Error al abrir el enlace:", err))
  }

  if (!jsonData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0056b3" />
          <Text style={styles.loadingText}>Cargando artículos...</Text>
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
          <FontAwesomeIcon icon={faBook} size={isTablet ? 32 : 24} color="#fff" />
          <Text style={styles.headerTitle}>{jsonData.section_description.name}</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <FontAwesomeIcon icon={faGavel} size={isTablet ? 28 : 24} color="#0056b3" />
              <Text style={styles.sectionTitle}>Descripción</Text>
            </View>
            {jsonData.section_description.description.map((desc, index) => (
              <Text key={index} style={styles.descriptionText}>
                {desc}
              </Text>
            ))}
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => openExternalLink(jsonData.section_description.description[2])}
            >
              <FontAwesomeIcon icon={faLink} size={isTablet ? 20 : 16} color="#FFFFFF" style={styles.linkIcon} />
              <Text style={styles.linkButtonText}>Ver Ley</Text>
              <FontAwesomeIcon
                icon={faExternalLinkAlt}
                size={isTablet ? 20 : 16}
                color="#FFFFFF"
                style={styles.externalLinkIcon}
              />
            </TouchableOpacity>
          </View>

          {Object.entries(jsonData.artículos).map(([articuloId, articulo]) => (
            <View key={articuloId} style={styles.card}>
              <View style={styles.cardHeader}>
                <FontAwesomeIcon icon={faListOl} size={isTablet ? 28 : 24} color="#0056b3" />
                <Text style={styles.articleTitle}>Artículo {articuloId}</Text>
              </View>
              {articulo.incisos.map((inciso, index) => (
                <View key={index} style={styles.incisoContainer}>
                  <FontAwesomeIcon
                    icon={faQuoteRight}
                    size={isTablet ? 20 : 16}
                    color="#0056b3"
                    style={styles.incisoIcon}
                  />
                  <Text style={styles.articleText}>{inciso}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
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
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: isTablet ? 30 : 20,
    borderBottomLeftRadius: isTablet ? 30 : 20,
    borderBottomRightRadius: isTablet ? 30 : 20,
  },
  headerTitle: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: isTablet ? 15 : 10,
    textAlign: "center",
  },
  content: {
    padding: isTablet ? 24 : 16,
    maxWidth: isTablet ? 800 : "100%",
    alignSelf: "center",
    width: "100%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: isTablet ? 24 : 20,
    marginBottom: isTablet ? 24 : 20,
    borderRadius: isTablet ? 16 : 12,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: isTablet ? 20 : 15,
  },
  sectionTitle: {
    fontSize: isTablet ? 26 : 22,
    fontWeight: "bold",
    color: "#0056b3",
    marginLeft: isTablet ? 15 : 10,
  },
  descriptionText: {
    fontSize: isTablet ? 18 : 16,
    color: "#333333",
    lineHeight: isTablet ? 28 : 24,
    marginBottom: isTablet ? 15 : 10,
  },
  linkButton: {
    backgroundColor: "#0056b3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: isTablet ? 15 : 10,
    borderRadius: isTablet ? 12 : 8,
    marginTop: isTablet ? 20 : 15,
    alignSelf: "flex-start",
  },
  linkIcon: {
    marginRight: isTablet ? 10 : 8,
  },
  linkButtonText: {
    color: "#FFFFFF",
    fontSize: isTablet ? 18 : 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  externalLinkIcon: {
    marginLeft: isTablet ? 10 : 8,
  },
  articleTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: "bold",
    color: "#0056b3",
    marginLeft: isTablet ? 15 : 10,
  },
  incisoContainer: {
    flexDirection: "row",
    marginBottom: isTablet ? 15 : 10,
  },
  incisoIcon: {
    marginTop: isTablet ? 6 : 5,
    marginRight: isTablet ? 15 : 10,
  },
  articleText: {
    fontSize: isTablet ? 18 : 16,
    color: "#333333",
    lineHeight: isTablet ? 28 : 24,
    flex: 1,
  },
})

export default Articles

