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
import { 
  faExternalLinkAlt, 
  faBook, 
  faGavel, 
  faListOl, 
  faQuoteRight, 
  faLink,
  faFileAlt,
  faInfoCircle,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons"
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
        <LinearGradient 
          colors={["#667eea", "#764ba2"]} 
          style={styles.loadingContainer}
        >
          <View style={styles.loadingContent}>
            <ActivityIndicator size={45} color="#ffffff" />
            <Text style={styles.loadingText}>Cargando artículos...</Text>
            <Text style={styles.loadingSubtext}>Preparando reglamento estudiantil</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={loadJson}
            colors={["#4A90E2", "#357ABD"]}
            progressBackgroundColor="#ffffff"
          />
        }
      >
        {/* Sección de descripción hermosa */}
        <View style={styles.descriptionSection}>
          <LinearGradient
            colors={["#4A90E2", "#357ABD", "#2E5BBA"]}
            style={styles.descriptionHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerIconContainer}>
              <FontAwesomeIcon icon={faInfoCircle} size={20} color="#ffffff" />
            </View>
            <Text style={styles.descriptionTitle}>Información Importante</Text>
          </LinearGradient>
          
          <View style={styles.descriptionContent}>
            {jsonData.section_description.description.slice(0, 2).map((desc, index) => (
              <Text key={index} style={styles.descriptionText}>
                {desc}
              </Text>
            ))}
            
            {/* Botón de enlace súper visible */}
            <TouchableOpacity
              style={styles.mainLinkButton}
              onPress={() => openExternalLink(jsonData.section_description.description[2])}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#0056b3", "#007bff"]}
                style={styles.linkButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.linkButtonContent}>
                  <FontAwesomeIcon icon={faFileAlt} size={18} color="#ffffff" />
                  <Text style={styles.mainLinkText}>Ver Reglamento Completo</Text>
                  <FontAwesomeIcon icon={faExternalLinkAlt} size={16} color="#ffffff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Artículos con diseño mejorado */}
        <View style={styles.articlesContainer}>
          {Object.entries(jsonData.artículos).map(([articuloId, articulo]) => (
            <View key={articuloId} style={styles.articleCard}>
              <LinearGradient
                colors={["#4A90E2", "#357ABD"]}
                style={styles.articleHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.articleIconContainer}>
                  <FontAwesomeIcon icon={faListOl} size={16} color="#ffffff" />
                </View>
                <Text style={styles.articleTitle}>Artículo {articuloId}</Text>
                <View style={styles.articleNumberBadge}>
                  <Text style={styles.articleNumberText}>{articuloId}</Text>
                </View>
              </LinearGradient>

              <View style={styles.articleContent}>
                {articulo.incisos.map((inciso, index) => (
                  <View key={index} style={styles.incisoItem}>
                    <View style={styles.incisoIndicator}>
                      <FontAwesomeIcon icon={faQuoteRight} size={10} color="#4A90E2" />
                    </View>
                    <Text style={styles.incisoText}>{inciso}</Text>
                  </View>
                ))}
              </View>
              
              {/* Decoración inferior del artículo */}
              <View style={styles.articleFooter}>
                <LinearGradient 
                  colors={["#74b9ff", "#0984e3"]} 
                  style={styles.articleFooterGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Enlace final prominente */}
        <View style={styles.finalLinkContainer}>
          <TouchableOpacity
            style={styles.finalLinkButton}
            onPress={() => openExternalLink(jsonData.enlace_completo)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#0056b3", "#007bff"]}
              style={styles.finalLinkGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesomeIcon icon={faBook} size={20} color="#ffffff" />
              <Text style={styles.finalLinkText}>Consultar Documento Oficial</Text>
              <FontAwesomeIcon icon={faArrowRight} size={18} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9ff",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  
  // Loading styles mejorados
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  loadingContent: {
    alignItems: "center",
    padding: 40,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    marginTop: 20,
    letterSpacing: 0.5,
  },
  loadingSubtext: {
    fontSize: 16,
    color: "#E8F4FD",
    textAlign: "center",
    marginTop: 8,
    opacity: 0.9,
  },

  // Sección de descripción
  descriptionSection: {
    margin: 20,
    marginBottom: 15,
  },
  descriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    flex: 1,
  },
  descriptionContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  descriptionText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 14,
    fontWeight: "400",
  },

  // Botón principal súper visible
  mainLinkButton: {
    marginTop: 8,
    borderRadius: 12,
    shadowColor: "#0056b3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  linkButtonGradient: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  linkButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  mainLinkText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 10,
    textAlign: "center",
  },

  // Contenedor de artículos
  articlesContainer: {
    paddingHorizontal: 20,
  },

  // Tarjetas de artículos mejoradas y más pequeñas
  articleCard: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  articleHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 60,
  },
  articleIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    flex: 1,
  },
  articleNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  articleNumberText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ffffff",
  },
  articleContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
  },
  incisoItem: {
    flexDirection: "row",
    marginBottom: 14,
    alignItems: "flex-start",
  },
  incisoIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E8F4FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
    borderWidth: 1,
    borderColor: "#4A90E2" + "30",
  },
  incisoText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    flex: 1,
    fontWeight: "400",
  },
  articleFooter: {
    height: 3,
  },
  articleFooterGradient: {
    height: "100%",
    width: "100%",
  },

  // Enlace final prominente
  finalLinkContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  finalLinkButton: {
    borderRadius: 16,
    shadowColor: "#0056b3",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  finalLinkGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  finalLinkText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 12,
    textAlign: "center",
  },
})

export default Articles

