import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  Animated,
  TextInput,
  FlatList,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTimes,
  faExchangeAlt,
  faSearch,
  faTrash,
  faMapMarkerAlt,
  faHistory,
  faArrowUp,
  faRoute,
  faLocationArrow,
  faFlag,
  faDirections,
  faCompass,
  faBus,
  faWalking,
  faBuilding,
  faBookBookmark,
  faFlask,
  faBank,
  faUtensils,
  faCoffee,
} from "@fortawesome/free-solid-svg-icons";
import routesData from "../MapComponent/data/routes.json";
import { points } from "../MapComponent/data";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;
const isAndroid = Platform.OS === "android";

// 🔹 Utilidad para quitar acentos y pasar a minúsculas
const normalize = (s = "") =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const getIconForLocation = (text = "") => {
  const t = normalize(text);

  const map = [
    { keys: ["modulo"], icon: faBuilding },
    { keys: ["entrada"], icon: faFlag },
    { keys: ["biblioteca"], icon: faBookBookmark },
    { keys: ["laboratorio"], icon: faFlask },
    { keys: ["jobs"], icon: faBank },
    { keys: ["santander", "banco"], icon: faBank },
    { keys: ["edificio"], icon: faBuilding },
    { keys: ["comida"], icon: faUtensils },
    { keys: ["cafebreria", "flor de cordoba"], icon: faCoffee },
  ];

  return (
    map.find(({ keys }) => keys.some((k) => t.includes(k)))?.icon ||
    faMapMarkerAlt
  );
};

// Función para obtener colores específicos
// 🔹 Normalizador para quitar acentos
const getColorForLocation = (text = "") => {
  const t = normalize(text);

  const map = [
    { keys: ["modulo"], color: "#1E40AF" },
    { keys: ["entrada"], color: "#059669" },
    { keys: ["edificio"], color: "#374151" },
    { keys: ["biblioteca"], color: "#7C3AED" },
    { keys: ["laboratorio"], color: "#DC2626" },
  ];

  return map.find(({ keys }) => keys.some((k) => t.includes(k)))?.color || "#0033A0";
};


