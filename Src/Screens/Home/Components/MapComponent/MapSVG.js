// MapSVG.js
import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import Svg, { Polyline } from "react-native-svg";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const MapSVG = ({
  isRouteActive = false,
  activeRoutePoints = [],
  points = [],
  onPointPress,
  markedObject,
  setMarkedObject,
}) => {
  // Convierte las coordenadas de la ruta a la cadena "x1,y1 x2,y2 ..."
  const pointsString = activeRoutePoints
    .map(([x, y]) => `${x},${y}`)
    .join(" ");

  // Renderiza los puntos clicables (por ejemplo, edificios u otros puntos)
  const renderPoints = () => {
    return points.map((point) => (
      <TouchableOpacity
        key={point.id}
        style={[
          styles.point,
          {
            left: point.left,
            top: point.top,
            width: point.width,
            height: point.height,
            transform: [{ rotate: `${point.rotate}deg` }],
          },
        ]}
        onPress={() => {
          if (onPointPress) onPointPress(point.id);
          console.log("Punto presionado:", point.id);
        }}
      />
    ));
  };

  // Renderiza un marcador para el objeto seleccionado
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
        <TouchableOpacity
          onPress={() => setMarkedObject(null)}
          style={styles.removeMarkerButton}
        >
          <FontAwesomeIcon icon={faTimes} size={14} color="#666666" />
        </TouchableOpacity>
      </View>
    );
  };

  // Renderiza la línea de la ruta
  const renderRouteLine = () => {
    if (!isRouteActive || activeRoutePoints.length < 2) return null;
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

  // Renderiza los pines de origen y destino usando iconos de mapa
  const renderRoutePins = () => {
    if (!isRouteActive || activeRoutePoints.length < 2) return null;
    const origin = activeRoutePoints[0];
    const destination = activeRoutePoints[activeRoutePoints.length - 1];
    return (
      <>
        <View
          style={[styles.routePin, { left: origin[0] - 12, top: origin[1] - 24 }]}
        >
          <FontAwesomeIcon icon={faMapMarkerAlt} size={24} color="#0000FF" />
        </View>
        <View
          style={[
            styles.routePin,
            { left: destination[0] - 12, top: destination[1] - 24 },
          ]}
        >
          <FontAwesomeIcon icon={faMapMarkerAlt} size={24} color="#00FF00" />
        </View>
      </>
    );
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      {renderRouteLine()}
      {renderPoints()}
      {renderMarker()}
      {renderRoutePins()}
    </View>
  );
};

export default MapSVG;

const styles = StyleSheet.create({
  point: {
    position: "absolute",
    // Puedes agregar un fondo semitransparente para ver el área clicable (opcional)
    backgroundColor: "transparent",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markerText: {
    fontSize: 14,
    color: "#000",
    marginHorizontal: 6,
  },
  removeMarkerButton: {
    padding: 3,
  },
  routePin: {
    position: "absolute",
  },
});
