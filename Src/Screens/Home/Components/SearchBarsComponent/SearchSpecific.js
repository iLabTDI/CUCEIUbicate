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
  faPlane,
  faCar,
  faTree,
  faStar,
  faDoorOpen,
  faSignInAlt,
  faUniversity,
  faIndustry,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

/**
 * Función auxiliar que determina el ícono según el texto recibido.
 * - "Modulo" o "Edificio": faBuilding
 * - "Biblioteca": faBook
 * - "Entrada": faTicketAlt
 * - "Comida", "Restaurante" o "Globo": faUtensils
 * - En otro caso: faSearch
 */
const getIconForCategoryFromText = (text) => {
  const lower = text.toLowerCase();
  
  // Módulos y edificios específicos - Iconos más específicos
  if (lower.includes("modulo")) {
    return faUniversity; // Ícono más académico para módulos
  } else if (lower.includes("edificio")) {
    return faBuilding;
  } else if (lower.includes("biblioteca")) {
    return faBook;
  } else if (lower.includes("entrada") || lower.includes("acceso")) {
    return faDoorOpen; // Mejor ícono para entradas de lugares
  }
  
  // Servicios de comida y bebida
  else if (lower.includes("comida") || lower.includes("restaurante") || lower.includes("globo") || lower.includes("cafeteria")) {
    return faUtensils;
  } else if (lower.includes("cafe") || lower.includes("café") || lower.includes("starbucks")) {
    return faCoffee;
  }
  
  // Servicios generales
  else if (lower.includes("estacionamiento") || lower.includes("parking")) {
    return faParking;
  } else if (lower.includes("baño") || lower.includes("sanitario") || lower.includes("wc")) {
    return faRestroom;
  } else if (lower.includes("wifi") || lower.includes("internet")) {
    return faWifi;
  }
  
  // Áreas académicas y laboratorios
  else if (lower.includes("laboratorio") || lower.includes("lab")) {
    return faFlask;
  } else if (lower.includes("computo") || lower.includes("sistemas") || lower.includes("informatica")) {
    return faLaptop;
  } else if (lower.includes("aula") || lower.includes("salon") || lower.includes("clase")) {
    return faChalkboardTeacher;
  } else if (lower.includes("auditorio") || lower.includes("conferencia")) {
    return faMicrophone;
  }
  
  // Administración y oficinas
  else if (lower.includes("administra") || lower.includes("coordinacion") || lower.includes("direccion")) {
    return faUserTie;
  } else if (lower.includes("secretaria") || lower.includes("oficina")) {
    return faClipboardList;
  } else if (lower.includes("rectoría") || lower.includes("rector")) {
    return faHome;
  }
  
  // Servicios médicos y salud
  else if (lower.includes("medico") || lower.includes("enfermeria") || lower.includes("salud")) {
    return faHospital;
  } else if (lower.includes("psicolog") || lower.includes("bienestar")) {
    return faHeart;
  }
  
  // Deportes y recreación
  else if (lower.includes("deporte") || lower.includes("gimnasio") || lower.includes("cancha")) {
    return faFootballBall;
  } else if (lower.includes("juego") || lower.includes("recreo")) {
    return faGamepad;
  }
  
  // Servicios estudiantiles
  else if (lower.includes("estudiante") || lower.includes("alumno")) {
    return faUsers;
  } else if (lower.includes("becas") || lower.includes("beca")) {
    return faStar;
  }
  
  // Servicios técnicos
  else if (lower.includes("impresion") || lower.includes("copiado")) {
    return faPrint;
  } else if (lower.includes("fotografia") || lower.includes("estudio")) {
    return faCamera;
  } else if (lower.includes("musica") || lower.includes("audio")) {
    return faMusic;
  }
  
  // Transporte y acceso
  else if (lower.includes("transporte") || lower.includes("ruta") || lower.includes("autobus")) {
    return faBus;
  } else if (lower.includes("vehiculo") || lower.includes("auto")) {
    return faCar;
  }
  
  // Seguridad y mantenimiento
  else if (lower.includes("seguridad") || lower.includes("vigilancia")) {
    return faShieldAlt;
  } else if (lower.includes("mantenimiento") || lower.includes("herramienta")) {
    return faToolbox;
  } else if (lower.includes("llave") || lower.includes("acceso")) {
    return faKey;
  }
  
  // Áreas verdes y exteriores
  else if (lower.includes("jardin") || lower.includes("verde") || lower.includes("patio")) {
    return faTree;
  }
  
  // Por defecto
  return faMapMarkerAlt;
};

