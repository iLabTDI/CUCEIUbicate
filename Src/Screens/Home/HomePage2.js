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
import {
  faBars,
  faRoute,
  faUser,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ImageZoom from "react-native-image-pan-zoom";
import LottieView from "lottie-react-native";
import { SearchRoute2 } from "./Components/SearchBarsComponent/SearchRoute2";
import { SpecificSearch } from "./Components/SearchBarsComponent/SearchSpecific";
import { BottomSheetComponent } from "./Components/BottonSheetComponent/BottonSheet";
import { MapWithPointsAndRoutes } from "./Components/MapComponent/MapPoints";
import { MapWithPointsAndRoutes2 } from "./Components/MapComponent/MapPoints2";
import { points } from "./Components/MapComponent/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSession } from "../../auth/SessionManager";
import { ChatbotButton } from "../new_chatbot/Chatboot_Button";
import { VideoModal } from "./Components/VideoComponent/VideoModal";
import { routeVideos } from "../../Screens/Home/Components/VideoComponent/Videos_data";
import { DownloadAssets } from "./Routes/DownloadAssets";
import { DeleteLocalFiles } from "./Routes/DeleteLocalFiles";
import * as FileSystem from "expo-file-system";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

export const HomePage2 = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const imageZoomRef = useRef(null);
  const bottomSheetRef = useRef(null);

  // Estados del componente
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [currentMapImage, setCurrentMapImage] = useState(
    require("./assets/images/mapa2.webp")
  );
  const [showSpecificSearch, setShowSpecificSearch] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [markedObject, setMarkedObject] = useState(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isRouteActive, setIsRouteActive] = useState(false);
  const [activeRoutePoints, setActiveRoutePoints] = useState([]);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [currentVideoUri, setCurrentVideoUri] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  // Valores animados
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const loadingOpacity = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  // Efecto para manejar la sesión y cargar el icono seleccionado
  useEffect(() => {
    if (isFocused) {
      checkSession().then(() => {
        loadSelectedIcon();
      });
    }
  }, [isFocused]);

  // Efecto para manejar la animación del BottomSheet
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isBottomSheetVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isBottomSheetVisible, fadeAnim]);

  // Efecto para verificar si es la primera vez que se lanza la aplicación
  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunchedddd");
      if (hasLaunched === null) {
        setIsFirstLaunch(true);
        await AsyncStorage.setItem("hasLaunchedd", "true");
      } else {
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  // Efecto para mostrar el modal de descarga en el primer lanzamiento
  useEffect(() => {
    if (!isLoading && isFirstLaunch) {
      setShowDownloadModal(true);
    }
  }, [isLoading, isFirstLaunch]);

  // Función para verificar la sesión del usuario
  const checkSession = async () => {
    const session = await getSession();
    if (!session) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  };

  // Función para cerrar el modal de descarga
  const handleCloseDownloadModal = () => {
    setShowDownloadModal(false);
  };

  // Función para cargar el icono seleccionado
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

  // Función para manejar la carga de la imagen y finalizar la animación de carga
  const handleImageLoad = () => {
    Animated.parallel([
      Animated.timing(loadingOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsLoading(false);
    });
  };

  // Función para manejar la eliminación de archivos
  const handleFilesDeleted = async () => {
    await AsyncStorage.removeItem("hasLaunchedd");
    setShowDownloadModal(true);
  };

  // Función para manejar la pulsación de un punto en el mapa
  const handlePointPress = (pointId) => {
    setSelectedPoint(pointId);
    setIsBottomSheetVisible(true);
    bottomSheetRef.current?.expand();
  };

  // Funciones para manejar la barra de búsqueda
  const toggleSearchBar = () => {
    console.log("Mostrando barra de búsqueda...");
    setShowSearchBar((prev) => !prev);
  };

  const closeSearchBar = () => {
    console.log("Cerrando barra de búsqueda...");
    setShowSearchBar(false);
  };

  // Función para cerrar el BottomSheet
  const handleCloseBottomSheet = () => {
    setIsBottomSheetVisible(false);
    bottomSheetRef.current?.close();
  };

  // Función para manejar la búsqueda específica
  const handleSpecificSearch = (pointId) => {
    const selectedObject = points.find((point) => point.id === pointId);
    if (selectedObject) {
      setMarkedObject(selectedObject);
    }
    setShowSpecificSearch(false);
  };

  // NUEVA función de búsqueda: se recibe el objeto de ruta completo (del JSON)
  const handleSearch = async (routeObject) => {
    console.log("onSearch:", routeObject);
    if (routeObject) {
      // Se asignan las coordenadas del JSON a la ruta activa
      setActiveRoutePoints(routeObject.coordinates);
      setIsRouteActive(true);
      // Se utiliza el nombre de la ruta como identificador único
      setSelectedRouteId(routeObject.name);
      // Se busca el video asociado (si lo hubiera)
      const videoUri = routeVideos[routeObject.name] || null;
      setCurrentVideoUri(videoUri);
      // Se cierra la barra de búsqueda
      setShowSearchBar(false);
    } else {
      Alert.alert("Error", "No se encontró la ruta en el JSON.");
    }
  };

  // Función para limpiar la ruta seleccionada
  const clearRoute = () => {
    setIsRouteActive(false);
    setActiveRoutePoints([]);
    setCurrentVideoUri(null);
    setIsVideoModalVisible(false);
    // Opcional: restaurar la imagen del mapa a la predeterminada
    setCurrentMapImage(require("./assets/images/mapa2.webp"));
  };

  // Función para alternar la visibilidad del modal de video
  const toggleVideoModal = () => {
    setIsVideoModalVisible(!isVideoModalVisible);
  };

  // Función para manejar la vista de descarga
  const handleViewDownload = () => {
    setShowDownloadModal(false);
    navigation.navigate("FileManagementScreen", {
      startDownloadAutomatically: true,
    });
  };

  return (
    <View style={styles.container}>
      {/* Pantalla de carga animada */}
      <Animated.View
        style={[styles.loadingContainer, { opacity: loadingOpacity }]}
        pointerEvents={isLoading ? "auto" : "none"}
      >
        <LottieView
          source={require("../../assets/animations/Map_loading.json")}
          autoPlay
          loop={false}
          style={styles.lottieAnimation}
          onAnimationFinish={handleImageLoad}
        />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </Animated.View>

      {/* Contenido principal */}
      <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
        {/* Botón del menú */}
        <TouchableOpacity
          style={styles.menu_icon}
          onPress={() => navigation.openDrawer()}
        >
          <FontAwesomeIcon
            icon={faBars}
            size={isTablet ? width * 0.04 : width * 0.06}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.profile_icon,
            selectedIcon && styles.profile_icon_selected,
          ]}
          onPress={() => navigation.navigate("Perfil")}
        >
          {selectedIcon ? (
            <Image source={selectedIcon} style={styles.profileImage} />
          ) : (
            <FontAwesomeIcon
              icon={faUser}
              size={isTablet ? width * 0.04 : width * 0.06}
              color="#FFFFFF"
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.search_icon} onPress={toggleSearchBar}>
          <FontAwesomeIcon
            icon={faRoute}
            size={isTablet ? width * 0.04 : width * 0.06}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* Componente de búsqueda de ruta (ya sin enviar "points") */}
        {showSearchBar && (
          <SearchRoute2 onClose={closeSearchBar} onSearch={handleSearch} />
        )}

        {/* Componente de búsqueda específica */}
        <SpecificSearch
          points={points}
          onSearch={handleSpecificSearch}
          setShowSpecificSearch={setShowSpecificSearch}
          setMarkedObject={setMarkedObject}
        />

        {/* Contenedor del mapa con zoom */}
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
            centerOn={{ x: 250, y: -20, scale: 0.9 }}
          >
            <Image
              source={currentMapImage}
              style={styles.image}
              resizeMode="contain"
            />
            <MapWithPointsAndRoutes2
              onPointPress={handlePointPress}
              selectedRoute={null}
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

        {/* Modal de descarga de assets */}
        {/* {showDownloadModal && (
          <DownloadAssets
            onClose={handleCloseDownloadModal}
            onViewDownload={handleViewDownload}
            visible={showDownloadModal}
          />
        )} */}

        {/* Componente para eliminar archivos locales */}
        {/* <DeleteLocalFiles onFilesDeleted={handleFilesDeleted} /> */}

        {/* Botón para finalizar ruta */}
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

        {/* Botón para ver video */}
        {isRouteActive && (
          <TouchableOpacity style={styles.videoButton} onPress={toggleVideoModal}>
            <FontAwesomeIcon
              icon={faPlay}
              size={isTablet ? 28 : 24}
              color="#FFFFFF"
            />
            <Text style={styles.videoButtonText}>Ver Video</Text>
          </TouchableOpacity>
        )}

        {/* Modal de video */}
        <VideoModal
          isVisible={isVideoModalVisible}
          onClose={() => setIsVideoModalVisible(false)}
          videoUri={currentVideoUri}
          routeId={selectedRouteId}
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
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    zIndex: 1000,
  },
  lottieAnimation: {
    width: isTablet ? width * 0.3 : width * 0.5,
    height: isTablet ? width * 0.3 : width * 0.5,
  },
  loadingText: {
    marginTop: 20,
    fontSize: isTablet ? 24 : 18,
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
    top: isTablet ? height * 0.03 : height * 0.05,
    left: isTablet ? width * 0.02 : width * 0.03,
    backgroundColor: "#0000ff",
    borderRadius: isTablet ? width * 0.06 : width * 0.1,
    padding: isTablet ? width * 0.03 : width * 0.04,
    zIndex: 2,
  },
  search_icon: {
    position: "absolute",
    top: isTablet ? height * 0.03 : height * 0.05,
    right: isTablet ? width * 0.13 : width * 0.2,
    backgroundColor: "#0000ff",
    borderRadius: isTablet ? width * 0.06 : width * 0.1,
    padding: isTablet ? width * 0.03 : width * 0.04,
    zIndex: 2,
  },
  profile_icon: {
    position: "absolute",
    top: isTablet ? height * 0.03 : height * 0.05,
    left: isTablet ? width * 0.14 : width * 0.19,
    backgroundColor: "#0000ff",
    borderRadius: isTablet ? width * 0.06 : width * 0.1,
    padding: isTablet ? width * 0.03 : width * 0.04,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  profile_icon_selected: {
    padding: 0,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#0000ff",
  },
  profileImage: {
    width: isTablet ? width * 0.04 : width * 0.13,
    height: isTablet ? width * 0.04 : width * 0.13,
    borderRadius: (isTablet ? width * 0.04 : width * 0.2) / 2,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
    alignSelf: "stretch",
  },
  finalizeButton: {
    position: "absolute",
    bottom: isTablet ? 30 : 20,
    left: isTablet ? 30 : 20,
    right: isTablet ? 30 : 20,
    backgroundColor: "#FF0000",
    padding: isTablet ? 15 : 15,
    borderRadius: isTablet ? 15 : 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  finalizeButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: isTablet ? 22 : 18,
  },
  videoButton: {
    position: "absolute",
    bottom: isTablet ? 110 : 80,
    right: isTablet ? 30 : 20,
    backgroundColor: "#0b34b0",
    paddingVertical: isTablet ? 15 : 10,
    paddingHorizontal: isTablet ? 20 : 15,
    borderRadius: isTablet ? 40 : 30,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  videoButtonText: {
    color: "#FFFFFF",
    marginLeft: isTablet ? 12 : 8,
    fontWeight: "bold",
    fontSize: isTablet ? 20 : 16,
  },
  downloadButton: {
    position: "absolute",
    bottom: isTablet ? 30 : 20,
    left: isTablet ? 100 : 80,
    backgroundColor: "#007bff",
    flexDirection: "row",
    alignItems: "center",
    padding: isTablet ? 20 : 15,
    borderRadius: isTablet ? 25 : 20,
  },
});

export default HomePage2;
