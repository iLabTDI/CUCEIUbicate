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

const { width, height } = Dimensions.get("window");

export const HomePage = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const imageZoomRef = useRef(null);
  const bottomSheetRef = useRef(null);

  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedRouteImage, setSelectedRouteImage] = useState(null);
  const [currentMapImage, setCurrentMapImage] = useState(
    require("./assets/images/mapa.webp")
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

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isFocused) {
      checkSession().then(() => {
        loadSelectedIcon();
      });
    }
  }, [isFocused]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isBottomSheetVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isBottomSheetVisible, fadeAnim]);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem('hasLaunchedd');
      if (hasLaunched === null) {
        setIsFirstLaunch(true);
        await AsyncStorage.setItem('hasLaunchedd', 'true');
      } else {
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  useEffect(() => {
    if (!isLoading && isFirstLaunch) {
      setShowDownloadModal(true);
    }
  }, [isLoading, isFirstLaunch]);

  const checkSession = async () => {
    const session = await getSession();
    if (!session) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  };

  const handleCloseDownloadModal = () => {
    setShowDownloadModal(false);
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

  const handleFilesDeleted = async () => {
    await AsyncStorage.removeItem("hasLaunchedd");
    setShowDownloadModal(true);
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

  const handleSearch = async ({ searchKey, reverseSearchKey }) => {
    try {
      const localUri = `${FileSystem.documentDirectory}${searchKey}.webp`;
      const fileExists = await FileSystem.getInfoAsync(localUri);

      if (fileExists.exists) {
        setSelectedRouteImage(localUri);
        setCurrentMapImage({ uri: localUri });
        setIsRouteActive(true);
        const videoUri = routeVideos[searchKey] || routeVideos[reverseSearchKey];
        setCurrentVideoUri(videoUri || "");
        setShowSearchBar(false);
        return;
      }

      const reverseLocalUri = `${FileSystem.documentDirectory}${reverseSearchKey}.webp`;
      const reverseFileExists = await FileSystem.getInfoAsync(reverseLocalUri);

      if (reverseFileExists.exists) {
        setSelectedRouteImage(reverseLocalUri);
        setCurrentMapImage({ uri: reverseLocalUri });
        setIsRouteActive(true);
        const videoUri = routeVideos[searchKey] || routeVideos[reverseSearchKey];
        setCurrentVideoUri(videoUri || "");
        setShowSearchBar(false);
        return;
      }

      Alert.alert("No se encontró ninguna imagen para esta búsqueda.");
    } catch (error) {
      console.error("Error al buscar ruta:", error);
    }
  };

  const clearRoute = () => {
    setSelectedRouteImage(null);
    setCurrentMapImage(require("./assets/images/mapa.webp"));
    setIsRouteActive(false);
    setActiveRoutePoints([]);
    setCurrentVideoUri("");
    setIsVideoModalVisible(false);
  };

  const toggleVideoModal = () => {
    if (currentVideoUri) {
      setIsVideoModalVisible(!isVideoModalVisible);
    }
  };

  const handleViewDownload = () => {
    setShowDownloadModal(false);
    navigation.navigate("FileManagementScreen", { startDownloadAutomatically: true });
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <LottieView
            source={require("../../assets/animations/Map_loading.json")}
            autoPlay
            loop={false}
            style={styles.lottieAnimation}
            onAnimationFinish={handleImageLoad}
          />
          <Text style={styles.loadingText}>Cargando mapa...</Text>
        </View>
      )}

      {!isLoading && (
        <>
          <TouchableOpacity
            style={styles.menu_icon}
            onPress={() => navigation.openDrawer()}>
            <FontAwesomeIcon icon={faBars} size={width * 0.06} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profile_icon}
            onPress={() => navigation.navigate("Perfil")}>
            {selectedIcon ? (
              <Image source={selectedIcon} style={styles.profileImage} />
            ) : (
              <FontAwesomeIcon icon={faUser} size={width * 0.06} color="#FFFFFF" />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.search_icon} onPress={toggleSearchBar}>
            <FontAwesomeIcon icon={faRoute} size={width * 0.06} color="#FFFFFF" />
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
              <Image
                source={currentMapImage}
                style={styles.image}
                resizeMode="contain"
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
              onViewDownload={handleViewDownload}
              visible={showDownloadModal}
            />
          )}

          <DeleteLocalFiles onFilesDeleted={handleFilesDeleted} />

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
        </>
      )}
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