// Función para obtener colores bonitos para cada categoría
const getColorForCategory = (text) => {
  const lower = text.toLowerCase();
  
  // Edificios y módulos - Azules académicos
  if (lower.includes("modulo")) {
    return "#1E40AF"; // Azul académico para módulos
  } else if (lower.includes("edificio")) {
    return "#374151"; // Gris oscuro para edificios generales
  } else if (lower.includes("biblioteca")) {
    return "#7C3AED"; // Púrpura para biblioteca
  } else if (lower.includes("entrada") || lower.includes("acceso")) {
    return "#059669"; // Verde para entradas
  }
  
  // Comida - Naranjas y marrones
  else if (lower.includes("comida") || lower.includes("restaurante") || lower.includes("globo") || lower.includes("cafeteria")) {
    return "#EA580C"; // Naranja para comida
  } else if (lower.includes("cafe") || lower.includes("café")) {
    return "#92400E"; // Marrón para café
  }
  
  // Servicios - Grises y azules
  else if (lower.includes("estacionamiento") || lower.includes("parking")) {
    return "#374151"; // Gris para estacionamiento
  } else if (lower.includes("baño") || lower.includes("sanitario")) {
    return "#0891B2"; // Azul cyan para baños
  } else if (lower.includes("wifi")) {
    return "#2563EB"; // Azul para wifi
  }
  
  // Académico - Verdes y azules
  else if (lower.includes("laboratorio") || lower.includes("lab")) {
    return "#DC2626"; // Rojo para laboratorios
  } else if (lower.includes("computo") || lower.includes("sistemas")) {
    return "#1F2937"; // Gris muy oscuro para cómputo
  } else if (lower.includes("aula") || lower.includes("salon")) {
    return "#059669"; // Verde para aulas
  } else if (lower.includes("auditorio")) {
    return "#7C3AED"; // Púrpura para auditorios
  }
  
  // Administrativo - Azules corporativos
  else if (lower.includes("administra") || lower.includes("coordinacion") || lower.includes("direccion")) {
    return "#1E40AF"; // Azul corporativo
  } else if (lower.includes("secretaria") || lower.includes("oficina")) {
    return "#374151"; // Gris para oficinas
  } else if (lower.includes("rector")) {
    return "#991B1B"; // Rojo oscuro para rectoría
  }
  
  // Salud - Rojos y rosas
  else if (lower.includes("medico") || lower.includes("enfermeria") || lower.includes("salud")) {
    return "#DC2626"; // Rojo para medicina
  } else if (lower.includes("psicolog") || lower.includes("bienestar")) {
    return "#BE185D"; // Rosa para bienestar
  }
  
  // Deportes - Verdes
  else if (lower.includes("deporte") || lower.includes("gimnasio") || lower.includes("cancha")) {
    return "#16A34A"; // Verde para deportes
  } else if (lower.includes("juego")) {
    return "#7C3AED"; // Púrpura para juegos
  }
  
  // Estudiantes - Azules
  else if (lower.includes("estudiante") || lower.includes("alumno")) {
    return "#2563EB"; // Azul para estudiantes
  } else if (lower.includes("becas")) {
    return "#D97706"; // Dorado para becas
  }
  
  // Técnico - Grises
  else if (lower.includes("impresion") || lower.includes("fotografia") || lower.includes("musica")) {
    return "#374151"; // Gris para servicios técnicos
  }
  
  // Transporte - Amarillos y naranjas
  else if (lower.includes("transporte") || lower.includes("ruta")) {
    return "#D97706"; // Naranja para transporte
  } else if (lower.includes("vehiculo") || lower.includes("auto")) {
    return "#374151"; // Gris para vehículos
  }
  
  // Seguridad - Rojos
  else if (lower.includes("seguridad") || lower.includes("mantenimiento")) {
    return "#991B1B"; // Rojo para seguridad
  }
  
  // Verde - Espacios verdes
  else if (lower.includes("jardin") || lower.includes("verde") || lower.includes("patio")) {
    return "#16A34A"; // Verde para áreas verdes
  }
  
  // Color por defecto
  return "#0033A0";
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
        style={[styles.resultItem, {
          transform: [{ scale: 1 }],
        }]}
        onPress={() => handleSelectResult(item)}
        activeOpacity={0.8}
        underlayColor={`${itemColor}08`}
      >
        <View style={[
          styles.resultIcon, 
          { 
            backgroundColor: `${itemColor}18`,
            borderWidth: 1,
            borderColor: `${itemColor}25`,
          }
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
        style={[styles.resultItem, {
          transform: [{ scale: 1 }],
        }]}
        onPress={() => {
          setSpecificSearchText(item);
          handleSpecificSearch(item);
        }}
        activeOpacity={0.8}
        underlayColor={`${itemColor}08`}
      >
        <View style={[
          styles.resultIcon, 
          { 
            backgroundColor: `${itemColor}18`,
            borderWidth: 1,
            borderColor: `${itemColor}25`,
          }
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
      <TouchableOpacity style={styles.search_icon} onPress={toggleSpecificSearch}>
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
          <TouchableOpacity
            style={styles.historyIcon}
            onPress={() => {
              setShowHistory(!showHistory);
              setError("");
              setSearchResults([]);
            }}
          >
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
    top:
      Platform.OS === "ios"
        ? isTablet
          ? height * 0.0005
          : height * 0.001
        : isTablet
        ? -height * 0.001
        : -height * 0.002,
    right: Platform.OS === "ios" ? (isTablet ? -8 : -5) : 0,
    backgroundColor: "#0033A0",
    borderRadius: isTablet ? width * 0.06 : width * 0.1,
    padding: isTablet ? width * 0.03 : width * 0.04,
    zIndex: 2,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    elevation: 3,
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
