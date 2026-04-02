import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import {
  faExternalLinkAlt,
  faGraduationCap,
  faCalendarAlt,
  faUsers,
  faInfoCircle,
  faLink,
} from "@fortawesome/free-solid-svg-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"

const { width } = Dimensions.get("window")
const isTablet = width >= 768

export const Scholarships = () => {
  const [scholarshipsData, setScholarshipsData] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadScholarshipsFromStorage()
  }, [])

  const loadScholarshipsFromStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem("scholarshipsData")
      if (storedData !== null) {
        setScholarshipsData(JSON.parse(storedData))
      } else {
        const json = require("../../../json/becas_convocatorias.json")
        setScholarshipsData(json)
        await AsyncStorage.setItem("scholarshipsData", JSON.stringify(json))
      }
    } catch (error) {
      console.error("Error loading data from storage:", error)
      const json = require("../../../json/becas_convocatorias.json")
      setScholarshipsData(json)
    }
  }

  const loadScholarships = async () => {
    setRefreshing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const json = require("../../../json/becas_convocatorias.json")
      await AsyncStorage.setItem("scholarshipsData", JSON.stringify(json))
      setScholarshipsData(json)
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setRefreshing(false)
    }
  }

  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Ha ocurrido un error", err))
  }

  const formatDate = (dateString) => {
    if (dateString === "N/A") return "N/A"
    return dateString.replace("a", " a ")
  }

  if (!scholarshipsData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0056b3" />
          <Text style={styles.loadingText}>Cargando becas disponibles...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadScholarships} />}
      >
        <LinearGradient
          colors={["#0056b3", "#007bff"]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <FontAwesomeIcon icon={faGraduationCap} size={isTablet ? 48 : 40} color="white" />
          <Text style={styles.headerText}>Becas Disponibles</Text>
        </LinearGradient>
        {scholarshipsData.length > 0 ? (
          scholarshipsData.map((scholarship, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.title}>{scholarship.convocatoria}</Text>
              <View style={styles.infoRow}>
                <FontAwesomeIcon icon={faUsers} size={isTablet ? 20 : 16} color="#0056b3" style={styles.icon} />
                <Text style={styles.text}>
                  <Text style={styles.bold}>Beneficiados:</Text> {scholarship.beneficiados}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <FontAwesomeIcon icon={faCalendarAlt} size={isTablet ? 20 : 16} color="#0056b3" style={styles.icon} />
                <Text style={styles.text}>
                  <Text style={styles.bold}>Fecha:</Text> {formatDate(scholarship.fecha)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <FontAwesomeIcon icon={faInfoCircle} size={isTablet ? 20 : 16} color="#0056b3" style={styles.icon} />
                <Text style={styles.text}>
                  <Text style={styles.bold}>Resumen:</Text> {scholarship.resumen}
                </Text>
              </View>
              <TouchableOpacity style={styles.linkButton} onPress={() => openLink(scholarship.hipervinculo)}>
                <FontAwesomeIcon icon={faLink} size={isTablet ? 20 : 16} color="white" style={styles.linkIcon} />
                <Text style={styles.linkButtonText}>Más información</Text>
                <FontAwesomeIcon
                  icon={faExternalLinkAlt}
                  size={isTablet ? 20 : 16}
                  color="white"
                  style={styles.externalLinkIcon}
                />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No se encontraron becas disponibles.</Text>
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
  headerText: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: "bold",
    color: "white",
    marginLeft: isTablet ? 20 : 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    margin: isTablet ? 15 : 10,
    padding: isTablet ? 24 : 20,
    borderRadius: isTablet ? 16 : 12,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  title: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: "bold",
    color: "#0056b3",
    marginBottom: isTablet ? 15 : 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: isTablet ? 12 : 8,
  },
  icon: {
    marginRight: isTablet ? 15 : 10,
    marginTop: 3,
  },
  text: {
    fontSize: isTablet ? 16 : 14,
    color: "#333",
    flex: 1,
    lineHeight: isTablet ? 24 : 20,
  },
  bold: {
    fontWeight: "bold",
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0056b3",
    padding: isTablet ? 15 : 10,
    borderRadius: isTablet ? 12 : 8,
    marginTop: isTablet ? 20 : 15,
  },
  linkIcon: {
    marginRight: isTablet ? 10 : 8,
  },
  linkButtonText: {
    color: "white",
    fontSize: isTablet ? 16 : 14,
    flex: 1,
    textAlign: "center",
  },
  externalLinkIcon: {
    marginLeft: isTablet ? 10 : 8,
  },
  noDataText: {
    fontSize: isTablet ? 18 : 16,
    textAlign: "center",
    marginTop: isTablet ? 30 : 20,
    color: "#666",
  },
})

export default Scholarships

