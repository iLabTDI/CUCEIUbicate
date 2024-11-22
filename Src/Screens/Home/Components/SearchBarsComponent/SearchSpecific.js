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
const isTablet = width >= 768;

export const SpecificSearch = ({ onSearch, points, setShowSpecificSearch }) => {
  const [showSpecificSearch, setShowSpecificSearchState] = useState(false);
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
      <FontAwesomeIcon icon={faSearch} size={isTablet ? 20 : 16} color="#666666" style={styles.resultIcon} />
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
      <FontAwesomeIcon icon={faHistory} size={isTablet ? 20 : 16} color="#666666" style={styles.resultIcon} />
      <Text style={styles.resultText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.search_icon}
        onPress={toggleSpecificSearch}
      >
        <FontAwesomeIcon icon={faSearch} size={isTablet ? width * 0.04 : width * 0.06} color="#FFFFFF" />
      </TouchableOpacity>

      {showSpecificSearch && (
        <Animated.View style={[
          styles.overlay,
          {
            opacity: animatedOpacity,
          }
        ]} />
      )}

      {showSpecificSearch && (
        <Animated.View
          style={[
            styles.searchBarContainer,
            {
              transform: [{
                translateX: animatedWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: [isTablet ? 200 : 150, isTablet ? 20 : 10],
                }),
              }],
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", isTablet ? "88%" : "83%"],
              }),
            },
          ]}
        >
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Buscar lugares..."
            placeholderTextColor="#999999"
            value={specificSearchText}
            onChangeText={handleSpecificSearch}
          />
          <TouchableOpacity style={styles.historyIcon} onPress={() => {
            setShowHistory(!showHistory);
            setError("");
            setSearchResults([]);
          }}>
            <FontAwesomeIcon icon={faHistory} size={isTablet ? 24 : 20} color="#666666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeIcon} onPress={closeSearch}>
            <FontAwesomeIcon icon={faTimes} size={isTablet ? 24 : 20} color="#666666" />
          </TouchableOpacity>
        </Animated.View>
      )}

      {(searchResults.length > 0 || showHistory || error) && (
        <View style={styles.resultsContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <FontAwesomeIcon icon={faExclamationCircle} size={isTablet ? 24 : 20} color="#ff6b6b" />
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
    top: isTablet ? height * 0.03 : height * 0.05,
    right: isTablet ? width * 0.02 : width * 0.03,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  search_icon: {
    top: Platform.OS === 'ios' ? (isTablet ? height * 0.0005 : height * 0.001) : (isTablet ? -height * 0.001 : -height * 0.002),
    right: Platform.OS === 'ios' ? (isTablet ? -8 : -5) : 0,
    backgroundColor: "#0000ff",
    borderRadius: isTablet ? width * 0.06 : width * 0.1,
    padding: isTablet ? width * 0.03 : width * 0.04,
    zIndex: 2,
    elevation: 5,
  },
  overlay: {
    position: 'absolute',
    top: isTablet ? -height * 0.03 : -height * 0.05,
    left: -width,
    right: isTablet ? -width * 0.02 : -width * 0.03,
    bottom: -height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: isTablet ? 30 : 25,
    paddingHorizontal: isTablet ? 24 : 20,
    height: isTablet ? 56 : 48,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
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
    borderRadius: isTablet ? 12 : 8,
    maxHeight: isTablet ? height * 0.5 : height * 0.4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  resultsList: {
    maxHeight: isTablet ? height * 0.5 : height * 0.4,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: isTablet ? height * 0.02 : height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  resultIcon: {
    marginRight: isTablet ? 16 : 12,
  },
  resultText: {
    fontSize: isTablet ? width * 0.025 : width * 0.04,
    color: "#333333",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: isTablet ? height * 0.025 : height * 0.02,
    justifyContent: "center",
  },
  errorText: {
    fontSize: isTablet ? width * 0.025 : width * 0.04,
    color: "#ff6b6b",
    marginLeft: isTablet ? 14 : 10,
  },
});

export default SpecificSearch;