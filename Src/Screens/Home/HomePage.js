import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
  Animated,
  Alert,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native"; // Hooks de navegación y control de enfoque
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"; // Iconos
import {
  faBars,
  faRoute,
  faUser,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"; // Iconos específicos
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Manejo de gestos
import ImageZoom from "react-native-image-pan-zoom"; // Componente para hacer zoom en la imagen
import LottieView from "lottie-react-native"; // Animaciones Lottie
import { SearchRoute } from "./Components/SearchBarsComponent/SearchRoute"; // Componente de búsqueda de rutas
import { SpecificSearch } from "./Components/SearchBarsComponent/SearchSpecific"; // Componente de búsqueda específica
import { BottomSheetComponent } from "./Components/BottonSheetComponent/BottonSheet"; // Componente BottomSheet
import { MapWithPointsAndRoutes } from "./Components/MapComponent/MapPoints"; // Mapa con puntos y rutas
import { points } from "./Components/MapComponent/data"; // Datos de los puntos
import AsyncStorage from "@react-native-async-storage/async-storage"; // Almacenamiento local asíncrono
import { getSession } from "../../auth/SessionManager"; // Función para obtener la sesión
import { routesImages } from "./Routes/Route_data"; // Datos de las rutas
import ChatbotButton from "../ChatBot/Chatboot_Button"; // Componente del botón del chatbot

// Obtener las dimensiones de la pantalla para cálculos responsivos
const { width, height } = Dimensions.get("window");

export const HomePage = () => {
  // Hooks de navegación y control de si la pantalla está en foco
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Referencias para componentes y animaciones
  const bottomSheetRef = useRef(null);
  const imageZoomRef = useRef(null);

  // Estados para manejar la lógica y la UI de la aplicación
  const [selectedPoint, setSelectedPoint] = useState(null); // Punto seleccionado en el mapa
  const [showSearchBar, setShowSearchBar] = useState(false); // Control de visibilidad de la barra de búsqueda
  const [selectedRouteImage, setSelectedRouteImage] = useState(null); // Imagen de la ruta seleccionada
  const [currentMapImage, setCurrentMapImage] = useState(
    require("./assets/images/mapa.webp")
  ); // Imagen actual del mapa
  const [showSpecificSearch, setShowSpecificSearch] = useState(false); // Control de visibilidad de la búsqueda específica
  const [selectedIcon, setSelectedIcon] = useState(null); // Icono de perfil seleccionado
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [markedObject, setMarkedObject] = useState(null); // Objeto marcado en el mapa
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false); // Control de visibilidad del BottomSheet
  const [isRouteActive, setIsRouteActive] = useState(false); // Control de si una ruta está activa
  const [activeRoutePoints, setActiveRoutePoints] = useState([]); // Puntos de la ruta activa

  // Animación para el overlay del BottomSheet
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Efecto que se ejecuta cuando la pantalla está enfocada
  useEffect(() => {
    if (isFocused) {
      loadSelectedIcon(); // Cargar el icono seleccionado
      checkSession(); // Verificar la sesión del usuario
    }
  }, [isFocused]);

  // Efecto para manejar la animación del overlay del BottomSheet
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isBottomSheetVisible ? 1 : 0, // Control de opacidad del overlay
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isBottomSheetVisible, fadeAnim]);

  // Función para verificar la sesión del usuario
  const checkSession = async () => {
    const session = await getSession(); // Obtener la sesión
    if (!session) {
      // Si no hay sesión, redirigir al login
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  };

  // Función para cargar el icono de perfil seleccionado desde AsyncStorage
  const loadSelectedIcon = async () => {
    try {
      const savedIcon = await AsyncStorage.getItem("selectedIcon"); // Obtener el icono almacenado
      if (savedIcon) {
        setSelectedIcon(JSON.parse(savedIcon)); // Establecer el icono seleccionado
      }
    } catch (error) {
      console.error("Error loading selected icon:", error); // Manejo de errores
    }
  };

  // Función que se llama cuando se carga la imagen del mapa
  const handleImageLoad = () => {
    setIsLoading(false); // Ocultar la pantalla de carga
  };

  // Función que se ejecuta cuando se presiona un punto en el mapa
  const handlePointPress = (pointId) => {
    setSelectedPoint(pointId); // Establecer el punto seleccionado
    setIsBottomSheetVisible(true); // Mostrar el BottomSheet
    bottomSheetRef.current?.expand(); // Expandir el BottomSheet
  };

  // Función para alternar la visibilidad de la barra de búsqueda
  const toggleSearchBar = () => {
    setShowSearchBar((prev) => !prev); // Cambiar el estado de la barra de búsqueda
  };

  // Función para cerrar la barra de búsqueda
  const closeSearchBar = () => {
    setShowSearchBar(false); // Ocultar la barra de búsqueda
  };

  // Función para cerrar el BottomSheet
  const handleCloseBottomSheet = () => {
    setIsBottomSheetVisible(false); // Ocultar el BottomSheet
    bottomSheetRef.current?.close(); // Cerrar el BottomSheet
  };

  // Función para manejar la búsqueda específica
  const handleSpecificSearch = (pointId) => {
    const selectedObject = points.find((point) => point.id === pointId); // Encontrar el punto seleccionado
    if (selectedObject) {
      setMarkedObject(selectedObject); // Establecer el objeto marcado
    }
    setShowSpecificSearch(false); // Ocultar la búsqueda específica
  };

  // Función para manejar la búsqueda de rutas
  const handleSearch = ({ searchKey, reverseSearchKey }) => {
    let routeImage;
    let routePoints;

    // Verificar si existe una imagen para la ruta seleccionada
    if (routesImages[searchKey]) {
      routeImage = routesImages[searchKey];
      routePoints = searchKey.split("-"); // Dividir los puntos de la ruta
    } else if (routesImages[reverseSearchKey]) {
      routeImage = routesImages[reverseSearchKey];
      routePoints = reverseSearchKey.split("-");
    }

    // Si se encuentra la imagen de la ruta, establecer la ruta activa
    if (routeImage) {
      setSelectedRouteImage(routeImage); // Establecer la imagen de la ruta
      setCurrentMapImage(routeImage); // Cambiar la imagen del mapa
      setIsRouteActive(true); // Marcar la ruta como activa
      setActiveRoutePoints(routePoints); // Establecer los puntos de la ruta activa
    } else {
      Alert.alert(
        "Error",
        "No se encontró la ruta. Por favor verifica tu búsqueda."
      );
    }

    setShowSearchBar(false); // Ocultar la barra de búsqueda
  };

  // Función para limpiar la ruta seleccionada
  const clearRoute = () => {
    setSelectedRouteImage(null); // Limpiar la imagen de la ruta
    setCurrentMapImage(require("./assets/images/mapa.webp")); // Restablecer la imagen del mapa
    setIsRouteActive(false); // Marcar la ruta como inactiva
    setActiveRoutePoints([]); // Limpiar los puntos de la ruta activa
  };

  return (
    <View style={styles.container}>
      {/* Pantalla de carga */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <LottieView
            source={require("../../assets/animations/Map_loading.json")}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
          <Text style={styles.loadingText}>Cargando mapa...</Text>
        </View>
      )}

      {/* Botón del menú */}
      <TouchableOpacity
        style={styles.menu_icon}
        onPress={() => navigation.openDrawer()}>
        <FontAwesomeIcon icon={faBars} size={width * 0.06} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Botón de perfil */}
      <TouchableOpacity
        style={styles.profile_icon}
        onPress={() => navigation.navigate("Perfil")}>
        {selectedIcon ? (
          <Image source={selectedIcon} style={styles.profileImage} />
        ) : (
          <FontAwesomeIcon icon={faUser} size={width * 0.06} color="#FFFFFF" />
        )}
      </TouchableOpacity>

      {/* Botón de búsqueda */}
      <TouchableOpacity style={styles.search_icon} onPress={toggleSearchBar}>
        <FontAwesomeIcon icon={faRoute} size={width * 0.06} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Componente de búsqueda de rutas */}
      {showSearchBar && (
        <SearchRoute
          onClose={closeSearchBar}
          onSearch={handleSearch}
          points={points}
        />
      )}

      {/* Componente de búsqueda específica */}
      <SpecificSearch
        points={points}
        onSearch={handleSpecificSearch}
        setShowSpecificSearch={setShowSpecificSearch}
        setMarkedObject={setMarkedObject}
      />

      {/* Contenedor principal del mapa */}
      <GestureHandlerRootView style={styles.imageContainer}>
        <ImageZoom
          ref={imageZoomRef}
          cropWidth={Dimensions.get("window").width}
          cropHeight={Dimensions.get("window").height}
          imageWidth={1600}
          imageHeight={1400}
          enableSwipeDown={false}
          panToMove={true}
          pinchToZoomInSensitivity={1}
          minScale={0.5}
          maxScale={2}
          enableCenterFocus={false}
          useNativeDriver={true}
          centerOn={{ x: 250, y: -20, scale: 0.9 }}>
          <Image
            source={currentMapImage}
            style={styles.image}
            resizeMode="contain"
            onLoad={() => setTimeout(handleImageLoad, 3000)}
          />
          <MapWithPointsAndRoutes
            onPointPress={handlePointPress}
            selectedRoute={selectedRouteImage}
            selectedPoint={selectedPoint}
            points={points}
            clearRoute={clearRoute}
            markedObject={markedObject}
            setMarkedObject={setMarkedObject}
            isRouteActive={isRouteActive}
            activeRoutePoints={activeRoutePoints}
          />
        </ImageZoom>
      </GestureHandlerRootView>

      {/* Botón para finalizar la ruta */}
      {isRouteActive && (
        <TouchableOpacity style={styles.finalizeButton} onPress={clearRoute}>
          <Text style={styles.finalizeButtonText}>Finalizar Ruta</Text>
        </TouchableOpacity>
      )}

      {/* Overlay para el BottomSheet */}
      <Animated.View
        style={[styles.overlay, { opacity: fadeAnim }]}
        pointerEvents="none"
      />

      {/* Botón del chatbot */}
      {!isRouteActive && !showSearchBar && <ChatbotButton />}

      {/* Componente BottomSheet */}
      <BottomSheetComponent
        ref={bottomSheetRef}
        snapPoints={["50%", "75%"]}
        selectedPoint={selectedPoint}
        isVisible={isBottomSheetVisible}
        onClose={handleCloseBottomSheet}
      />
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    zIndex: 1000,
  },
  lottieAnimation: { width: width * 0.5, height: width * 0.5 },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 0,
  },
  menu_icon: {
    position: "absolute",
    top: height * 0.05,
    left: width * 0.03,
    backgroundColor: "#0000ff",
    borderRadius: width * 0.1,
    padding: width * 0.04,
    zIndex: 2,
  },
  search_icon: {
    position: "absolute",
    top: height * 0.05,
    right: width * 0.2,
    backgroundColor: "#0000ff",
    borderRadius: width * 0.1,
    padding: width * 0.04,
    zIndex: 2,
  },
  profile_icon: {
    position: "absolute",
    top: height * 0.05,
    left: width * 0.19,
    backgroundColor: "#0000ff",
    borderRadius: width * 0.1,
    padding: width * 0.04,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: width * 0.06,
    height: width * 0.06,
    borderRadius: (width * 0.06) / 2,
  },
  imageContainer: { flex: 1 },
  image: { flex: 1, width: undefined, height: undefined, alignSelf: "stretch" },
  finalizeButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#FF0000",
    padding: 15,
    borderRadius: 10,
    zIndex: 0,
  },
  finalizeButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default HomePage;
