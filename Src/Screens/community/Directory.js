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
  StatusBar,
} from "react-native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { 
  faBuilding, 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope, 
  faUser, 
  faSearch,
  faGraduationCap,
  faHeart
} from "@fortawesome/free-solid-svg-icons"
import { LinearGradient } from "expo-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"
import staticJsonData from "../../../json/contact_info.json"
import { ContactImage } from "../../../json/contact_images"

const { width, height } = Dimensions.get("window")
const isTablet = width >= 768

const STORAGE_KEY = "directory_data"
const FIRST_LOAD_KEY = "directory_first_load"

// Componente para cada tarjeta de contacto
const ContactCard = React.memo(({ contact, openEmail, openPhone }) => {
  return (
    <View style={styles.cardContainer}>
      <LinearGradient 
        colors={["#ffffff", "#f8f9ff"]} 
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header de la tarjeta */}
        <LinearGradient 
          colors={["#4A90E2", "#357ABD", "#2E5BBA"]} 
          style={styles.cardHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.imageContainer}>
            <Image source={getImageSource(contact.imagen)} style={styles.image} resizeMode="cover" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.name} numberOfLines={2}>{contact.nombre}</Text>
            <View style={styles.positionContainer}>
              <FontAwesomeIcon icon={faGraduationCap} size={12} color="#E3F2FD" />
              <Text style={styles.position} numberOfLines={2}>{contact.puesto}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Cuerpo de la tarjeta */}
        <View style={styles.cardBody}>
          <InfoRow 
            icon={faBuilding} 
            text={contact.departamento} 
            iconColor="#8B5A96"
            isImportant={true}
          />
          <InfoRow 
            icon={faMapMarkerAlt} 
            text={contact.direccion} 
            iconColor="#2ECC71"
          />
          <InfoRow 
            icon={faPhone} 
            text={contact.conmutador} 
            onPress={() => openPhone(contact.conmutador)} 
            isLink 
            iconColor="#3498DB"
          />
          <InfoRow 
            icon={faEnvelope} 
            text={contact.correo_electronico} 
            onPress={() => openEmail(contact.correo_electronico)} 
            isLink 
            iconColor="#E74C3C"
          />
        </View>

        {/* Decoración inferior */}
        <View style={styles.cardFooter}>
          <LinearGradient 
            colors={["#74b9ff", "#0984e3"]} 
            style={styles.footerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
      </LinearGradient>
    </View>
  )
})

// Componente para mostrar cada fila de información
const InfoRow = React.memo(({ icon, text, onPress, isLink, iconColor = "#4A90E2", isImportant = false }) => {
  const content = (
    <View style={[styles.infoRow, isImportant && styles.importantRow]}>
      <View style={[styles.iconContainer, { backgroundColor: iconColor + "15" }]}>
        <FontAwesomeIcon icon={icon} style={[styles.icon, { color: iconColor }]} />
      </View>
      <Text style={[
        styles.infoText, 
        isLink && styles.linkText,
        isImportant && styles.importantText
      ]} numberOfLines={isImportant ? 2 : 3}>
        {text}
      </Text>
    </View>
  )
  return isLink ? (
    <TouchableOpacity onPress={onPress} style={styles.linkContainer}>
      {content}
    </TouchableOpacity>
  ) : content
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
      <LinearGradient 
        colors={["#667eea", "#764ba2"]} 
        style={styles.loadingContainer}
      >
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size={40} color="#ffffff" />
          <Text style={styles.loadingText}>Cargando directorio...</Text>
          <Text style={styles.loadingSubtext}>Preparando información de contactos</Text>
        </View>
      </LinearGradient>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      {/* Header súper pequeño y lindo */}
      {/* <LinearGradient 
        colors={["#667eea", "#764ba2", "#4A90E2"]} 
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerWrapper}>
          <View style={styles.headerContent}>
            <View style={styles.headerIconWrapper}>
              <LinearGradient
                colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.2)"]}
                style={styles.headerIconBackground}
              >
                <FontAwesomeIcon icon={faUser} size={18} color="#fff" />
              </LinearGradient>
            </View>
            
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerMainTitle}>Directorio CUCEI</Text>
              <Text style={styles.headerDescription}>
                Información de contacto del personal
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient> */}

      {/* Barra de búsqueda mejorada */}
      <View style={styles.searchWrapper}>
        <LinearGradient
          colors={["#ffffff", "#f8f9ff"]}
          style={styles.searchContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.searchIconContainer}>
            <FontAwesomeIcon icon={faSearch} size={18} color="#4A90E2" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, puesto o departamento..."
            placeholderTextColor="#B0BEC5"
            value={searchText}
            onChangeText={setSearchText}
            selectionColor="#4A90E2"
          />
        </LinearGradient>
      </View>

      {/* Lista mejorada */}
      <FlatList
        data={filteredData}
        renderItem={({ item }) => <ContactCard contact={item} openEmail={openEmail} openPhone={openPhone} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={["#4A90E2", "#357ABD"]}
            progressBackgroundColor="#ffffff"
          />
        }
        initialNumToRender={8}
        maxToRenderPerBatch={5}
        windowSize={10}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f7ff" 
  },
  
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
    padding: 30,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  loadingText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    marginTop: 20,
    textAlign: "center",
  },
  loadingSubtext: {
    fontSize: 16,
    color: "#E3F2FD",
    marginTop: 8,
    textAlign: "center",
  },

  // Header súper pequeño y lindo
  header: {
    paddingTop: 35,
    paddingBottom: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  headerWrapper: {
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconWrapper: {
    marginRight: 12,
  },
  headerIconBackground: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTextContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerMainTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerDescription: {
    fontSize: 12,
    color: "#E8F4FD",
    textAlign: "center",
    marginTop: 2,
    opacity: 0.9,
    fontWeight: "400",
  },

  // Search styles
  searchWrapper: {
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(74, 144, 226, 0.1)",
  },
  searchIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4A90E2" + "10",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },

  // Content styles
  content: {
    padding: 20,
    paddingTop: 0,
  },

  // Card styles
  cardContainer: {
    marginBottom: 18,
  },
  card: {
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(74, 144, 226, 0.08)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
    minHeight: 100,
  },
  imageContainer: {
    marginRight: 14,
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  headerText: { 
    flex: 1, 
    justifyContent: "center" 
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 5,
    lineHeight: 21,
  },
  positionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  position: {
    fontSize: 13,
    color: "#E3F2FD",
    marginLeft: 6,
    fontWeight: "500",
    lineHeight: 17,
  },
  
  // Card body styles
  cardBody: { 
    padding: 18,
    paddingTop: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingVertical: 2,
  },
  importantRow: {
    backgroundColor: "rgba(139, 90, 150, 0.08)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#8B5A96",
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 1,
  },
  icon: {
    width: 15,
    height: 15,
  },
  infoText: {
    fontSize: 15,
    color: "#2D3748",
    flex: 1,
    lineHeight: 20,
    fontWeight: "500",
  },
  importantText: {
    fontWeight: "700",
    color: "#1A202C",
  },
  linkContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  linkText: {
    color: "#4A90E2",
    textDecorationLine: "underline",
    fontWeight: "600",
  },

  // Card footer
  cardFooter: {
    height: 4,
    overflow: "hidden",
  },
  footerGradient: {
    height: "100%",
    width: "100%",
  },
})

export default Directory;
