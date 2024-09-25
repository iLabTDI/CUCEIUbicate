import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes, faMapMarkerAlt, faArrowUp, faExchangeAlt, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get('window');

export const SearchRoute = ({ onClose, onSearch, points }) => {
  const [originText, setOriginText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem("searchHistory");
        if (savedHistory) {
          setSearchHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error("Error loading search history:", error);
      }
    };

    loadSearchHistory();
  }, []);

  const handleSearch = async () => {
    if (originText.trim() === "" || destinationText.trim() === "") {
      Alert.alert("Error", "Por favor, complete ambos campos de búsqueda.");
      return;
    }

    const originExists = points.some(point => new RegExp(`^${originText.trim()}$`, 'i').test(point.name));
    const destinationExists = points.some(point => new RegExp(`^${destinationText.trim()}$`, 'i').test(point.name));

    if (!originExists || !destinationExists) {
      Alert.alert("Error", "El origen o destino no existen en el mapa. Por favor, verifique los nombres.");
      return;
    }

    // Concatenar origen y destino en una clave única (ejemplo: "Modulo X - Modulo Z" o "Modulo Z - Modulo X")
    const searchKey = `${originText.trim()} - ${destinationText.trim()}`;
    const reverseSearchKey = `${destinationText.trim()} - ${originText.trim()}`;
    
    console.log(searchKey, reverseSearchKey);
    // Enviar ambas claves al componente principal para que intente buscar la imagen
    onSearch({ searchKey, reverseSearchKey });

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
      console.error("Error updating search history:", error);
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
      console.error("Error clearing search history:", error);
    }
  };

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
      console.error("Error removing item from search history:", error);
    }
  };

  const swapLocations = () => {
    setOriginText(destinationText);
    setDestinationText(originText);
    console.log(destinationText, originText);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <KeyboardAvoidingView 
        style={styles.modalBackground} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Buscar Ruta</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <FontAwesomeIcon icon={faTimes} size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faArrowUp} size={20} color="#0033A0" />
              <TextInput
                style={styles.input}
                placeholder="Origen: Modulo X"
                placeholderTextColor={"#888"}
                value={originText}
                onChangeText={setOriginText}
              />
            </View>
            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faMapMarkerAlt} size={20} color="#0033A0" />
              <TextInput
                style={styles.input}
                placeholder="Destino"
                placeholderTextColor={"#888"}
                value={destinationText}
                onChangeText={setDestinationText}
              />
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.iconButton} onPress={swapLocations}>
                <FontAwesomeIcon icon={faExchangeAlt} size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <FontAwesomeIcon icon={faSearch} size={20} color="#fff" />
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
                  <Text style={styles.searchHistoryText}>{item.origin} - {item.destination}</Text>
                  <TouchableOpacity onPress={() => removeSearchItem(item)}>
                    <FontAwesomeIcon icon={faTimes} size={18} color="#ff6347" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {searchHistory.length > 0 && (
              <TouchableOpacity style={styles.clearHistoryButton} onPress={clearSearchHistory}>
                <FontAwesomeIcon icon={faTrash} size={18} color="#fff" />
                <Text style={styles.clearHistoryButtonText}>Limpiar Historial</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: height * 0.05,
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
    shadowColor: "#000",
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
    fontSize: 24,
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
  searchButton: {
    backgroundColor: "#0033A0",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
  searchHistoryContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    maxHeight: height * 0.4,
    shadowColor: "#000",
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
    color: "#333",
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
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
});

export default SearchRoute;
