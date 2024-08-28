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
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTimes,
  faMapMarkerAlt,
  faArrowUp,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

    // Verificar si el origen y destino existen en los puntos del mapa
    const originExists = points.some(point => new RegExp(`^${originText.trim()}$`, 'i').test(point.name)); //  
    const destinationExists = points.some(point => new RegExp(`^${destinationText.trim()}$`, 'i').test(point.name));

    if (!originExists || !destinationExists) {
      Alert.alert("Error", "El origen o destino no existen en el mapa. Por favor, verifique los nombres.");
      return;
    }
    
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
      onSearch(search);
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
  };

  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <KeyboardAvoidingView style={styles.modalBackground} behavior="padding">
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <View style={styles.header}>
              <Text style={styles.inputLabel}>Origen:</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <FontAwesomeIcon icon={faTimes} size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.iconWrapper}>
                <FontAwesomeIcon icon={faArrowUp} size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Origen"
                placeholderTextColor={"gray"}
                value={originText}
                onChangeText={setOriginText}
              />
            </View>
            <Text style={styles.inputLabel}>Destino:</Text>
            <View style={styles.inputContainer}>
              <View style={styles.iconWrapper}>
                <FontAwesomeIcon icon={faMapMarkerAlt} size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Destino"
                placeholderTextColor={"gray"}
                value={destinationText}
                onChangeText={setDestinationText}
              />
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.iconButton} onPress={swapLocations}>
                <FontAwesomeIcon icon={faExchangeAlt} size={20} color="#0033A0" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>Iniciar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchHistoryContainer}>
            <Text style={styles.searchHistoryTitle}>Historial de Busqueda</Text>
            <ScrollView contentContainerStyle={styles.searchHistoryList}>
              {searchHistory.map((item, index) => (
                <View key={index} style={styles.searchHistoryItem}>
                  <TouchableOpacity
                    onPress={() => selectSearchFromHistory(item)}
                    style={styles.searchHistoryText}
                  >
                    <Text>{item.origin} - {item.destination}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeSearchItem(item)}>
                    <FontAwesomeIcon icon={faTimes} size={15} color="red" style={styles.removeIcon} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.clearHistoryButton} onPress={clearSearchHistory}>
              <Text style={styles.clearHistoryButtonText}>Limpiar Historial</Text>
            </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarContainer: {
    width: "90%",
    alignItems: "center",
    marginTop: 5, 
  },
  searchBar: {
    backgroundColor: "#0033A0",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "transparent",
  },
  inputLabel: {
    color: "#fff",
    fontSize: 16,
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10, 
    marginVertical: 5,
    padding: 8,
    width: "100%",
  },
  iconWrapper: {
    borderRadius: 5,
    padding: 5,
    marginRight: 5,
  },
  input: {
    flex: 1,
    paddingHorizontal: 2,
    fontSize: 16,
    borderRadius: 10, 
    color: "#000",
    height: 30,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "flex-end",
    width: "100%",
  },
  iconButton: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -25 }],
  },
  searchButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  searchHistoryContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    maxHeight: 300,
  },
  searchHistoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  searchHistoryList: {
    flexGrow: 1,
  },
  searchHistoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
  },
  searchHistoryText: {
    flex: 1,
  },
  removeIcon: {
    marginLeft: 10,
  },
  clearHistoryButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: "#ff6347",
    borderRadius: 5,
    alignItems: "center",
  },
  clearHistoryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SearchRoute;
