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
  faTimes,
  faVideo,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
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
import { ChatbotButton } from "../ChatBot/Chatboot_Button";
import { VideoModal } from "./Components/VideoComponent/VideoModal";
import { routeVideos } from "../../Screens/Home/Components/VideoComponent/Videos_data";
import { DownloadAssets } from "./Routes/DownloadAssets";
import { DeleteLocalFiles } from "./Routes/DeleteLocalFiles";
import * as FileSystem from "expo-file-system";

// Obtener las dimensiones de la pantalla para cálculos responsivos
const { width, height } = Dimensions.get("window");

export const HomePage = () => {
  const navigation = useNavigation(); // Hook de navegación para manejar redirecciones entre pantallas
  const isFocused = useIsFocused(); // Hook para detectar si la pantalla está en foco
  const imageZoomRef = useRef(null); // Referencia para la funcionalidad de zoom en la imagen del mapa
  const bottomSheetRef = useRef(null); // Referencia para el componente de BottomSheet

  // Estados para controlar la lógica y la UI
  const [selectedPoint, setSelectedPoint] = useState(null); // Para guardar el punto seleccionado en el mapa
  const [showSearchBar, setShowSearchBar] = useState(false); // Controlar si la barra de búsqueda se muestra
  const [selectedRouteImage, setSelectedRouteImage] = useState(null); // Guardar la imagen de la ruta seleccionada
  const [currentMapImage, setCurrentMapImage] = useState(
    require("./assets/images/mapa.webp")
  ); // Imagen actual del mapa por defecto
  const [showSpecificSearch, setShowSpecificSearch] = useState(false); // Controlar si la búsqueda específica se muestra
  const [selectedIcon, setSelectedIcon] = useState(null); // Guardar el icono de perfil seleccionado
  const [isLoading, setIsLoading] = useState(true); // Controlar el estado de carga del mapa
  const [markedObject, setMarkedObject] = useState(null); // Objeto marcado en el mapa
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false); // Controlar visibilidad del BottomSheet
  const [isRouteActive, setIsRouteActive] = useState(false); // Controlar si una ruta está activa
  const [activeRoutePoints, setActiveRoutePoints] = useState([]); // Guardar los puntos de la ruta activa
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false); // Controlar visibilidad del modal de video
  const [currentVideoUri, setCurrentVideoUri] = useState(""); // URI del video actual
  const [showDownloadModal, setShowDownloadModal] = useState(false); // Controlar visibilidad del modal de descarga
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current; // Animación para el overlay del BottomSheet

  useEffect(() => {
    if (isFocused) {
      checkSession().then(() => {
        loadSelectedIcon(); // Verificar sesión antes de cargar el icono
        setShowDownloadModal(false);
      });
    }
  }, [isFocused]);

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

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem('hasLaunchedd');
      if (hasLaunched === null) {
        // Si no hay valor guardado, es la primera vez que se lanza
        setIsFirstLaunch(true);
        await AsyncStorage.setItem('hasLaunchedd', 'true'); // Marcar como lanzado
      } else {
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  useEffect(() => {
    if (isFirstLaunch) {
      setShowDownloadModal(true); // Muestra el modal si es el primer lanzamiento
    }
  }, [isFirstLaunch]);

    // Función para manejar el cierre del modal de descarga
    const handleCloseDownloadModal = () => {
      setShowDownloadModal(false);
    };
  
     // Función para ejecutar cuando los archivos se hayan descargado
     const handleDownloadComplete = () => {
      setShowDownloadModal(false); // Ocultar el modal cuando se completen las descargas
    };
  

  // Cargar el icono de perfil seleccionado desde AsyncStorage
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
    setIsLoading(false);
    if (isFirstLaunch) {
      setIsFirstLaunch(false);
    }
  };

  const handleFilesDeleted = async () => {
    await AsyncStorage.removeItem("hasLaunchedd");
    setShowDownloadModal(true);  // Aquí se debería activar el modal
    console.log("Modal de descarga debe aparecer ahora");  // Verifica si esto se imprime en la consola
};

  // Función que se ejecuta cuando se presiona un punto en el mapa
  const handlePointPress = (pointId) => {
    setSelectedPoint(pointId); // Establecer el punto seleccionado
    setIsBottomSheetVisible(true); // Mostrar el BottomSheet
    bottomSheetRef.current?.expand(); // Expandir el BottomSheet
  };

  // Alternar la visibilidad de la barra de búsqueda
  const toggleSearchBar = () => {
    setShowSearchBar((prev) => !prev); // Cambiar el estado de la barra de búsqueda
  };

  // Función para cerrar la barra de búsqueda
  const closeSearchBar = () => {
    setShowSearchBar(false); // Ocultar la barra de búsqueda
  };

  // Cerrar el BottomSheet
  const handleCloseBottomSheet = () => {
    setIsBottomSheetVisible(false); // Ocultar el BottomSheet
    bottomSheetRef.current?.close(); // Cerrar el BottomSheet
  };

  // Manejar la búsqueda específica
  const handleSpecificSearch = (pointId) => {
    const selectedObject = points.find((point) => point.id === pointId); // Encontrar el punto seleccionado
    if (selectedObject) {
      setMarkedObject(selectedObject); // Establecer el objeto marcado
    }
    setShowSpecificSearch(false); // Ocultar la búsqueda específica
  };

  // Función para manejar la búsqueda
  const handleSearch = async ({ searchKey, reverseSearchKey }) => {
    try {
      const localUri = `${FileSystem.documentDirectory}${searchKey}.webp`;

      // Verificar si existe la imagen para searchKey
      const fileExists = await FileSystem.getInfoAsync(localUri);

      if (fileExists.exists) {
        setSelectedRouteImage(localUri);
        setCurrentMapImage({ uri: localUri });
        setIsRouteActive(true);

        const videoUri =
          routeVideos[searchKey] || routeVideos[reverseSearchKey];
        setCurrentVideoUri(videoUri || "");

        setShowSearchBar(false);
        return;
      }

      // Verificar reverseSearchKey si no se encontró la imagen
      const reverseLocalUri = `${FileSystem.documentDirectory}${reverseSearchKey}.webp`;
      const reverseFileExists = await FileSystem.getInfoAsync(reverseLocalUri);

      if (reverseFileExists.exists) {
        setSelectedRouteImage(reverseLocalUri);
        setCurrentMapImage({ uri: reverseLocalUri });
        setIsRouteActive(true);

        const videoUri =
          routeVideos[searchKey] || routeVideos[reverseSearchKey];
        setCurrentVideoUri(videoUri || "");

        setShowSearchBar(false);
        return;
      }

      // Si no se encontró la imagen para ninguna de las claves, mostrar una alerta
      Alert.alert("No se encontró ninguna imagen para esta búsqueda.");
    } catch (error) {
      console.error("Error al buscar ruta:", error);
    }
  };

  // Función para limpiar la ruta seleccionada
  const clearRoute = () => {
    setSelectedRouteImage(null); // Limpiar la imagen de la ruta
    setCurrentMapImage(require("./assets/images/mapa.webp")); // Restablecer la imagen del mapa
    setIsRouteActive(false); // Marcar la ruta como inactiva
    setActiveRoutePoints([]); // Limpiar los puntos de la ruta activa
    setCurrentVideoUri("");
    setIsVideoModalVisible(false);
  };

  const toggleVideoModal = () => {
    if (currentVideoUri) {
      setIsVideoModalVisible(!isVideoModalVisible);
    }
  };

  return (
    <View style={styles.container}>
      {/* Componente para descargar los recursos necesarios */}

      {/* Pantalla de carga */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <LottieView
            source={require("../../assets/animations/Map_loading.json")}
            autoPlay
            loop
            style={styles.lottieAnimation}
            onAnimationFinish={handleImageLoad} // Una vez termine la animación, cargamos la app
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

      {showDownloadModal && (
        <DownloadAssets
          onClose={handleCloseDownloadModal}
          onViewDownload={() => { navigation.navigate("FileManagementScreen"); setShowDownloadModal(false); }}
          
          onDownloadComplete={handleDownloadComplete}
          visible={showDownloadModal}
        />
      )}

      <DeleteLocalFiles onFilesDeleted={handleFilesDeleted} />

      {/* Botón para finalizar la ruta */}
      {isRouteActive && (
        <TouchableOpacity style={styles.finalizeButton} onPress={clearRoute}>
          <Text style={styles.finalizeButtonText}>Finalizar Ruta</Text>
        </TouchableOpacity>
      )}

      <Animated.View
        style={[styles.overlay, { opacity: fadeAnim }]}
        pointerEvents="none"
      />

      {isRouteActive && currentVideoUri && (
        <TouchableOpacity style={styles.videoButton} onPress={toggleVideoModal}>
          <FontAwesomeIcon icon={faPlay} size={24} color="#FFFFFF" />
          <Text style={styles.videoButtonText}>Ver Video</Text>
        </TouchableOpacity>
      )}

      <VideoModal
        isVisible={isVideoModalVisible}
        onClose={toggleVideoModal}
        videoUri={currentVideoUri}
      />

      {!isRouteActive && !showSearchBar && <ChatbotButton />}

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
    fontSize: 18,
  },
  videoButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#0b34b0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
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
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 16,
  },
  downloadButton: {
    position: "absolute",
    bottom: 20,
    left: 80,
    backgroundColor: "#007bff",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 20,
  },
});

export default HomePage;
