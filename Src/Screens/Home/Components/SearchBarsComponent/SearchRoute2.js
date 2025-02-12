"use client"

import { useState, useEffect, useRef } from "react"
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
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faTimes, faExchangeAlt, faSearch, faTrash, faMapMarkerAlt, faHistory, faArrowUp } from "@fortawesome/free-solid-svg-icons"
import routesData from "../MapComponent/data/routes.json"
import { points } from "../MapComponent/data"

const { width, height } = Dimensions.get("window")

export const SearchRoute2 = ({ onClose, onSearch }) => {
  const [originText, setOriginText] = useState("")
  const [destinationText, setDestinationText] = useState("")
  const [searchHistory, setSearchHistory] = useState([])
  const [originData, setOriginData] = useState([])
  const [destinationData, setDestinationData] = useState([])
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false)
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false)
  const slideAnim = useRef(new Animated.Value(height)).current

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [slideAnim])

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose())
  }

  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem("searchHistory")
        if (savedHistory) {
          setSearchHistory(JSON.parse(savedHistory))
        }
      } catch (error) {
        console.error("Error al cargar el historial de búsqueda:", error)
      }
    }
    loadSearchHistory()
  }, [])

  const filterSuggestions = (text, isOrigin) => {
    if (text.trim().length > 0) {
      const suggestions = points.filter((point) => point.name.toLowerCase().includes(text.toLowerCase()))
      if (isOrigin) {
        setOriginData(suggestions)
        setShowOriginSuggestions(true)
      } else {
        setDestinationData(suggestions)
        setShowDestinationSuggestions(true)
      }
    } else {
      if (isOrigin) {
        setOriginData([])
        setShowOriginSuggestions(false)
      } else {
        setDestinationData([])
        setShowDestinationSuggestions(false)
      }
    }
  }

  const handleOriginChange = (text) => {
    setOriginText(text)
    filterSuggestions(text, true)
  }

  const handleDestinationChange = (text) => {
    setDestinationText(text)
    filterSuggestions(text, false)
  }

  const selectSuggestion = (name, isOrigin) => {
    if (isOrigin) {
      setOriginText(name)
      setShowOriginSuggestions(false)
    } else {
      setDestinationText(name)
      setShowDestinationSuggestions(false)
    }
  }

  const swapLocations = () => {
    const temp = originText
    setOriginText(destinationText)
    setDestinationText(temp)
  }

  const handleSearch = async () => {
    if (originText.trim() === "" || destinationText.trim() === "") {
      Alert.alert("Error", "Por favor, complete ambos campos de búsqueda.")
      return
    }

    const originInput = originText.trim().toLowerCase()
    const destinationInput = destinationText.trim().toLowerCase()

    const originExists = points.some((point) => point.name.toLowerCase() === originInput)
    const destinationExists = points.some((point) => point.name.toLowerCase() === destinationInput)

    if (!originExists || !destinationExists) {
      Alert.alert("Error", "El origen o destino no existen en el mapa. Por favor, verifique los nombres.")
      return
    }

    const matchingRoute = routesData.routes.find((route) => {
      const parts = route.name.split(" - ")
      if (parts.length < 2) return false
      const routeOrigin = parts[0].trim().toLowerCase()
      const routeDestination = parts[1].trim().toLowerCase()
      return (
        (routeOrigin === originInput && routeDestination === destinationInput) ||
        (routeOrigin === destinationInput && routeDestination === originInput)
      )
    })

    if (!matchingRoute) {
      Alert.alert("Error", "No se encontró ruta que coincida con origen y destino.")
      return
    }

    onSearch(matchingRoute)
    console.log("onSearch:", matchingRoute)

    const search = {
      origin: originText.trim(),
      destination: destinationText.trim(),
    }
    try {
      setSearchHistory((prevHistory) => {
        const newHistory = [search, ...prevHistory.filter((item) => JSON.stringify(item) !== JSON.stringify(search))]
        AsyncStorage.setItem("searchHistory", JSON.stringify(newHistory))
        return newHistory
      })
    } catch (error) {
      console.error("Error al actualizar el historial de búsqueda:", error)
    }
  }

  const selectSearchFromHistory = (item) => {
    setOriginText(item.origin)
    setDestinationText(item.destination)
  }

  const clearSearchHistory = async () => {
    try {
      setSearchHistory([])
      await AsyncStorage.removeItem("searchHistory")
    } catch (error) {
      console.error("Error al limpiar el historial de búsqueda:", error)
    }
  }

  const removeSearchItem = async (item) => {
    try {
      const newHistory = searchHistory.filter((historyItem) => JSON.stringify(historyItem) !== JSON.stringify(item))
      setSearchHistory(newHistory)
      await AsyncStorage.setItem("searchHistory", JSON.stringify(newHistory))
    } catch (error) {
      console.error("Error al eliminar el elemento del historial de búsqueda:", error)
    }
  }

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity style={styles.suggestionItem} onPress={() => selectSuggestion(item.name, item.isOrigin)}>
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  )

  return (
    <Animated.View style={[styles.overlay, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Buscar Ruta</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <FontAwesomeIcon icon={faTimes} size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputWrapper}>
            <FontAwesomeIcon icon={faArrowUp} size={20} color="#0033A0" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Origen"
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
            <FontAwesomeIcon icon={faMapMarkerAlt} size={20} color="#0033A0" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Destino"
              value={destinationText}
              onChangeText={handleDestinationChange}
            />
          </View>
          {showDestinationSuggestions && (
            <FlatList
              data={destinationData.map((item) => ({ ...item, isOrigin: false }))}
              renderItem={renderSuggestion}
              keyExtractor={(item) => item.id}
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
                <FontAwesomeIcon icon={faHistory} size={18} color="#0033A0" style={styles.historyIcon} />
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
    </Animated.View>
  )
}

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
    borderRadius: 20,
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#0033A0",
  },
  closeButton: {
    backgroundColor: "#0033A0",
    borderRadius: 20,
    padding: 8,
  },
  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  suggestionList: {
    maxHeight: 150,
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginTop: -10,
    marginBottom: 15,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
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
    padding: 15,
    borderRadius: 15,
  },
  searchButton: {
    backgroundColor: "#0033A0",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 18,
  },
  searchHistoryContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
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
    fontSize: 20,
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
    paddingVertical: 15,
  },
  historyIcon: {
    marginRight: 10,
  },
  searchHistoryText: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  clearHistoryButton: {
    marginTop: 15,
    paddingVertical: 15,
    backgroundColor: "#0033A0",
    borderRadius: 15,
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
})

export default SearchRoute2

