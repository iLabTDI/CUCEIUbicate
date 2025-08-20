"use client"

import React, { useState, useCallback, useEffect, useMemo } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  Linking,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faBuilding, faMapMarkerAlt, faPhone, faEnvelope, faUser, faSearch } from "@fortawesome/free-solid-svg-icons"
import { LinearGradient } from "expo-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"
import staticJsonData from "../../../json/contact_info.json"
import { ContactImage } from "../../../json/contact_images"

const { width } = Dimensions.get("window")
const isTablet = width >= 768

const STORAGE_KEY = "directory_data"
const FIRST_LOAD_KEY = "directory_first_load"

// Componente para cada tarjeta de contacto
const ContactCard = React.memo(({ contact, openEmail, openPhone }) => {
  return (
    <View style={styles.card}>
      <LinearGradient colors={["#0056b3", "#267bee"]} style={styles.cardHeader}>
        <Image source={getImageSource(contact.imagen)} style={styles.image} resizeMode="cover" />
        <View style={styles.headerText}>
          <Text style={styles.name}>{contact.nombre}</Text>
          <Text style={styles.position}>{contact.puesto}</Text>
        </View>
      </LinearGradient>
      <View style={styles.cardBody}>
        <InfoRow icon={faBuilding} text={contact.departamento} />
        <InfoRow icon={faMapMarkerAlt} text={contact.direccion} />
        <InfoRow icon={faPhone} text={contact.conmutador} onPress={() => openPhone(contact.conmutador)} isLink />
        <InfoRow icon={faEnvelope} text={contact.correo_electronico} onPress={() => openEmail(contact.correo_electronico)} isLink />
      </View>
    </View>
  )
})

// Componente para mostrar cada fila de información
const InfoRow = React.memo(({ icon, text, onPress, isLink }) => {
  const content = (
    <View style={styles.infoRow}>
      <FontAwesomeIcon icon={icon} style={styles.icon} />
      <Text style={[styles.infoText, isLink && styles.linkText]}>{text}</Text>
    </View>
  )
  return isLink ? <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity> : content
})

// Función para obtener la imagen asignada al contacto
const getImageSource = (imageName) => {
  return ContactImage[imageName] || require("../../../json/contact_info/noasignado.jpg")
}

export const Directory = () => {
  const [jsonData, setJsonData] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const hasLoadedBefore = await AsyncStorage.getItem(FIRST_LOAD_KEY)
      if (!hasLoadedBefore) {
        // Simula retardo para la primera carga
        setTimeout(async () => {
          setJsonData(staticJsonData)
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(staticJsonData))
          await AsyncStorage.setItem(FIRST_LOAD_KEY, "true")
          setLoading(false)
          setIsFirstLoad(false)
        }, 2000)
      } else {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY)
        if (storedData) {
          setJsonData(JSON.parse(storedData))
        } else {
          setJsonData(staticJsonData)
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(staticJsonData))
        }
        setLoading(false)
        setIsFirstLoad(false)
      }
    } catch (error) {
      console.error("Error loading directory data:", error)
      setJsonData(staticJsonData)
      setLoading(false)
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(staticJsonData))
      setJsonData(staticJsonData)
    } catch (error) {
      console.error("Error refreshing directory data:", error)
    }
    setRefreshing(false)
  }, [])

  const openEmail = useCallback((email) => {
    Linking.openURL(`mailto:${email}`)
  }, [])

  const openPhone = useCallback((phone) => {
    const mainPhone = phone.split(",")[0].trim()
    Linking.openURL(`tel:${mainPhone}`)
  }, [])

  const filteredData = useMemo(() => {
    const lowerText = searchText.toLowerCase()
    return jsonData.filter(
      (contact) =>
        contact.nombre.toLowerCase().includes(lowerText) ||
        contact.puesto.toLowerCase().includes(lowerText) ||
        contact.departamento.toLowerCase().includes(lowerText)
    )
  }, [jsonData, searchText])

  // getItemLayout para FlatList (asumiendo que cada tarjeta tiene una altura fija)
  const getItemLayout = useCallback(
    (data, index) => ({
      length: isTablet ? 300 : 200, // Ajusta según el tamaño real de tus tarjetas
      offset: (isTablet ? 300 : 200) * index,
      index,
    }),
    [isTablet]
  )

  if (loading && isFirstLoad) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={isTablet ? 48 : 24} color="#0056b3" />
        <Text style={styles.loadingText}>Cargando directorio...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0056b3", "#007bff"]} style={styles.header}>
        <FontAwesomeIcon icon={faUser} size={isTablet ? 36 : 24} color="#fff" />
        <Text style={styles.headerTitle}>Directorio CUCEI</Text>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <FontAwesomeIcon icon={faSearch} size={20} color="#0b34b0" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar contacto..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredData}
        renderItem={({ item }) => <ContactCard contact={item} openEmail={openEmail} openPhone={openPhone} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.content}
        numColumns={isTablet ? 2 : 1}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        getItemLayout={getItemLayout}
        initialNumToRender={10}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
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
  searchContainer: {
    margin: 16,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  content: {
    padding: isTablet ? 24 : 16,
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
    marginHorizontal: isTablet ? "1%" : 0,
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
  headerText: { flex: 1, justifyContent: "center" },
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
  cardBody: { padding: isTablet ? 24 : 16 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: isTablet ? 16 : 12,
    flexWrap: "wrap",
  },
  icon: {
    color: "#0b34b0",
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

export default Directory;
