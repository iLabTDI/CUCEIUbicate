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
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBars, faRoute, faUser } from "@fortawesome/free-solid-svg-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ImageZoom from "react-native-image-pan-zoom";
import LottieView from "lottie-react-native";
import { SearchRoute } from "./Components/SearchBarsComponent/SearchRoute";
import { SpecificSearch } from "./Components/SearchBarsComponent/SearchSpecific";
import { BottomSheetComponent } from "./Components/BottonSheetComponent/BottonSheet";
import { MapWithPointsAndRoutes } from "./Components/MapComponent/MapPoints";
import { points } from "./Components/MapComponent/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSession } from "../../auth/SessionManager";
import { routesImages } from "./Routes/Route_data";
import ChatbotButton from "../ChatBot/Chatboot_Button";

const { width, height } = Dimensions.get("window");

export const HomePage = () => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);
  const imageZoomRef = useRef(null);
  const isFocused = useIsFocused();
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedRouteImage, setSelectedRouteImage] = useState(null); // Imagen de la ruta
  const [currentMapImage, setCurrentMapImage] = useState(
    require("./assets/images/mapa2.webp")
  ); // Imagen actual del mapa
  const [showSpecificSearch, setShowSpecificSearch] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [markedObject, setMarkedObject] = useState(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isFocused) {
      loadSelectedIcon();
      checkSession();
    }
  }, [isFocused]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isBottomSheetVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isBottomSheetVisible, fadeAnim]);

  const checkSession = async () => {
    const session = await getSession();
    if (!session) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  };

  const loadSelectedIcon = async () => {
    try {
      const savedIcon = await AsyncStorage.getItem("selectedIcon");
      if (savedIcon) {
        setSelectedIcon(JSON.parse(savedIcon));
      }
    } catch (error) {
      console.error("Error loading selected icon:", error);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handlePointPress = (pointId) => {
    setSelectedPoint(pointId);
    setIsBottomSheetVisible(true);
    bottomSheetRef.current?.expand();
  };

  const toggleSearchBar = () => {
    setShowSearchBar((prev) => !prev);
  };

  const closeSearchBar = () => {
    setShowSearchBar(false);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetVisible(false);
    bottomSheetRef.current?.close();
  };

  const handleSpecificSearch = (pointId) => {
    const selectedObject = points.find((point) => point.id === pointId);
    if (selectedObject) {
      setMarkedObject(selectedObject);
    }
    setShowSpecificSearch(false);
  };

  const handleSearch = ({ searchKey, reverseSearchKey }) => {
    // Buscar primero la ruta directa, si no existe, buscar la ruta inversa
    if (routesImages[searchKey]) {
      setSelectedRouteImage(routesImages[searchKey]); // Guardar la imagen de la ruta
      setCurrentMapImage(routesImages[searchKey]); // Reemplazar el mapa base con la ruta seleccionada
    } else if (routesImages[reverseSearchKey]) {
      setSelectedRouteImage(routesImages[reverseSearchKey]); // Guardar la imagen de la ruta
      setCurrentMapImage(routesImages[reverseSearchKey]); // Reemplazar el mapa base con la ruta inversa
    }
    setShowSearchBar(false);
  };

  const clearRoute = () => {
    setSelectedRouteImage(null); // Limpiar la ruta seleccionada
    setCurrentMapImage(require("./assets/images/mapa2.webp")); // Restaurar el mapa base
  };

  return (
    <View style={styles.container}>
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

      <TouchableOpacity
        style={styles.menu_icon}
        onPress={() => navigation.openDrawer()}>
        <FontAwesomeIcon icon={faBars} size={width * 0.06} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profile_icon}
        onPress={() => navigation.navigate("Perfil")}>
        {selectedIcon ? (
          <Image source={selectedIcon} style={styles.profileImage} />
        ) : (
          <FontAwesomeIcon icon={faUser} size={width * 0.06} color="white" />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.search_icon} onPress={toggleSearchBar}>
        <FontAwesomeIcon icon={faRoute} size={width * 0.06} color="white" />
      </TouchableOpacity>

      {showSearchBar && (
        <SearchRoute
          onClose={closeSearchBar}
          onSearch={handleSearch}
          points={points}
        />
      )}

      <SpecificSearch
        points={points}
        onSearch={handleSpecificSearch}
        setShowSpecificSearch={setShowSpecificSearch}
        setMarkedObject={setMarkedObject}
      />

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
          {/* Muestra la imagen actual del mapa (base o con ruta seleccionada) */}
          <Image
            source={currentMapImage} // Aqui se muestra la imagen actual del mapa
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
          />
        </ImageZoom>
      </GestureHandlerRootView>

      {selectedRouteImage && (
        <TouchableOpacity style={styles.finalizeButton} onPress={clearRoute}>
          <Text style={styles.finalizeButtonText}>Finalizar Ruta</Text>
        </TouchableOpacity>
      )}

      <Animated.View
        style={[styles.overlay, { opacity: fadeAnim }]}
        pointerEvents="none"
      />
      <ChatbotButton />

      <BottomSheetComponent
        ref={bottomSheetRef}
        snapPoints={[ "50%", "75%"]}
        selectedPoint={selectedPoint}
        isVisible={isBottomSheetVisible}
        onClose={handleCloseBottomSheet}
      />
    </View>
  );
};

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
    backgroundColor: "blue",
    borderRadius: width * 0.1,
    padding: width * 0.04,
    zIndex: 2,
  },
  search_icon: {
    position: "absolute",
    top: height * 0.05,
    right: width * 0.2,
    backgroundColor: "blue",
    borderRadius: width * 0.1,
    padding: width * 0.04,
    zIndex: 2,
  },
  profile_icon: {
    position: "absolute",
    top: height * 0.05,
    left: width * 0.19,
    backgroundColor: "blue",
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
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    zIndex: 0,
  },
  finalizeButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default HomePage;
