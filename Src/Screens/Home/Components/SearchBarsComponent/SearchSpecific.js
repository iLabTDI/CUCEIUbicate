import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  Keyboard,
  FlatList,
  Text,
  Dimensions,
  Platform,
} from "react-native";
import {
  faSearch,
  faTimes,
  faHistory,
  faExclamationCircle,
  faBuilding,
  faBook,
  faUtensils,
  faFootballBall,
  faGraduationCap,
  faTicketAlt,
  faMapMarkerAlt,
  faParking,
  faBus,
  faRestroom,
  faWifi,
  faCoffee,
  faUserTie,
  faLaptop,
  faFlask,
  faHome,
  faSchool,
  faHospital,
  faUsers,
  faDesktop,
  faChalkboardTeacher,
  faToolbox,
  faCamera,
  faMusic,
  faPrint,
  faClipboardList,
  faKey,
  faShieldAlt,
  faHeart,
  faGamepad,
  faMicrophone,
  faCar,
  faTree,
  faStar,
  faDoorOpen,
  faBank,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

// 🔹 Normalizar texto (quita acentos y pasa a minúsculas)
const normalize = (s = "") =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

// 🔹 Diccionario de keywords → iconos
const iconMap = [
  { keys: ["modulo", "edificio"], icon: faBuilding },
  { keys: ["biblioteca"], icon: faBook },
  { keys: ["entrada", "acceso"], icon: faDoorOpen },
  { keys: ["comida", "restaurante", "globo", "cafeteria"], icon: faUtensils },
  { keys: ["cafe", "starbucks", "flor de cordoba"], icon: faCoffee },
  { keys: ["estacionamiento", "parking"], icon: faParking },
  { keys: ["baño", "sanitario", "wc"], icon: faRestroom },
  { keys: ["wifi", "internet"], icon: faWifi },
  { keys: ["laboratorio", "lab"], icon: faFlask },
  { keys: ["computo", "sistemas", "informatica"], icon: faLaptop },
  { keys: ["aula", "salon", "clase"], icon: faChalkboardTeacher },
  { keys: ["auditorio", "conferencia"], icon: faMicrophone },
  { keys: ["administra", "coordinacion", "direccion"], icon: faUserTie },
  { keys: ["secretaria", "oficina"], icon: faClipboardList },
  { keys: ["rectoria", "rector"], icon: faHome },
  { keys: ["medico", "enfermeria", "salud"], icon: faHospital },
  { keys: ["psicolog", "bienestar"], icon: faHeart },
  { keys: ["deporte", "gimnasio", "cancha"], icon: faFootballBall },
  { keys: ["juego", "recreo"], icon: faGamepad },
  { keys: ["estudiante", "alumno"], icon: faUsers },
  { keys: ["beca"], icon: faStar },
  { keys: ["impresion", "copiado"], icon: faPrint },
  { keys: ["fotografia", "estudio"], icon: faCamera },
  { keys: ["musica", "audio"], icon: faMusic },
  { keys: ["transporte", "ruta", "autobus"], icon: faBus },
  { keys: ["vehiculo", "auto"], icon: faCar },
  { keys: ["seguridad", "vigilancia"], icon: faShieldAlt },
  { keys: ["mantenimiento", "herramienta"], icon: faToolbox },
  { keys: ["llave"], icon: faKey },
  { keys: ["jardin", "verde", "patio"], icon: faTree },
  { keys: ["santander", "banco", "jobs"], icon: faBank },
];

// 🔹 Función compacta
const getIconForCategoryFromText = (text = "") => {
  const t = normalize(text);
  return (
    iconMap.find(({ keys }) => keys.some((k) => t.includes(k)))?.icon ||
    faSearch
  );
};

// Función para obtener colores bonitos para cada categoría
const colorMap = [
  { keys: ["modulo"], color: "#1E40AF" },
  { keys: ["edificio"], color: "#374151" },
  { keys: ["biblioteca"], color: "#7C3AED" },
  { keys: ["entrada", "acceso"], color: "#059669" },
  { keys: ["comida", "restaurante", "globo", "cafeteria"], color: "#EA580C" },
  { keys: ["cafe"], color: "#92400E" },
  { keys: ["estacionamiento", "parking"], color: "#374151" },
  { keys: ["baño", "sanitario", "wc"], color: "#0891B2" },
  { keys: ["wifi", "internet"], color: "#2563EB" },
  { keys: ["laboratorio", "lab"], color: "#DC2626" },
  { keys: ["computo", "sistemas", "informatica"], color: "#1F2937" },
  { keys: ["aula", "salon", "clase"], color: "#059669" },
  { keys: ["auditorio", "conferencia"], color: "#7C3AED" },
  { keys: ["administra", "coordinacion", "direccion"], color: "#1E40AF" },
  { keys: ["secretaria", "oficina"], color: "#374151" },
  { keys: ["rector"], color: "#991B1B" },
  { keys: ["medico", "enfermeria", "salud"], color: "#DC2626" },
  { keys: ["psicolog", "bienestar"], color: "#BE185D" },
  { keys: ["deporte", "gimnasio", "cancha"], color: "#16A34A" },
  { keys: ["juego", "recreo"], color: "#7C3AED" },
  { keys: ["estudiante", "alumno"], color: "#2563EB" },
  { keys: ["beca"], color: "#D97706" },
  { keys: ["impresion", "copiado", "fotografia", "musica"], color: "#374151" },
  { keys: ["transporte", "ruta", "autobus"], color: "#D97706" },
  { keys: ["vehiculo", "auto"], color: "#374151" },
  { keys: ["seguridad", "mantenimiento"], color: "#991B1B" },
  { keys: ["jardin", "verde", "patio"], color: "#16A34A" },
];

const getColorForCategory = (text = "") => {
  const t = normalize(text);
  return (
    colorMap.find(({ keys }) => keys.some((k) => t.includes(k)))?.color ||
    "#0033A0"
  );
};

export const SpecificSearch = ({ onSearch, points, setShowSpecificSearch }) => {
  const [showSpecificSearchState, setShowSpecificSearchState] = useState(false);
  const [specificSearchText, setSpecificSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState("");
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  useEffect(() => {
    loadSearchHistory();
    if (showSpecificSearchState) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
    // Notifica al componente padre el estado del search
    setShowSpecificSearch(showSpecificSearchState);
  }, [showSpecificSearchState]);

  const loadSearchHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem("specificSearchHistory");
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Error loading search history:", error);
    }
  };

  const toggleSpecificSearch = () => {
    if (showSpecificSearchState) {
      closeSearch();
    } else {
      openSearch();
    }
  };

  const openSearch = () => {
    setShowSpecificSearchState(true);
    Animated.parallel([
      Animated.timing(animatedWidth, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const closeSearch = () => {
    Keyboard.dismiss();
    Animated.parallel([
      Animated.timing(animatedWidth, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setShowSpecificSearchState(false);
      setSpecificSearchText("");
      setSearchResults([]);
      setShowHistory(false);
      setError("");
      setShowSpecificSearch(false);
    });
  };

  const handleSpecificSearch = (text) => {
    setSpecificSearchText(text);
    setError("");
    if (text.length > 0) {
      const filteredResults = points.filter(
        (point) =>
          point.name.toLowerCase().includes(text.toLowerCase()) ||
          point.id.toLowerCase().includes(text.toLowerCase()) ||
          (point.aliases &&
            point.aliases.some((alias) =>
              alias.toLowerCase().includes(text.toLowerCase())
            ))
      );
      setSearchResults(filteredResults);
      if (filteredResults.length === 0) {
        setError("No se encontraron resultados");
      }
    } else {
      setSearchResults([]);
    }
    setShowHistory(false);
  };

  const handleSelectResult = async (item) => {
    onSearch(item.id);
    await updateSearchHistory(item.name);
    closeSearch();
  };

  const updateSearchHistory = async (searchTerm) => {
    const newHistory = [
      searchTerm,
      ...searchHistory.filter((term) => term !== searchTerm),
    ].slice(0, 5);
    setSearchHistory(newHistory);
    await AsyncStorage.setItem(
      "specificSearchHistory",
      JSON.stringify(newHistory)
    );
  };

  // Renderiza cada resultado de búsqueda con ícono y color específico por categoría
  const renderSearchResult = ({ item }) => {
    const itemColor = getColorForCategory(item.name);
    return (
      <TouchableOpacity
        style={[
          styles.resultItem,
          {
            transform: [{ scale: 1 }],
          },
        ]}
        onPress={() => handleSelectResult(item)}
        activeOpacity={0.8}
        underlayColor={`${itemColor}08`}>
        <View
          style={[
            styles.resultIcon,
            {
              backgroundColor: `${itemColor}18`,
              borderWidth: 1,
              borderColor: `${itemColor}25`,
            },
          ]}>
          <FontAwesomeIcon
            icon={getIconForCategoryFromText(item.name)}
            size={isTablet ? 20 : 16}
            color={itemColor}
          />
        </View>
        <Text style={styles.resultText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  // Renderiza cada elemento del historial de búsqueda con su ícono y color específico
  const renderHistoryItem = ({ item }) => {
    const itemColor = getColorForCategory(item);
    return (
      <TouchableOpacity
        style={[
          styles.resultItem,
          {
            transform: [{ scale: 1 }],
          },
        ]}
        onPress={() => {
          setSpecificSearchText(item);
          handleSpecificSearch(item);
        }}
        activeOpacity={0.8}
        underlayColor={`${itemColor}08`}>
        <View
          style={[
            styles.resultIcon,
            {
              backgroundColor: `${itemColor}18`,
              borderWidth: 1,
              borderColor: `${itemColor}25`,
            },
          ]}>
          <FontAwesomeIcon
            icon={getIconForCategoryFromText(item)}
            size={isTablet ? 20 : 16}
            color={itemColor}
          />
        </View>
        <Text style={styles.resultText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.search_icon}
        onPress={toggleSpecificSearch}>
        <FontAwesomeIcon
          icon={faSearch}
          size={isTablet ? width * 0.04 : width * 0.06}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      {showSpecificSearchState && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: animatedOpacity,
            },
          ]}
        />
      )}

      {showSpecificSearchState && (
        <Animated.View
          style={[
            styles.searchBarContainer,
            {
              transform: [
                {
                  translateX: animatedWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: [isTablet ? 200 : 150, isTablet ? 20 : 10],
                  }),
                },
              ],
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", isTablet ? "80%" : "79%"],
              }),
            },
          ]}>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Buscar lugares..."
            placeholderTextColor="#999999"
            value={specificSearchText}
            onChangeText={handleSpecificSearch}
          />
          <TouchableOpacity
            style={styles.historyIcon}
            onPress={() => {
              setShowHistory(!showHistory);
              setError("");
              setSearchResults([]);
            }}>
            <FontAwesomeIcon
              icon={faHistory}
              size={isTablet ? 24 : 20}
              color="#0000ff"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeIcon} onPress={closeSearch}>
            <FontAwesomeIcon
              icon={faTimes}
              size={isTablet ? 24 : 20}
              color="#0000ff"
            />
          </TouchableOpacity>
        </Animated.View>
      )}

      {(searchResults.length > 0 || showHistory || error) && (
        <View style={styles.resultsContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <FontAwesomeIcon
                icon={faExclamationCircle}
                size={isTablet ? 24 : 20}
                color="#ff6b6b"
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <FlatList
              data={showHistory ? searchHistory : searchResults}
              renderItem={showHistory ? renderHistoryItem : renderSearchResult}
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps="always"
              scrollEnabled={true}
              style={styles.resultsList}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: isTablet ? height * 0.03 : height * 0.05,
    right: isTablet ? width * 0.02 : width * 0.03,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  search_icon: {
    top: Platform.OS === "android" ? 12 : 5,
    right: Platform.OS === "android" ? 10 : 0.2,
    backgroundColor: "#0b34b0",
    borderRadius: Platform.OS === "android" ? 50 : width * 0.1,
    padding: Platform.OS === "android" ? 14 : width * 0.04,
    zIndex: 2,
    elevation: Platform.OS === "android" ? 8 : 0,
    shadowColor: Platform.OS === "ios" ? "#000" : undefined,
    shadowOffset: Platform.OS === "ios" ? { width: 0, height: 2 } : undefined,
    shadowOpacity: Platform.OS === "ios" ? 0.25 : undefined,
    shadowRadius: Platform.OS === "ios" ? 3.84 : undefined,
  },
  overlay: {
    position: "absolute",
    top: isTablet ? -height * 0.03 : -height * 0.05,
    left: -width,
    right: isTablet ? -width * 0.02 : -width * 0.03,
    bottom: -height,
    backgroundColor: "rgba(0, 51, 160, 0.4)",
    zIndex: 1,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    top: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: isTablet ? 30 : 25,
    paddingHorizontal: isTablet ? 24 : 20,
    height: isTablet ? 56 : 48,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 51, 160, 0.1)",
  },
  searchInput: {
    flex: 1,
    fontSize: isTablet ? width * 0.025 : width * 0.04,
    color: "#333333",
  },
  historyIcon: {
    padding: isTablet ? width * 0.01 : width * 0.015,
    marginRight: isTablet ? width * 0.01 : width * 0.015,
  },
  closeIcon: {
    padding: isTablet ? width * 0.01 : width * 0.015,
  },
  resultsContainer: {
    position: "absolute",
    top: isTablet ? height * 0.09 : height * 0.07,
    right: isTablet ? width * 0.02 : width * 0.03,
    width: isTablet ? width * 0.85 : width * 0.8,
    backgroundColor: "#FFFFFF",
    borderRadius: isTablet ? 20 : 16,
    maxHeight: isTablet ? height * 0.5 : height * 0.4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
    zIndex: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 51, 160, 0.08)",
    overflow: "hidden",
  },
  resultsList: {
    flexGrow: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: isTablet ? 20 : 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 51, 160, 0.06)",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 6,
    marginVertical: 2,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  resultIcon: {
    marginRight: isTablet ? 18 : 14,
    width: isTablet ? 44 : 36,
    height: isTablet ? 44 : 36,
    borderRadius: isTablet ? 22 : 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // elevation: 3,
  },
  resultText: {
    fontSize: isTablet ? 18 : 16,
    color: "#1F2937",
    fontWeight: "600",
    flex: 1,
    lineHeight: isTablet ? 26 : 22,
    letterSpacing: 0.3,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: isTablet ? 20 : 16,
    justifyContent: "center",
  },
  errorText: {
    fontSize: isTablet ? 18 : 16,
    color: "#ff6b6b",
    marginLeft: isTablet ? 14 : 10,
  },
});

export default SpecificSearch;
