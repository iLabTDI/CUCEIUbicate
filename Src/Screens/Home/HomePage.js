import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
} from "react-native";
import { useNavigation, useIsFocused} from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBars, faRoute, faUser } from "@fortawesome/free-solid-svg-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ImageZoom from "react-native-image-pan-zoom";
import { SearchRoute } from "./Components/SearchBarsComponent/SearchRoute";
import { SpecificSearch } from "./Components/SearchBarsComponent/SearchSpecific";
import { BottomSheetComponent } from "./Components/BottonSheetComponent/BottonSheet";
import { MapWithPointsAndRoutes } from "./Components/MapComponent/MapPoints";
import { points, routes } from "./Components/MapComponent/data";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export const HomePage = () => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);
  const imageZoomRef = useRef(null);
  const isFocused = useIsFocused(); 
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showSpecificSearch, setShowSpecificSearch] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);

  useEffect(() => {
    if (isFocused) {  // <-- Cuando la pantalla se enfoca, cargamos el ícono
      loadSelectedIcon();
    }
  }, [isFocused]);  // <-- Dependencia en isFocused para recargar el ícono


  const loadSelectedIcon = async () => {
    try {
      const savedIcon = await AsyncStorage.getItem('selectedIcon');
      if (savedIcon) {
        setSelectedIcon(JSON.parse(savedIcon));
      }
    } catch (error) {
      console.error('Error loading selected icon:', error);
    }
  };

  const handlePointPress = (pointId) => {
    setSelectedPoint(pointId);
    bottomSheetRef.current?.expand();
  };

  const toggleSearchBar = () => {
    setShowSearchBar((prev) => !prev);
  };

  const closeSearchBar = () => {
    setShowSearchBar(false);
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const handleSpecificSearch = (pointId) => {
    setSelectedPoint(pointId);
    bottomSheetRef.current?.expand();
    setShowSpecificSearch(false);
  };

  const handleSearch = (search) => {
    setSelectedRoute(search);
    setShowSearchBar(false);
  };

  const clearRoute = () => {
    setSelectedRoute(null);
  };

  return (
    <View style={styles.container}>
      {showSpecificSearch && <View style={styles.overlay} />}

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
          <FontAwesomeIcon icon={faUser} size={width * 0.06}  color="white" />
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
          centerOn={{ x: 250, y: -20, scale: 0.9 }}
          >
          <Image
            source={require("./assets/images/mapa2.webp")}
            style={styles.image}
            resizeMode="contain"
          />
          <MapWithPointsAndRoutes
            onPointPress={handlePointPress}
            selectedRoute={selectedRoute}
            selectedPoint={selectedPoint}
            points={points}
            clearRoute={clearRoute}
          />
        </ImageZoom>
      </GestureHandlerRootView>

      {selectedRoute && (
        <TouchableOpacity style={styles.finalizeButton} onPress={clearRoute}>
          <Text style={styles.finalizeButtonText}>Finalizar Ruta</Text>
        </TouchableOpacity>
      )}

      <BottomSheetComponent
        ref={bottomSheetRef}
        snapPoints={["1%", "35%"]}
        selectedPoint={selectedPoint}
        onClose={handleCloseBottomSheet}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
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
    right: 75,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: width * 0.06,
    height: width * 0.06,
    // borderRadius: (width * 0.06) / 2,
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
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    zIndex: 3,
  },
  finalizeButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default HomePage;