"use client"

import React, { useState, useCallback, useEffect, useMemo, useRef } from "react"
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
  StatusBar,
  Animated,
  Platform,
} from "react-native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import {
  faBuilding,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faSearch,
  faGraduationCap,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons"
import { LinearGradient } from "expo-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"
import staticJsonData from "../../../json/contact_info.json"
import { ContactImage } from "../../../json/contact_images"

const { width, height } = Dimensions.get("window")
const isTablet = width >= 768

const STORAGE_KEY = "directory_data"
const FIRST_LOAD_KEY = "directory_first_load"

// --- Premium Skeleton (Glassmorphic & Rounded) ---
const SkeletonCard = () => {
  const animatedValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: 0, duration: 1200, useNativeDriver: true })
      ])
    ).start()
  }, [])

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8]
  })

  return (
    <View style={styles.skeletonWrapper}>
      <Animated.View style={[styles.skeletonImage, { opacity }]} />
      <View style={styles.skeletonContent}>
        <Animated.View style={[styles.skeletonLine, { width: "70%", height: 22, opacity }]} />
        <Animated.View style={[styles.skeletonLine, { width: "45%", height: 16, marginTop: 8, opacity }]} />

        <View style={{ marginTop: 20 }}>
          <Animated.View style={[styles.skeletonLine, { width: "95%", height: 14, marginBottom: 10, opacity }]} />
          <Animated.View style={[styles.skeletonLine, { width: "65%", height: 14, marginBottom: 10, opacity }]} />
          <Animated.View style={[styles.skeletonLine, { width: "85%", height: 14, opacity }]} />
        </View>
      </View>
    </View>
  )
}

