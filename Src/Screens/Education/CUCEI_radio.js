import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import {
  faRadio,
  faMusic,
  faPlayCircle,
  faGlobe,
  faInfoCircle,
  faChevronRight,
  faLink,
  faExternalLinkAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"

const { width } = Dimensions.get("window")
const isTablet = width >= 768

export const CUCEI_radio = () => {
  const [jsonData, setJsonData] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadJsonFromStorage()
  }, [])

  const loadJsonFromStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem("radioCuceiData")
      if (storedData !== null) {
        setJsonData(JSON.parse(storedData))
      } else {
        const json = require("../../../json/radio_cucei.json")
        setJsonData(json)
        await AsyncStorage.setItem("radioCuceiData", JSON.stringify(json))
      }
    } catch (error) {
      console.error("Error loading data from storage:", error)
      const json = require("../../../json/radio_cucei.json")
      setJsonData(json)
    }
  }

  const loadJson = async () => {
    setRefreshing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const json = require("../../../json/radio_cucei.json")
      await AsyncStorage.setItem("radioCuceiData", JSON.stringify(json))
      setJsonData(json)
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setRefreshing(false)
    }
  }

  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("An error occurred", err))
  }

  const RenderTextPart = ({ text }) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
    const parts = text.split(new RegExp(`(${urlRegex.source}|${emailRegex.source})`, "gi"))

    return (
      <>
        {parts.map((part, index) => {
          if (urlRegex.test(part)) {
            return (
              <TouchableOpacity key={index} onPress={() => openLink(part)} style={styles.linkContainer}>
                <FontAwesomeIcon icon={faLink} size={isTablet ? 16 : 14} color="#0056b3" style={styles.linkIcon} />
                <Text style={styles.linkText}>{part}</Text>
                <FontAwesomeIcon
                  icon={faExternalLinkAlt}
                  size={isTablet ? 12 : 10}
                  color="#0056b3"
                  style={styles.externalLinkIcon}
                />
              </TouchableOpacity>
            )
          } else if (emailRegex.test(part)) {
            return (
              <TouchableOpacity key={index} onPress={() => openLink(`mailto:${part}`)} style={styles.linkContainer}>
                <FontAwesomeIcon icon={faEnvelope} size={isTablet ? 16 : 14} color="#0056b3" style={styles.linkIcon} />
                <Text style={styles.linkText}>{part}</Text>
              </TouchableOpacity>
            )
          }
          return (
            <Text key={index} style={styles.normalText}>
              {part}
            </Text>
          )
        })}
      </>
    )
  }

  if (!jsonData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0056b3" />
          <Text style={styles.loadingText}>Cargando información de Radio CUCEI...</Text>
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
          <FontAwesomeIcon icon={faRadio} size={isTablet ? 32 : 24} color="#fff" />
          <Text style={styles.headerTitle}>{jsonData["section-description"].name}</Text>
        </LinearGradient>

        <View style={styles.card}>
          <RenderTextPart text={jsonData["section-description"].description} />
        </View>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <FontAwesomeIcon icon={faMusic} size={isTablet ? 20 : 16} color="#0056b3" style={styles.icon} />
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Género:</Text> {jsonData.genero}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesomeIcon icon={faGlobe} size={isTablet ? 20 : 16} color="#0056b3" style={styles.icon} />
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Idioma:</Text> {jsonData.idioma}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => openLink("http://radio.cucei.udg.mx/reproductor.html")}
          >
            <FontAwesomeIcon icon={faPlayCircle} size={isTablet ? 20 : 16} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Escuchar Radio CUCEI</Text>
          </TouchableOpacity>
        </View>

        {jsonData["listed-elements"] && (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <FontAwesomeIcon
                icon={faInfoCircle}
                size={isTablet ? 24 : 20}
                color="#0056b3"
                style={styles.sectionIcon}
              />
              <Text style={styles.sectionTitle}>Información Adicional</Text>
            </View>
            <View style={styles.sectionContent}>
              {Object.entries(jsonData["listed-elements"]).map(([key, value]) => (
                <View key={key} style={styles.listItem}>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    size={isTablet ? 16 : 14}
                    color="#0056b3"
                    style={styles.listItemIcon}
                  />
                  <View style={styles.listItemTextContainer}>
                    <RenderTextPart text={value} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
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
    padding: isTablet ? 24 : 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: isTablet ? 15 : 10,
  },
  icon: {
    marginRight: isTablet ? 15 : 10,
    width: 20,
  },
  infoText: {
    fontSize: isTablet ? 18 : 16,
    color: "#333",
    flex: 1,
  },
  bold: {
    fontWeight: "bold",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0056b3",
    padding: isTablet ? 15 : 12,
    borderRadius: 8,
    marginTop: isTablet ? 20 : 15,
  },
  buttonIcon: {
    marginRight: isTablet ? 15 : 10,
  },
  buttonText: {
    color: "white",
    fontSize: isTablet ? 18 : 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
    paddingBottom: isTablet ? 15 : 10,
    marginBottom: isTablet ? 20 : 15,
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
    paddingTop: isTablet ? 10 : 5,
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
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    backgroundColor: "#e1e8ed",
    padding: isTablet ? 10 : 8,
    borderRadius: isTablet ? 8 : 6,
    marginVertical: isTablet ? 5 : 3,
  },
  linkIcon: {
    marginRight: 5,
  },
  linkText: {
    color: "#0056b3",
    textDecorationLine: "underline",
    fontSize: isTablet ? 18 : 16,
    flex: 1,
  },
  externalLinkIcon: {
    marginLeft: 5,
  },
  normalText: {
    fontSize: isTablet ? 18 : 16,
    color: "#333",
    lineHeight: isTablet ? 28 : 24,
  },
})

export default CUCEI_radio