export const SearchRoute2 = ({ onClose, onSearch }) => {
  const [originText, setOriginText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [originData, setOriginData] = useState([]);
  const [destinationData, setDestinationData] = useState([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem("searchHistory");
        if (savedHistory) {
          setSearchHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error("Error al cargar el historial de búsqueda:", error);
      }
    };
    loadSearchHistory();
  }, []);

  const normalizeText = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const filterSuggestions = (text, isOrigin) => {
    const normalizedText = normalizeText(text);
    if (normalizedText.length > 0) {
      const suggestions = points.filter((point) =>
        normalizeText(point.name).includes(normalizedText)
      );
      if (isOrigin) {
        setOriginData(suggestions);
        setShowOriginSuggestions(true);
      } else {
        setDestinationData(suggestions);
        setShowDestinationSuggestions(true);
      }
    } else {
      if (isOrigin) {
        setOriginData([]);
        setShowOriginSuggestions(false);
      } else {
        setDestinationData([]);
        setShowDestinationSuggestions(false);
      }
    }
  };

  const handleOriginChange = (text) => {
    setOriginText(text);
    filterSuggestions(text, true);
  };

  const handleDestinationChange = (text) => {
    setDestinationText(text);
    filterSuggestions(text, false);
  };

  const selectSuggestion = (name, isOrigin) => {
    if (isOrigin) {
      setOriginText(name);
      setShowOriginSuggestions(false);
    } else {
      setDestinationText(name);
      setShowDestinationSuggestions(false);
    }
  };

  const swapLocations = () => {
    const temp = originText;
    setOriginText(destinationText);
    setDestinationText(temp);
    filterSuggestions(destinationText, true);
    filterSuggestions(originText, false);
  };

  const handleSearch = async () => {
    if (originText.trim() === "" || destinationText.trim() === "") {
      Alert.alert("Error", "Por favor, complete ambos campos de búsqueda.");
      return;
    }

    const originInput = normalizeText(originText.trim());
    const destinationInput = normalizeText(destinationText.trim());

    const originExists = points.some(
      (point) => normalizeText(point.name) === originInput
    );
    const destinationExists = points.some(
      (point) => normalizeText(point.name) === destinationInput
    );

    if (!originExists || !destinationExists) {
      Alert.alert(
        "Error",
        "El origen o destino no existen en el mapa. Por favor, verifique los nombres."
      );
      return;
    }

    const matchingRoute = routesData.routes.find((route) => {
      const parts = route.name.split(" - ");
      if (parts.length < 2) return false;
      const routeOrigin = normalizeText(parts[0].trim());
      const routeDestination = normalizeText(parts[1].trim());
      return (
        (routeOrigin === originInput &&
          routeDestination === destinationInput) ||
        (routeOrigin === destinationInput && routeDestination === originInput)
      );
    });

    if (!matchingRoute) {
      Alert.alert(
        "Error",
        "No se encontró ruta que coincida con origen y destino."
      );
      return;
    }

    const [routeOrigin, routeDestination] = matchingRoute.name.split(" - ").map(p => p.trim().toUpperCase());

    const updatedRoute = {
      ...matchingRoute,
      coordinates:
        routeOrigin === destinationInput.toUpperCase() &&
          routeDestination === originInput.toUpperCase()
          ? matchingRoute.coordinates.toReversed()
          : matchingRoute.coordinates,
      name:
        routeOrigin === destinationInput.toUpperCase() &&
          routeDestination === originInput.toUpperCase()
          ? `${routeDestination} - ${routeOrigin}`
          : matchingRoute.name,
    };

    onSearch(updatedRoute);

    const search = {
      origin: originText.trim(),
      destination: destinationText.trim(),
    };
    try {
      setSearchHistory((prevHistory) => {
        const newHistory = [
          search,
          ...prevHistory.filter(
            (item) => JSON.stringify(item) !== JSON.stringify(search)
          ),
        ];
        AsyncStorage.setItem("searchHistory", JSON.stringify(newHistory));
        return newHistory;
      });
    } catch (error) {
      console.error("Error al actualizar el historial de búsqueda:", error);
    }
  };

  const selectSearchFromHistory = (item) => {
    setOriginText(item.origin);
    setDestinationText(item.destination);
  };

  const clearSearchHistory = async () => {
    try {
      setSearchHistory([]);
      await AsyncStorage.removeItem("searchHistory");
    } catch (error) {
      console.error("Error al limpiar el historial de búsqueda:", error);
    }
  };

  const removeSearchItem = async (item) => {
    try {
      const newHistory = searchHistory.filter(
        (historyItem) => JSON.stringify(historyItem) !== JSON.stringify(item)
      );
      setSearchHistory(newHistory);
      await AsyncStorage.setItem("searchHistory", JSON.stringify(newHistory));
    } catch (error) {
      console.error(
        "Error al eliminar el elemento del historial de búsqueda:",
        error
      );
    }
  };

  const renderSuggestion = ({ item }) => {
    const itemColor = getColorForLocation(item.name);
    return (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => selectSuggestion(item.name, item.isOrigin)}
        activeOpacity={0.8}>
        <View
          style={[
            styles.suggestionIcon,
            { backgroundColor: `${itemColor}18` },
          ]}>
          <FontAwesomeIcon
            icon={getIconForLocation(item.name)}
            size={isAndroid ? 12 : 16}
            color={itemColor}
          />
        </View>
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View
      style={[styles.overlay, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Buscar Ruta</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <FontAwesomeIcon
                icon={faTimes}
                size={isAndroid ? 18 : 24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconContainer}>
              <FontAwesomeIcon
                icon={faLocationArrow}
                size={isAndroid ? 14 : 18}
                color="#0033A0"
              />
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Origen"
              placeholderTextColor="#999"
              value={originText}
              onChangeText={handleOriginChange}
            />
          </View>
          {showOriginSuggestions && (
            <FlatList
              data={originData.map((item) => ({ ...item, isOrigin: true }))}
              renderItem={renderSuggestion}
              keyExtractor={(item) => item.id}
              style={styles.suggestionList}
            />
          )}
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconContainer}>
              <FontAwesomeIcon
                icon={faFlag}
                size={isAndroid ? 14 : 18}
                color="#DC2626"
              />
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Destino"
              placeholderTextColor="#999"
              value={destinationText}
              onChangeText={handleDestinationChange}
            />
          </View>
          {showDestinationSuggestions && (
            <FlatList
              data={destinationData.map((item) => ({
                ...item,
                isOrigin: false,
              }))}
              renderItem={renderSuggestion}
              keyExtractor={(item) => item.id}
              style={styles.suggestionList}
            />
          )}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={swapLocations}
              activeOpacity={0.8}>
              <FontAwesomeIcon
                icon={faExchangeAlt}
                size={isAndroid ? 16 : 20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
              activeOpacity={0.8}>
              <FontAwesomeIcon
                icon={faRoute}
                size={isAndroid ? 16 : 20}
                color="#FFFFFF"
              />
              <Text style={styles.searchButtonText}>Buscar Ruta</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchHistoryContainer}>
          <Text style={styles.searchHistoryTitle}>Historial de Búsqueda</Text>
          <ScrollView style={styles.searchHistoryList}>
            {searchHistory.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.searchHistoryItem}
                onPress={() => selectSearchFromHistory(item)}>
                <FontAwesomeIcon
                  icon={faHistory}
                  size={isAndroid ? 14 : 18}
                  color="#0033A0"
                  style={styles.historyIcon}
                />
                <Text style={styles.searchHistoryText}>
                  {item.origin} - {item.destination}
                </Text>
                <TouchableOpacity onPress={() => removeSearchItem(item)}>
                  <FontAwesomeIcon
                    icon={faTimes}
                    size={isAndroid ? 14 : 18}
                    color="#ff6347"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {searchHistory.length > 0 && (
            <TouchableOpacity
              style={styles.clearHistoryButton}
              onPress={clearSearchHistory}>
              <FontAwesomeIcon
                icon={faTrash}
                size={isAndroid ? 14 : 18}
                color="#FFFFFF"
              />
              <Text style={styles.clearHistoryButtonText}>
                Limpiar Historial
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 51, 160, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  searchBarContainer: {
    width: isAndroid ? "95%" : "90%",
    maxWidth: isAndroid ? 360 : 400,
    marginTop: isAndroid ? 10 : 20,
    alignItems: "center",
    position: "absolute",
    top: isAndroid ? "8%" : "10%",
  },
  searchBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: isAndroid ? 20 : 25,
    padding: isAndroid ? 16 : 24,
    width: "100%",
    alignItems: "center",
    marginBottom: isAndroid ? 12 : 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: isAndroid ? 4 : 8 },
    shadowOpacity: isAndroid ? 0.25 : 0.15,
    shadowRadius: isAndroid ? 8 : 16,
    elevation: isAndroid ? 8 : 12,
    borderWidth: isAndroid ? 0 : 1,
    borderColor: isAndroid ? "transparent" : "rgba(0, 51, 160, 0.1)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: isAndroid ? 16 : 24,
  },
  headerTitle: {
    fontSize: isAndroid ? 20 : 26,
    fontWeight: "700",
    color: "#0033A0",
    letterSpacing: 0.3,
  },
  closeButton: {
    backgroundColor: "#0033A0",
    borderRadius: isAndroid ? 18 : 25,
    padding: isAndroid ? 8 : 12,
    shadowColor: "#0033A0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isAndroid ? 0.4 : 0.3,
    shadowRadius: 3,
    elevation: isAndroid ? 5 : 4,
    width: isAndroid ? 36 : 50,
    height: isAndroid ? 36 : 50,
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: isAndroid ? 16 : 20,
    paddingHorizontal: isAndroid ? 14 : 20,
    paddingVertical: isAndroid ? 10 : 16,
    marginBottom: isAndroid ? 10 : 16,
    borderWidth: isAndroid ? 0 : 2,
    borderColor: isAndroid ? "transparent" : "rgba(0, 51, 160, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isAndroid ? 0.15 : 0.05,
    shadowRadius: 2,
    // elevation: isAndroid ? 3 : 2,
  },
  inputIconContainer: {
    width: isAndroid ? 28 : 32,
    height: isAndroid ? 28 : 32,
    borderRadius: isAndroid ? 14 : 16,
    backgroundColor: "rgba(0, 51, 160, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: isAndroid ? 8 : 12,
  },
  textInput: {
    flex: 1,
    fontSize: isAndroid ? 14 : 16,
    color: "#1F2937",
    fontWeight: "500",
    paddingVertical: isAndroid ? 2 : 0,
  },
  suggestionList: {
    maxHeight: isAndroid ? 140 : 180,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: isAndroid ? 0 : 1,
    borderColor: isAndroid ? "transparent" : "rgba(0, 51, 160, 0.1)",
    borderRadius: isAndroid ? 12 : 16,
    marginTop: isAndroid ? -6 : -10,
    marginBottom: isAndroid ? 8 : 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isAndroid ? 0.2 : 0.1,
    shadowRadius: isAndroid ? 4 : 8,
    // elevation: isAndroid ? 4 : 6,
    overflow: "hidden",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: isAndroid ? 12 : 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 51, 160, 0.06)",
    backgroundColor: "#FFFFFF",
  },
  suggestionIcon: {
    width: isAndroid ? 26 : 32,
    height: isAndroid ? 26 : 32,
    borderRadius: isAndroid ? 13 : 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: isAndroid ? 8 : 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isAndroid ? 0.15 : 0.1,
    shadowRadius: 1,
    // elevation: isAndroid ? 2 : 2,
  },
  itemText: {
    fontSize: isAndroid ? 14 : 16,
    color: "#1F2937",
    fontWeight: "500",
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: isAndroid ? 16 : 24,
    width: "100%",
    gap: isAndroid ? 8 : 12,
  },
  iconButton: {
    backgroundColor: "#0033A0",
    padding: isAndroid ? 12 : 18,
    borderRadius: isAndroid ? 16 : 20,
    shadowColor: "#0033A0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isAndroid ? 0.4 : 0.3,
    shadowRadius: 3,
    // elevation: isAndroid ? 5 : 6,
    width: isAndroid ? 44 : 56,
    height: isAndroid ? 44 : 56,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButton: {
    backgroundColor: "#0033A0",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: isAndroid ? 12 : 18,
    paddingHorizontal: isAndroid ? 16 : 28,
    borderRadius: isAndroid ? 16 : 20,
    flex: 1,
    justifyContent: "center",
    shadowColor: "#0033A0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isAndroid ? 0.4 : 0.3,
    shadowRadius: 3,
    // elevation: isAndroid ? 5 : 6,
    minHeight: isAndroid ? 44 : 56,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginLeft: isAndroid ? 6 : 12,
    fontSize: isAndroid ? 14 : 16,
    letterSpacing: 0.3,
  },
  searchHistoryContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: isAndroid ? 20 : 25,
    padding: isAndroid ? 16 : 24,
    width: "100%",
    maxHeight: height * (isAndroid ? 0.35 : 0.4),
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: isAndroid ? 4 : 8 },
    shadowOpacity: isAndroid ? 0.25 : 0.15,
    shadowRadius: isAndroid ? 8 : 16,
    // elevation: isAndroid ? 8 : 12,
    borderWidth: isAndroid ? 0 : 1,
    borderColor: isAndroid ? "transparent" : "rgba(0, 51, 160, 0.1)",
  },
  searchHistoryTitle: {
    fontSize: isAndroid ? 18 : 22,
    fontWeight: "700",
    marginBottom: isAndroid ? 12 : 20,
    color: "#0033A0",
    letterSpacing: 0.3,
  },
  searchHistoryList: {
    flexGrow: 0,
  },
  searchHistoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 51, 160, 0.06)",
    paddingVertical: isAndroid ? 10 : 16,
    paddingHorizontal: 2,
  },
  historyIcon: {
    marginRight: isAndroid ? 8 : 12,
    backgroundColor: "rgba(0, 51, 160, 0.12)",
    borderRadius: isAndroid ? 8 : 12,
    padding: isAndroid ? 6 : 8,
    width: isAndroid ? 28 : 32,
    height: isAndroid ? 28 : 32,
    justifyContent: "center",
    alignItems: "center",
  },
  searchHistoryText: {
    flex: 1,
    fontSize: isAndroid ? 13 : 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  clearHistoryButton: {
    marginTop: isAndroid ? 12 : 20,
    paddingVertical: isAndroid ? 10 : 16,
    backgroundColor: "#0033A0",
    borderRadius: isAndroid ? 16 : 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0033A0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isAndroid ? 0.4 : 0.3,
    shadowRadius: 3,
    // elevation: isAndroid ? 5 : 6,
    minHeight: isAndroid ? 40 : 48,
  },
  clearHistoryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginLeft: isAndroid ? 6 : 10,
    fontSize: isAndroid ? 13 : 16,
    letterSpacing: 0.3,
  },
});

export default SearchRoute2;