// --- Modern & Beautiful Contact Card ---
const ContactCard = React.memo(({ contact, openEmail, openPhone }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardInner}>

        {/* Superior: Glass/Gradient Background header part */}
        <LinearGradient
          colors={["rgba(11, 52, 176, 0.03)", "rgba(255, 255, 255, 0)"]}
          style={styles.cardHeaderBackground}
        />

        <View style={styles.cardHeader}>
          <View style={styles.imageOuterWrapper}>
            <Image source={getImageSource(contact.imagen)} style={styles.premiumImage} resizeMode="cover" />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.contactName} numberOfLines={2}>{contact.nombre}</Text>
            <View style={styles.badgeWrapper}>
              <View style={styles.badgeDot} />
              <Text style={styles.contactPosition} numberOfLines={2}>{contact.puesto}</Text>
            </View>
          </View>
        </View>

        {/* Separador sutil */}
        <View style={styles.divider} />

        {/* Inferior: Detalles de Contacto */}
        <View style={styles.cardBody}>
          <View style={styles.infoStaticRow}>
            <View style={[styles.iconCircle, { backgroundColor: "#fdf4ff" }]}>
              <FontAwesomeIcon icon={faBuilding} size={14} color="#db2777" />
            </View>
            <Text style={styles.infoStaticText} numberOfLines={2}>{contact.departamento}</Text>
          </View>

          <View style={styles.infoStaticRow}>
            <View style={[styles.iconCircle, { backgroundColor: "#f0fdf4" }]}>
              <FontAwesomeIcon icon={faMapMarkerAlt} size={14} color="#16a34a" />
            </View>
            <Text style={styles.infoStaticText}>{contact.direccion}</Text>
          </View>

          {/* Botones de acción súper limpios (Apilados verticalmente para números largos) */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.btnCall]}
              onPress={() => openPhone(contact.conmutador)}
              activeOpacity={0.7}
            >
              <FontAwesomeIcon icon={faPhone} size={13} color="#ffffff" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.btnCallTitle}>Llamar extensión</Text>
                <Text style={styles.btnCallText} numberOfLines={1}>{contact.conmutador}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.btnEmail]}
              onPress={() => openEmail(contact.correo_electronico)}
              activeOpacity={0.7}
            >
              <FontAwesomeIcon icon={faEnvelope} size={13} color="#0f172a" style={{ marginRight: 10 }} />
              <Text style={styles.btnEmailText} numberOfLines={1}>Enviar Correo</Text>
              <FontAwesomeIcon icon={faChevronRight} size={10} color="#0f172a" style={{ marginLeft: "auto", opacity: 0.5 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
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
        // Simula retardo para la primera carga para mostrar los skeletons
        setTimeout(async () => {
          setJsonData(staticJsonData)
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(staticJsonData))
          await AsyncStorage.setItem(FIRST_LOAD_KEY, "true")
          setLoading(false)
          setIsFirstLoad(false)
        }, 1500)
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

  // Mostrar Skeletons si está cargando
  if (loading && isFirstLoad) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

        {/* Cabecera Limpia */}
        <View style={styles.topHeader}>
          <Text style={styles.screenTitle}>Directorio</Text>
          <Text style={styles.screenSubtitle}>Contactos académicos e institucionales</Text>
        </View>

        <View style={styles.searchWrapper}>
          <View style={styles.searchBox}>
            <FontAwesomeIcon icon={faSearch} size={18} color="#94a3b8" style={styles.searchIcon} />
            <Text style={{ color: "#94a3b8", fontSize: 16 }}>Buscando...</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Cabecera Moderna Limpia */}
      <View style={styles.topHeader}>
        <Text style={styles.screenTitle}>Directorio</Text>
        <Text style={styles.screenSubtitle}>Contactos académicos e institucionales</Text>
      </View>

      {/* Buscador Píldora "Floating" */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} size={18} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, puesto o departamento..."
            placeholderTextColor="#94a3b8"
            value={searchText}
            onChangeText={setSearchText}
            selectionColor="#0b34b0"
          />
        </View>
      </View>

      {/* Lista de Tarjetas */}
      <FlatList
        data={filteredData}
        renderItem={({ item }) => <ContactCard contact={item} openEmail={openEmail} openPhone={openPhone} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0b34b0"]}
            progressBackgroundColor="#f8fafc"
          />
        }
        initialNumToRender={6}
        maxToRenderPerBatch={4}
        windowSize={10}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc" // Color base muy suave y limpio
  },

  // Header súper limpio (iOS Style)
  topHeader: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 24 : 10,
    paddingBottom: 15,
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.8,
  },
  screenSubtitle: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 2,
    fontWeight: "500",
  },

  // Buscador estilo "Píldora Flotante" Drop-Shadow suave
  searchWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    zIndex: 2,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20, // Píldora suave
    paddingHorizontal: 16,
    height: 56,
    shadowColor: "#94a3b8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#334155",
    fontWeight: "500",
    height: "100%",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Premium Card Redesign - Rounded & Elegant
  cardContainer: {
    marginBottom: 20,
  },
  cardInner: {
    backgroundColor: "#ffffff",
    borderRadius: 24, // Bordes súper redondeados y modernos
    padding: 22,
    shadowColor: "#cbd5e1",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
    overflow: "hidden", // Para que el gradiente de fondo respete los bordes
  },
  cardHeaderBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  imageOuterWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 3,
    backgroundColor: "#ffffff",
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginRight: 16,
  },
  premiumImage: {
    width: "100%",
    height: "100%",
    borderRadius: 31,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  contactName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 6,
    lineHeight: 24,
    letterSpacing: -0.4,
  },
  badgeWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3b82f6",
    marginRight: 6,
  },
  contactPosition: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    width: "100%",
    marginBottom: 16,
  },
  cardBody: {
    flexDirection: "column",
  },
  infoStaticRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12, // Esquina súper moderna, no es círculo completo (squircle style)
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoStaticText: {
    flex: 1,
    fontSize: 15,
    color: "#334155",
    fontWeight: "500",
    lineHeight: 20,
  },

  // Botones flotantes elegantes (Apilados verticalmente)
  actionButtonsRow: {
    flexDirection: "column",
    marginTop: 8,
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14, // Rounded Premium
  },
  btnCall: {
    backgroundColor: "#0b34b0",
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnCallTitle: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 0,
  },
  btnCallText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  btnEmail: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  btnEmailText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },

  // Skeletons Premium Modernos
  skeletonWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
    flexDirection: "row",
    shadowColor: "#cbd5e1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 3,
  },
  skeletonImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#e2e8f0",
    marginRight: 16,
  },
  skeletonContent: {
    flex: 1,
    justifyContent: "center",
  },
  skeletonLine: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
  }
})

export default Directory
