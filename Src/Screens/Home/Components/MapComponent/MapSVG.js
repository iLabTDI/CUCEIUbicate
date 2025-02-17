import React, { useEffect, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Animated } from "react-native";
import Svg, { Polyline, Defs, LinearGradient, Stop } from "react-native-svg";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

const MapSVG = ({
  isRouteActive = false,
  activeRoutePoints = [],
  points = [],
  onPointPress,
  markedObject,
  setMarkedObject,
}) => {
  // Convierte las coordenadas de la ruta a "x1,y1 x2,y2 ..."
  const pointsString = activeRoutePoints
    .map(([x, y]) => `${x},${y}`)
    .join(" ");

  // Animación para dash offset, crea un efecto de desplazamiento en el trazo
  const dashOffset = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (isRouteActive && activeRoutePoints.length > 1) {
      Animated.loop(
        Animated.timing(dashOffset, {
          toValue: 20,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [isRouteActive, activeRoutePoints]);

  const handlePointPress = (point) => {
    onPointPress(point.id);
  };

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
            // transform: [{ rotate: `${point.rotate}deg` }],
          },
        ]}
        onPress={() => {
          handlePointPress(point);
          console.log("Punto presionado:", point.id);
        }}
      />
    ));
  };

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

  // Renderiza la línea de la ruta con dos capas: borde y trazo interior degradado y animado
  const renderRouteLine = () => {
    if (!isRouteActive || activeRoutePoints.length < 2) return null;
    return (
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#FFFF00" stopOpacity="1" />
            <Stop offset="100%" stopColor="#FFD700" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        {/* Línea de borde (negro) */}
        <AnimatedPolyline
          points={pointsString}
          fill="none"
          stroke="black"
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="10,5"
          strokeDashoffset={dashOffset}
        />
        {/* Línea interior con degradado */}
        <AnimatedPolyline
          points={pointsString}
          fill="none"
          stroke="url(#grad)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="10,5"
          strokeDashoffset={dashOffset}
        />
      </Svg>
    );
  };

  // Renderiza pines de origen y destino con sombra para resaltarlos
  const renderRoutePins = () => {
    if (!isRouteActive || activeRoutePoints.length < 2) return null;
    const origin = activeRoutePoints[0];
    const destination = activeRoutePoints[activeRoutePoints.length - 1];
    return (
      <>
        <View
          style={[
            styles.routePin,
            styles.pinShadow,
            { left: origin[0] - 12, top: origin[1] - 24 },
          ]}
        >
          <FontAwesomeIcon icon={faMapMarkerAlt} size={24} color="#FF0000" />
        </View>
        <View
          style={[
            styles.routePin,
            styles.pinShadow,
            { left: destination[0] - 12, top: destination[1] - 24 },
          ]}
        >
          <FontAwesomeIcon icon={faMapMarkerAlt} size={24} color="#FF0000" />
        </View>
      </>
    );
  };

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: "box-none" }]}>
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
  pinShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
});
