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
import { faSearch, faTimes, faHistory, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get('window');

export const SpecificSearch = ({ onSearch, points, setShowSpecificSearch }) => {
  const [showSpecificSearch, setShowSpecificSearchState] = useState(false);
  const [specificSearchText, setSpecificSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState("");
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  useEffect(() => {
    loadSearchHistory();
    if (showSpecificSearch) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
    setShowSpecificSearch(showSpecificSearch);
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

  const closeSearch = () => {
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
      setError("");
      setShowSpecificSearch(false);
    });
  };

  const handleSpecificSearch = (text) => {
    setSpecificSearchText(text);
    setError("");
    if (text.length > 0) {
      const filteredResults = points.filter((point) =>
        point.name.toLowerCase().includes(text.toLowerCase()) ||
        point.id.toLowerCase().includes(text.toLowerCase()) ||
        (point.aliases && point.aliases.some(alias => alias.toLowerCase().includes(text.toLowerCase())))
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
    const newHistory = [searchTerm, ...searchHistory.filter(term => term !== searchTerm)].slice(0, 5);
    setSearchHistory(newHistory);
    await AsyncStorage.setItem("specificSearchHistory", JSON.stringify(newHistory));
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleSelectResult(item)}
    >
      <FontAwesomeIcon icon={faSearch} size={16} color="#666" style={styles.resultIcon} />
      <Text style={styles.resultText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        setSpecificSearchText(item);
        handleSpecificSearch(item);
      }}
    >
      <FontAwesomeIcon icon={faHistory} size={16} color="#666" style={styles.resultIcon} />
      <Text style={styles.resultText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.search_icon}
        onPress={toggleSpecificSearch}
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
            placeholderTextColor="#999"
            value={specificSearchText}
            onChangeText={handleSpecificSearch}
          />
          <TouchableOpacity style={styles.historyIcon} onPress={() => {
            setShowHistory(!showHistory);
            setError("");
            setSearchResults([]);
          }}>
            <FontAwesomeIcon icon={faHistory} size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeIcon} onPress={closeSearch}>
            <FontAwesomeIcon icon={faTimes} size={20} color="#666" />
          </TouchableOpacity>
        </Animated.View>
      )}

      {(searchResults.length > 0 || showHistory || error) && (
        <View style={styles.resultsContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <FontAwesomeIcon icon={faExclamationCircle} size={20} color="#ff6b6b" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <FlatList
              data={showHistory ? searchHistory : searchResults}
              renderItem={showHistory ? renderHistoryItem : renderSearchResult}
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps="always"
              maxToRenderPerBatch={5}
              initialNumToRender={5}
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
    elevation: 5,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 48,
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
    color: "#333",
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
    borderRadius: 8,
    maxHeight: height * 0.4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  resultsList: {
    maxHeight: height * 0.4,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  resultIcon: {
    marginRight: 12,
  },
  resultText: {
    fontSize: width * 0.04,
    color: "#333",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: height * 0.02,
    justifyContent: "center",
  },
  errorText: {
    fontSize: width * 0.04,
    color: "#ff6b6b",
    marginLeft: 10,
  },
});

export default SpecificSearch;