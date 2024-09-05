import React, { useState, useRef } from "react";
import {
  View, StyleSheet, TouchableOpacity, Image, Dimensions, Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBars, faRoute, faUser } from "@fortawesome/free-solid-svg-icons";
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import ImageZoom from "react-native-image-pan-zoom";
import { SearchRoute } from "./Components/Layout/SearchRoute";
import { SpecificSearch } from "./Components/Layout/SearchSpecific";
import { BottomSheetComponent } from "./Components/BottonSheetComponent/BottonSheet";
import { MapWithPointsAndRoutes } from "./Components/MapComponent/MapPoints";
import { points, routes } from "./Components/MapComponent/data";

const { width, height } = Dimensions.get("window");

export const HomePage = () => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);
  const imageZoomRef = useRef(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showSpecificSearch, setShowSpecificSearch] = useState(false);

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

  // Ajuste para centrar y hacer zoom en un punto específico
  const zoomToPoint = (pointId) => {
    const point = points.find((p) => p.id === pointId);
    if (point && imageZoomRef.current) {
      // Centra las coordenadas en el punto exacto del mapa
      const centerX = point.left + (point.width / 2);
      const centerY = point.top + (point.height / 2);

      imageZoomRef.current.centerOn({
        x: centerX,
        y: centerY,
        scale: 2, // Cambia el nivel de zoom según tus necesidades
        duration: 300,
      });
    }
  };

  // Función para manejar la búsqueda específica y hacer zoom en el punto
  const handleSpecificSearch = (pointId) => {
    setSelectedPoint(pointId);
    bottomSheetRef.current?.expand();
    setShowSpecificSearch(false);
    zoomToPoint(pointId);
  };

  // Funcion para manejar la busqueda de rutas y hacer zoom en la ruta
  const handleSearch = (search) => {
    setSelectedRoute(search);
    setShowSearchBar(false);
    zoomToRoute(search.origin, search.destination);
  };

  // zoom al buscar la ruta
  const zoomToRoute = (originName, destinationName) => {
    const origin = points.find((p) => p.name === originName);
    const destination = points.find((p) => p.name === destinationName);

    if (origin && destination && imageZoomRef.current) {
      const route = routes[originName]?.[destinationName];
      if (route && route.length > 0) {
        // Calcula el punto medio entre origen y destino
        const midX = (origin.left + destination.left) -5;
        const midY = (origin.top + destination.top) ;

        imageZoomRef.current.centerOn({
          x: midX,
          y: midY,
          scale: 1.5, // Nivel de zoom adecuado para ver la ruta completa
          duration: 300,
        });
      }
    }
  };

  const clearRoute = () => { //limpia la ruta mostrada 
    setSelectedRoute(null);
  };

  return (
    <View style={styles.container}>
      {showSpecificSearch && <View style={styles.overlay} />}

      {/* Iconos de Menú, Perfil y Buscar Ruta */}
      <TouchableOpacity
        style={styles.menu_icon}
        onPress={() => navigation.openDrawer()}>
        <FontAwesomeIcon icon={faBars} size={width * 0.06} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profile_icon}
        onPress={() => navigation.navigate("Perfil")}> 
        <FontAwesomeIcon icon={faUser} size={width * 0.06} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.search_icon} onPress={toggleSearchBar}>
        <FontAwesomeIcon icon={faRoute} size={width * 0.06} color="white" />
      </TouchableOpacity>

      {/* Componente de Búsqueda de Ruta */}
      {showSearchBar && (
        <SearchRoute
          onClose={closeSearchBar}
          onSearch={handleSearch}
          points={points}
        />
      )}

      {/* Componente de Búsqueda Específica */}
      <SpecificSearch
        points={points}
        onSearch={handleSpecificSearch}
        setShowSpecificSearch={setShowSpecificSearch}
      />

      {/* Componente de Mapa con Puntos y Rutas */}
      <GestureHandlerRootView style={styles.imageContainer}>
        <ImageZoom
          ref={imageZoomRef} // Referencia para el componente ImageZoom
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

      {/* Componente de Botón Finalizar Ruta */}
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
