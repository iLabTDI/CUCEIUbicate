import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTimes,
  faMapMarkerAlt,
  faArrowUp,
  faExchangeAlt,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Importa el archivo JSON con las rutas definidas (por ejemplo, "Biblioteca - Modulo X", etc.)
import routesData from "../MapComponent/data/routes.json";
// Importa el arreglo de puntos completo, con todas las IDs y nombres disponibles
import { points } from "../MapComponent/data";

const { width, height } = Dimensions.get("window");

export const SearchRoute2 = ({ onClose, onSearch }) => {
  const [originText, setOriginText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const slideAnim = useRef(new Animated.Value(height)).current; // Animación para mostrar el modal

  // Animación de entrada
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Animación de salida y cierre
  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  // Cargar el historial de búsqueda desde AsyncStorage
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

  // Manejar la búsqueda
  const handleSearch = async () => {
    if (originText.trim() === "" || destinationText.trim() === "") {
      Alert.alert("Error", "Por favor, complete ambos campos de búsqueda.");
      return;
    }

    const originInput = originText.trim().toLowerCase();
    const destinationInput = destinationText.trim().toLowerCase();

    // Verificar que los dos puntos existan en el arreglo de puntos (usando id o name)
    const originExists = points.some(
      (point) =>
        point.id.toLowerCase() === originInput ||
        point.name.toLowerCase() === originInput
    );
    const destinationExists = points.some(
      (point) =>
        point.id.toLowerCase() === destinationInput ||
        point.name.toLowerCase() === destinationInput
    );

    if (!originExists || !destinationExists) {
      Alert.alert(
        "Error",
        "El origen o destino no existen en el mapa. Por favor, verifique los nombres."
      );
      return;
    }

    // Buscar en el JSON de rutas una ruta que conecte ambos puntos.
    // Se espera que el nombre de la ruta esté en el formato "Origen - Destino".
    const matchingRoute = routesData.routes.find((route) => {
      const parts = route.name.split(" - ");
      if (parts.length < 2) return false;
      const routeOrigin = parts[0].trim().toLowerCase();
      const routeDestination = parts[1].trim().toLowerCase();
      return (
        (routeOrigin === originInput && routeDestination === destinationInput) ||
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

    // Llama a onSearch pasando la ruta encontrada del JSON
    onSearch(matchingRoute);
    console.log("onSearch:", matchingRoute);

    // Actualizar el historial de búsqueda
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

  // Seleccionar un elemento del historial para rellenar los campos
  const selectSearchFromHistory = (item) => {
    setOriginText(item.origin);
    setDestinationText(item.destination);
  };

  // Limpiar el historial de búsqueda
  const clearSearchHistory = async () => {
    try {
      setSearchHistory([]);
      await AsyncStorage.removeItem("searchHistory");
    } catch (error) {
      console.error("Error al limpiar el historial de búsqueda:", error);
    }
  };

  // Eliminar un elemento específico del historial
  const removeSearchItem = async (item) => {
    try {
      const newHistory = searchHistory.filter(
        (historyItem) =>
          JSON.stringify(historyItem) !== JSON.stringify(item)
      );
      setSearchHistory(newHistory);
      await AsyncStorage.setItem("searchHistory", JSON.stringify(newHistory));
    } catch (error) {
      console.error("Error al eliminar el elemento del historial de búsqueda:", error);
    }
  };

  // Intercambiar los campos de origen y destino
  const swapLocations = () => {
    setOriginText(destinationText);
    setDestinationText(originText);
  };

  // Generar sugerencias a partir del arreglo de puntos (todas las IDs disponibles)
  const handleInputChange = (text, isOrigin) => {
    if (isOrigin) {
      setOriginText(text);
      if (text.trim().length > 0) {
        const suggestions = points
          .map((point) => point.id)
          .filter((id) => id.toLowerCase().startsWith(text.toLowerCase()));
        const uniqueSuggestions = Array.from(new Set(suggestions));
        setOriginSuggestions(uniqueSuggestions);
      } else {
        setOriginSuggestions([]);
      }
    } else {
      setDestinationText(text);
      if (text.trim().length > 0) {
        const suggestions = points
          .map((point) => point.id)
          .filter((id) => id.toLowerCase().startsWith(text.toLowerCase()));
        const uniqueSuggestions = Array.from(new Set(suggestions));
        setDestinationSuggestions(uniqueSuggestions);
      } else {
        setDestinationSuggestions([]);
      }
    }
  };

  const handleOriginChange = (text) => handleInputChange(text, true);
  const handleDestinationChange = (text) => handleInputChange(text, false);

  const selectSuggestion = (text, isOrigin) => {
    if (isOrigin) {
      setOriginText(text);
      setOriginSuggestions([]);
    } else {
      setDestinationText(text);
      setDestinationSuggestions([]);
    }
  };

  return (
    <Animated.View
      style={[styles.overlay, { transform: [{ translateY: slideAnim }] }]}
    >
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Buscar Ruta</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <FontAwesomeIcon icon={faTimes} size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faArrowUp} size={20} color="#0033A0" />
            <TextInput
              style={styles.input}
              placeholder="Origen:"
              placeholderTextColor={"#888888"}
              value={originText}
              onChangeText={handleOriginChange}
            />
          </View>
          {originSuggestions.length > 0 && (
            <FlatList
              data={originSuggestions}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => selectSuggestion(item, true)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
              style={styles.suggestionList}
            />
          )}
          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faMapMarkerAlt} size={20} color="#0033A0" />
            <TextInput
              style={styles.input}
              placeholder="Destino:"
              placeholderTextColor={"#888888"}
              value={destinationText}
              onChangeText={handleDestinationChange}
            />
          </View>
          {destinationSuggestions.length > 0 && (
            <FlatList
              data={destinationSuggestions}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => selectSuggestion(item, false)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
              style={styles.suggestionList}
            />
          )}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={swapLocations}>
              <FontAwesomeIcon icon={faExchangeAlt} size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <FontAwesomeIcon icon={faSearch} size={20} color="#FFFFFF" />
              <Text style={styles.searchButtonText}>Buscar</Text>
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
                onPress={() => selectSearchFromHistory(item)}
              >
                <Text style={styles.searchHistoryText}>
                  {item.origin} - {item.destination}
                </Text>
                <TouchableOpacity onPress={() => removeSearchItem(item)}>
                  <FontAwesomeIcon icon={faTimes} size={18} color="#ff6347" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {searchHistory.length > 0 && (
            <TouchableOpacity
              style={styles.clearHistoryButton}
              onPress={clearSearchHistory}
            >
              <FontAwesomeIcon icon={faTrash} size={18} color="#FFFFFF" />
              <Text style={styles.clearHistoryButtonText}>Limpiar Historial</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    elevation: 10,
  },
  searchBarContainer: {
    width: "90%",
    maxWidth: 400,
    marginTop: 20,
    alignItems: "center",
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0033A0",
  },
  closeButton: {
    backgroundColor: "#0033A0",
    borderRadius: 20,
    padding: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    width: "100%",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  searchButton: {
    backgroundColor: "#0033A0",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
  suggestionList: {
    maxHeight: 100,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  iconButton: {
    backgroundColor: "#0033A0",
    padding: 12,
    borderRadius: 10,
  },
  searchHistoryContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    maxHeight: height * 0.4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchHistoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0033A0",
  },
  searchHistoryList: {
    flexGrow: 0,
  },
  searchHistoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 12,
  },
  searchHistoryText: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },
  clearHistoryButton: {
    marginTop: 15,
    paddingVertical: 12,
    backgroundColor: "#0033A0",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  clearHistoryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
});

export default SearchRoute2;
