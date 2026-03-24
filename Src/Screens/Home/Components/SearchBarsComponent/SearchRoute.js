import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Platform,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes, faMapMarkerAlt, faArrowUp, faExchangeAlt, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export const SearchRoute = ({ onClose, onSearch, points }) => {
  const [originText, setOriginText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const slideAnim = useRef(new Animated.Value(height)).current; // Estado animado


  // Animación de entrada
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0, // Lo mueve a la pantalla
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Animación de salida
  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: height, // Lo mueve fuera de la pantalla
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose()); // Luego cierra el modal
  };

  // Cargar el historial de búsqueda al montar el componente
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

  // Manejar la búsqueda de rutas
  const handleSearch = async () => {
    // Validar los campos de entrada
    if (originText.trim() === "" || destinationText.trim() === "") {
      Alert.alert("Error", "Por favor, complete ambos campos de búsqueda.");
      return;
    }

    // Verificar si el origen y destino existen en los puntos
    const originExists = points.some(point => new RegExp(`^${originText.trim()}$`, 'i').test(point.name));
    const destinationExists = points.some(point => new RegExp(`^${destinationText.trim()}$`, 'i').test(point.name));

    if (!originExists || !destinationExists) {
      Alert.alert("Error", "El origen o destino no existen en el mapa. Por favor, verifique los nombres.");
      return;
    }

    // Preparar y ejecutar la búsqueda
    const searchKey = `${originText.trim()} - ${destinationText.trim()}`;
    const reverseSearchKey = `${destinationText.trim()} - ${originText.trim()}`;

    // Llamar a la función de búsqueda proporcionada por el componente HomePage
    onSearch({ searchKey, reverseSearchKey });
    console.log('onSearch:', { searchKey, reverseSearchKey });

    // Actualizar el historial de búsqueda
    const search = { origin: originText.trim(), destination: destinationText.trim() };
    try {
      setSearchHistory((prevHistory) => {
        const newHistory = [
          search,
          ...prevHistory.filter((item) => JSON.stringify(item) !== JSON.stringify(search)),
        ];
        AsyncStorage.setItem("searchHistory", JSON.stringify(newHistory));
        return newHistory;
      });
    } catch (error) {
      console.error("Error al actualizar el historial de búsqueda:", error);
    }
  };

  // Seleccionar una búsqueda del historial
  const selectSearchFromHistory = (item) => {
    setOriginText(item.origin);
    setDestinationText(item.destination);
  };

  // Limpiar todo el historial de búsqueda
  const clearSearchHistory = async () => {
    try {
      setSearchHistory([]);
      await AsyncStorage.removeItem("searchHistory");
    } catch (error) {
      console.error("Error al limpiar el historial de búsqueda:", error);
    }
  };

  // Eliminar un elemento específico del historial de búsqueda
  const removeSearchItem = async (item) => {
    try {
      setSearchHistory((prevHistory) =>
        prevHistory.filter((historyItem) => JSON.stringify(historyItem) !== JSON.stringify(item))
      );
      await AsyncStorage.setItem(
        "searchHistory",
        JSON.stringify(searchHistory.filter((historyItem) => JSON.stringify(historyItem) !== JSON.stringify(item)))
      );
    } catch (error) {
      console.error("Error al eliminar el elemento del historial de búsqueda:", error);
    }
  };

  // Intercambiar los campos de origen y destino
  const swapLocations = () => {
    setOriginText(destinationText);
    setDestinationText(originText);
  };

  // Manejar los cambios en los campos de entrada y generar sugerencias
  const handleInputChange = (text, isOrigin) => {
    if (isOrigin) {
      setOriginText(text);
    } else {
      setDestinationText(text);
    }

    if (text.trim().length > 0) {
      const suggestions = points
        .filter(point =>
          point.name.toLowerCase().startsWith(text.toLowerCase()) ||
          point.id.toLowerCase().includes(text.toLowerCase()) ||
          (point.aliases && point.aliases.some(alias => alias.toLowerCase().includes(text.toLowerCase())))
        )
        .map(point => point.name);

      if (isOrigin) {
        setOriginSuggestions(suggestions);
      } else {
        setDestinationSuggestions(suggestions);
      }
    } else {
      if (isOrigin) {
        setOriginSuggestions([]);
      } else {
        setDestinationSuggestions([]);
      }
    }
  };

  // Manejar los cambios en el campo de origen
  const handleOriginChange = (text) => handleInputChange(text, true);

  // Manejar los cambios en el campo de destino
  const handleDestinationChange = (text) => handleInputChange(text, false);

  // Seleccionar una sugerencia para origen o destino
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
    <Animated.View style={[styles.overlay, { transform: [{ translateY: slideAnim }] }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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
              <TouchableOpacity style={styles.clearHistoryButton} onPress={clearSearchHistory}>
                <FontAwesomeIcon icon={faTrash} size={18} color="#FFFFFF" />
                <Text style={styles.clearHistoryButtonText}>Limpiar Historial</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
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
    zIndex: 1000, // Asegura que esté sobre todos los elementos
    elevation: 10, // Necesario en Android para sobreponer vistas
  },
  container: {
    width: "100%",
    maxWidth: 500,
    // backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
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

export default SearchRoute;
