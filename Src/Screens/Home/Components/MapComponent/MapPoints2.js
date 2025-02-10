import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Svg, { Polyline } from "react-native-svg";

export const MapWithPointsAndRoutes2 = ({
  onPointPress,
  points,
  markedObject,
  setMarkedObject,
  isRouteActive,
  activeRoutePoints,
}) => {
  const handlePointPress = (point) => {
    onPointPress(point.id); // Llama a la función con el ID del punto presionado
  };

  // Renderiza los puntos (por ejemplo, para puntos clicables en el mapa)
  const renderPoints = () => {
    return points.map((point) => (
      <TouchableOpacity
        key={point.id}
        style={[
          styles.point,
          {
            left: point.left,
            top: point.top,
            height: point.height,
            width: point.width,
            transform: [{ rotate: `${point.rotate}deg` }],
          },
        ]}
        onPress={() => {
          handlePointPress(point);
          console.log("Punto presionado:", point.id);
        }}
      />
    ));
  };

  // Renderiza un marcador (por ejemplo, para marcar un punto seleccionado)
  const renderMarker = () => {
    if (!markedObject) return null;

    const markerPosition = {
      left: markedObject.left + markedObject.width / 2 - 50,
      top: markedObject.top - 30,
    };

    return (
      <View style={[styles.markerContainer, markerPosition]}>
        <FontAwesomeIcon icon={faMapMarkerAlt} size={20} color="#ff6b6b" />
        <Text style={styles.markerText}>{markedObject.name}</Text>
        <TouchableOpacity onPress={removeMarker} style={styles.removeMarkerButton}>
          <FontAwesomeIcon icon={faTimes} size={14} color="#666666" />
        </TouchableOpacity>
      </View>
    );
  };

  const removeMarker = () => {
    setMarkedObject(null);
  };

  // Dibuja la línea de la ruta usando react-native-svg
  const renderRouteLine = () => {
    if (!isRouteActive || !activeRoutePoints || activeRoutePoints.length < 2) return null;
    // Convierte el arreglo de coordenadas a una cadena: "x1,y1 x2,y2 ..."
    const pointsString = activeRoutePoints.map(coord => coord.join(',')).join(' ');
    return (
      <Svg style={StyleSheet.absoluteFill}>
        <Polyline
          points={pointsString}
          fill="none"
          stroke="#FF0000"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  };

  // Dibuja dos "pins" en el origen y destino de la ruta
  const renderRoutePins = () => {
    if (!isRouteActive || !activeRoutePoints || activeRoutePoints.length < 2) return null;
    const origin = activeRoutePoints[0];
    const destination = activeRoutePoints[activeRoutePoints.length - 1];
    return (
      <>
        <View style={[styles.routePin, { left: origin[0] - 12, top: origin[1] - 24 }]}>
          <FontAwesomeIcon icon={faMapMarkerAlt} size={24} color="#0000FF" />
        </View>
        <View style={[styles.routePin, { left: destination[0] - 12, top: destination[1] - 24 }]}>
          <FontAwesomeIcon icon={faMapMarkerAlt} size={24} color="#00FF00" />
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {renderPoints()}
      {renderMarker()}
      {renderRouteLine()}
      {renderRoutePins()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  point: {
    position: "absolute",
    opacity: 1,
    borderRadius: 5,
  },
  markerContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markerText: {
    fontSize: 14,
    color: "#000000",
    marginLeft: 6,
    marginRight: 6,
  },
  removeMarkerButton: {
    padding: 3,
  },
  routePin: {
    position: "absolute",
  },
});

export default MapWithPointsAndRoutes2;
