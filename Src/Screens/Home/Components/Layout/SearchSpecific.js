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
import { faSearch, faTimes, faHistory } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get('window');

export const SpecificSearch = ({ onSearch, points, setShowSpecificSearch }) => {
  const [showSpecificSearch, setShowSpecificSearchState] = useState(false);
  const [specificSearchText, setSpecificSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  useEffect(() => {
    loadSearchHistory();
    if (showSpecificSearch) {
      setTimeout(() => inputRef.current?.focus(), 300); // Asegurar que el input reciba el foco (bug de android)
    }
    setShowSpecificSearch(showSpecificSearch); // Actualizar el estado en HomePage que recibe el objeto
  }, [showSpecificSearch]);

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
    if (showSpecificSearch) {
      closeSearch();
    } else {
      openSearch();
    }
  };

  const openSearch = () => {
    setShowSpecificSearchState(true);
    Animated.timing(animatedWidth, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  const closeSearch = () => {  //Animacion al cerrar la barra buscadora
    Keyboard.dismiss();
    Animated.timing(animatedWidth, { 
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.cubic), 
      useNativeDriver: false,
    }).start(() => {
      setShowSpecificSearchState(false);
      setSpecificSearchText("");
      setSearchResults([]);
      setShowHistory(false);
      setShowSpecificSearch(false); // Actualizar el estado en HomePage
    });
  };

  const handleSpecificSearch = (text) => {
    setSpecificSearchText(text);
    if (text.length > 0) {
      const filteredResults = points.filter((point) =>
        point.name.toLowerCase().includes(text.toLowerCase()) ||
        point.id.toLowerCase().includes(text.toLowerCase()) ||
        (point.aliases && point.aliases.some(alias => alias.toLowerCase().includes(text.toLowerCase())))
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };
  

  const handleSelectResult = async (item) => {
    onSearch(item.id); // Esta función se encarga del zoom en el HomePage
    await updateSearchHistory(item.name);
    closeSearch();
  };

  const updateSearchHistory = async (searchTerm) => {
    const newHistory = [searchTerm, ...searchHistory.filter(term => term !== searchTerm)].slice(0, 5); 
    setSearchHistory(newHistory);
    await AsyncStorage.setItem("specificSearchHistory", JSON.stringify(newHistory));
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleSelectResult(item)}  // Seleccion del resultado de busqueda
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderHistoryItem = ({ item }) => ( // Renderiza los items de la busqueda
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        setSpecificSearchText(item);
        handleSpecificSearch(item);
      }}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.search_icon}
        onPress={toggleSpecificSearch} // Muestra la barra de busqueda
      >
        <FontAwesomeIcon icon={faSearch} size={width * 0.06} color="white" />
      </TouchableOpacity>

      {showSpecificSearch && ( 
        <Animated.View
          style={[
            styles.searchBarContainer,
            {
              transform: [{
                translateX: animatedWidth.interpolate({ 
                  inputRange: [0, 1],
                  outputRange: [150, 10],
                }),
              }],
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "83%"],
              }),
            },
          ]}
        >
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Buscar lugares..."
            placeholderTextColor="gray"
            value={specificSearchText}
            onChangeText={handleSpecificSearch}
          />
          <TouchableOpacity style={styles.historyIcon} onPress={() => setShowHistory(!showHistory)}>
            <FontAwesomeIcon icon={faHistory} size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeIcon} onPress={closeSearch}>
            <FontAwesomeIcon icon={faTimes} size={20} color="gray" />
          </TouchableOpacity>
        </Animated.View>
      )}

      {searchResults.length > 0 && !showHistory && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="always"
          />
        </View>
      )}

      {showHistory && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={searchHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item, index) => index.toString()}
            keyboardShouldPersistTaps="always"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: height * 0.05,
    right: width * 0.03,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  search_icon: {
    top: Platform.OS === 'ios' ? height * 0.001 : -height * 0.002,
    right: Platform.OS === 'ios' ? -5 : 0, 
    backgroundColor: "blue",
    borderRadius: width * 0.1,
    padding: width * 0.04,
    zIndex: 2,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 44,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: "black",
  },
  historyIcon: {
    padding: width * 0.015,
    marginRight: width * 0.015,
  },
  closeIcon: {
    padding: width * 0.015,
  },
  resultsContainer: {
    position: "absolute",
    top: height * 0.07,
    right: width * 0.03,
    width: width * 0.8,
    backgroundColor: "white",
    borderRadius: 5,
    maxHeight: height * 0.3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  resultItem: {
    padding: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
});

export default SpecificSearch;
