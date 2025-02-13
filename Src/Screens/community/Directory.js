"use client"

import { useState, useCallback, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from "react-native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faBuilding, faMapMarkerAlt, faPhone, faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons"
import { LinearGradient } from "expo-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"
import staticJsonData from "../../../json/contact_info.json"
import { ContactImage } from "../../../json/contact_images"

const { width } = Dimensions.get("window")
const isTablet = width >= 768

const STORAGE_KEY = "directory_data"
const FIRST_LOAD_KEY = "directory_first_load"

export const Directory = () => {
  const [jsonData, setJsonData] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Check if it's first load
      const hasLoadedBefore = await AsyncStorage.getItem(FIRST_LOAD_KEY)

      if (!hasLoadedBefore) {
        // If it's first load, show spinner and store data
        setTimeout(async () => {
          setJsonData(staticJsonData)
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(staticJsonData))
          await AsyncStorage.setItem(FIRST_LOAD_KEY, "true")
          setLoading(false)
          setIsFirstLoad(false)
        }, 2000)
      } else {
        // If not first load, get data from storage
        const storedData = await AsyncStorage.getItem(STORAGE_KEY)
        if (storedData) {
          setJsonData(JSON.parse(storedData))
          setLoading(false)
          setIsFirstLoad(false)
        } else {
          // Fallback if storage is empty
          setJsonData(staticJsonData)
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(staticJsonData))
          setLoading(false)
        }
      }
    } catch (error) {
      console.error("Error loading directory data:", error)
      setJsonData(staticJsonData)
      setLoading(false)
    }
  }

  const getImageSource = (imageName) => {
    if (ContactImage.hasOwnProperty(imageName)) {
      return ContactImage[imageName]
    } else {
      return require("../../../json/contact_info/noasignado.jpg")
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    // On refresh, update stored data without showing loading spinner
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(staticJsonData))
      setJsonData(staticJsonData)
    } catch (error) {
      console.error("Error refreshing directory data:", error)
    }
    setRefreshing(false)
  }, [])

  const openEmail = (email) => {
    Linking.openURL(`mailto:${email}`)
  }

  const openPhone = (phone) => {
    const mainPhone = phone.split(",")[0].trim()
    Linking.openURL(`tel:${mainPhone}`)
  }

  if (loading && isFirstLoad) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={isTablet ? 48 : 24} color="#0056b3" />
        <Text style={styles.loadingText}>Cargando directorio...</Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <LinearGradient colors={["#0056b3", "#007bff"]} style={styles.header}>
        <FontAwesomeIcon icon={faUser} size={isTablet ? 36 : 24} color="#fff" />
        <Text style={styles.headerTitle}>Directorio CUCEI</Text>
      </LinearGradient>
      <View style={styles.content}>
        {jsonData.map((contact, index) => (
          <View key={index} style={styles.card}>
            <LinearGradient colors={["#0056b3", "#267bee"]} style={styles.cardHeader}>
              <Image source={getImageSource(contact.imagen)} style={styles.image} resizeMode="cover" />
              <View style={styles.headerText}>
                <Text style={styles.name}>{contact.nombre}</Text>
                <Text style={styles.position}>{contact.puesto}</Text>
              </View>
            </LinearGradient>
            <View style={styles.cardBody}>
              <View style={styles.infoRow}>
                <FontAwesomeIcon icon={faBuilding} style={styles.icon} />
                <Text style={styles.infoText}>{contact.departamento}</Text>
              </View>
              <View style={styles.infoRow}>
                <FontAwesomeIcon icon={faMapMarkerAlt} style={styles.icon} />
                <Text style={styles.infoText}>{contact.direccion}</Text>
              </View>
              <View style={styles.infoRow}>
                <FontAwesomeIcon icon={faPhone} style={styles.icon} />
                <TouchableOpacity onPress={() => openPhone(contact.conmutador)}>
                  <Text style={[styles.infoText, styles.linkText]}>{contact.conmutador.split(",")[0].trim()}</Text>
                </TouchableOpacity>
                <Text style={styles.infoText}>{contact.conmutador.split(",").slice(1).join(",")}</Text>
              </View>
              <TouchableOpacity style={styles.infoRow} onPress={() => openEmail(contact.correo_electronico)}>
                <FontAwesomeIcon icon={faEnvelope} style={styles.icon} />
                <Text style={[styles.infoText, styles.linkText]}>{contact.correo_electronico}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    fontSize: isTablet ? 24 : 18,
    fontWeight: "600",
    color: "#0056b3",
    marginTop: isTablet ? 20 : 10,
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
    flexDirection: isTablet ? "row" : "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: isTablet ? 16 : 12,
    marginBottom: isTablet ? 24 : 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden",
    width: isTablet ? "48%" : "100%",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: isTablet ? 24 : 16,
    paddingVertical: isTablet ? 16 : 12,
    height: isTablet ? 170 : 100,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  image: {
    width: isTablet ? 80 : 60,
    height: isTablet ? 80 : 60,
    borderRadius: isTablet ? 40 : 30,
    marginRight: isTablet ? 20 : 16,
  },
  headerText: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: isTablet ? 18 : 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: isTablet ? 5 : 4,
  },
  position: {
    fontSize: isTablet ? 16 : 14,
    color: "#e9ecef",
  },
  cardBody: {
    padding: isTablet ? 24 : 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: isTablet ? 16 : 12,
    flexWrap: "wrap",
  },
  icon: {
    color: "#0056b3",
    marginRight: isTablet ? 16 : 12,
    width: isTablet ? 22 : 18,
    height: isTablet ? 22 : 18,
  },
  infoText: {
    fontSize: isTablet ? 18 : 16,
    color: "#495057",
    flex: 1,
  },
  linkText: {
    color: "#0056b3",
    textDecorationLine: "underline",
  },
})

export default Directory

