import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Animated } from "react-native";
import Svg, {
  Polyline,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  RadialGradient,
} from "react-native-svg";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTimes,
  faMapMarkerAlt,
  faLocationArrow,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";

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
  const pointsString = useMemo(() => {
    return activeRoutePoints
      .map(([x, y]) => `${x},${y}`)
      .join(" ");
  }, [activeRoutePoints]);

  // Animaciones múltiples para efectos más sofisticados
  const dashOffset = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // const dash = () => {
  //   Animated.loop(
  //     Animated.timing(dashOffset, {
  //       toValue: 30,
  //       duration: 2000,
  //       useNativeDriver: true,
  //     })
  //   ).start();
  // }

  // const pulse = () => {
  //   Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(pulseAnim, {
  //         toValue: 1.3,
  //         duration: 800,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(pulseAnim, {
  //         toValue: 1,
  //         duration: 800,
  //         useNativeDriver: true,
  //       }),
  //     ])
  //   ).start();
  // }

  // const glow = () => {
  //   Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(glowAnim, {
  //         toValue: 1,
  //         duration: 1500,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(glowAnim, {
  //         toValue: 0,
  //         duration: 1500,
  //         useNativeDriver: true,
  //       }),
  //     ])
  //   ).start();
  // }

  useEffect(() => {
    if (isRouteActive && activeRoutePoints.length > 1) {
      // Animación del dash offset para el efecto de flujo
      Animated.loop(
        Animated.timing(dashOffset, {
          toValue: 30,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();

      // Animación de pulso para los pines
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Animación de brillo para la línea
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isRouteActive, activeRoutePoints]);

  const handlePointPress = useCallback((point) => {
    onPointPress(point.id);
  }, [onPointPress]);

  const renderPoints = useCallback(() => {
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
  }, [points, handlePointPress]);

  const renderMarker = useCallback(() => {
    if (!markedObject) return null;
    const markerPosition = {
      left: markedObject.left + markedObject.width / 2 - 60,
      top: markedObject.top - 45,
    };
    return (
      <Animated.View
        style={[
          styles.markerContainer,
          markerPosition,
          {
            transform: [{ scale: pulseAnim }],
          }
        ]}

      >
        <View style={styles.markerIconContainer}>
          <FontAwesomeIcon icon={faMapMarkerAlt} size={18} color="#0033A0" />
        </View>
        <Text style={styles.markerText}>{markedObject.name}</Text>
        <TouchableOpacity
          onPress={() => setMarkedObject(null)}
          style={styles.removeMarkerButton}
        >
          <FontAwesomeIcon icon={faTimes} size={12} color="#666666" />
        </TouchableOpacity>
      </Animated.View>
    );
  }, [markedObject, setMarkedObject, pulseAnim]);

  // Renderiza la línea de la ruta con múltiples capas para un efecto premium
  const renderRouteLine = useCallback(() => {
    if (!isRouteActive || activeRoutePoints.length < 2) return null;

    return (
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          {/* Gradiente principal azul vibrante */}
          <LinearGradient id="routeGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#0033A0" stopOpacity="1" />
            <Stop offset="25%" stopColor="#1E40AF" stopOpacity="1" />
            <Stop offset="50%" stopColor="#3B82F6" stopOpacity="1" />
            <Stop offset="75%" stopColor="#60A5FA" stopOpacity="1" />
            <Stop offset="100%" stopColor="#93C5FD" stopOpacity="1" />
          </LinearGradient>

          {/* Gradiente de brillo para efecto glow */}
          <RadialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <Stop offset="70%" stopColor="#3B82F6" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#0033A0" stopOpacity="0" />
          </RadialGradient>

          {/* Gradiente para la sombra */}
          <LinearGradient id="shadowGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
            <Stop offset="50%" stopColor="#000000" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </LinearGradient>
        </Defs>

        {/* Capa de sombra exterior */}
        <AnimatedPolyline
          points={pointsString}
          fill="none"
          stroke="url(#shadowGradient)"
          strokeWidth={14}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="0"
          style={{
            transform: [
              { translateX: 2 },
              { translateY: 2 }
            ]
          }}
        />

        {/* Capa de borde exterior */}
        <AnimatedPolyline
          points={pointsString}
          fill="none"
          stroke="#1F2937"
          strokeWidth={12}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="0"
        />

        {/* Capa principal con gradiente */}
        <AnimatedPolyline
          points={pointsString}
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="15,8"
          strokeDashoffset={dashOffset}
        />

        {/* Capa de brillo interior */}
        <AnimatedPolyline
          points={pointsString}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="10,15"
          strokeDashoffset={dashOffset}
          style={{
            opacity: glowAnim,
          }}
        />
      </Svg>
    );
  }, [isRouteActive, activeRoutePoints, dashOffset, glowAnim]);

  // Renderiza pines de origen y destino con efectos premium
  const renderRoutePins = useCallback(() => {
    if (!isRouteActive || activeRoutePoints.length < 2) return null;
    const origin = activeRoutePoints[0];
    const destination = activeRoutePoints.at(-1);

    return (
      <>
        {/* Pin de origen sin animación */}
        <View
          style={[
            styles.routePin,
            styles.originPin,
            {
              left: origin[0] - 15,
              top: origin[1] - 20,
            },
          ]}
        >
          <View style={styles.pinGlow}>
            <View style={styles.pinContainer}>
              <FontAwesomeIcon icon={faLocationArrow} size={12} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.pinLabel}>
            <Text style={styles.pinLabelText}>Origen</Text>
          </View>
        </View>

        {/* Pin de destino sin animación */}
        <View
          style={[
            styles.routePin,
            styles.destinationPin,
            {
              left: destination[0] - 17,
              top: destination[1] - 20,
            },
          ]}
        >
          <View style={styles.pinGlow}>
            <View style={[styles.pinContainer, styles.destinationPinContainer]}>
              <FontAwesomeIcon icon={faFlag} size={12} color="#FFFFFF" />
            </View>
          </View>
          <View style={[styles.pinLabel, styles.destinationLabel]}>
            <Text style={styles.pinLabelText}>Destino</Text>
          </View>
        </View>
      </>
    );
  }, [isRouteActive, activeRoutePoints]);

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: "box-none" }]}>
      {renderRouteLine()}
      {renderPoints()}
      {renderMarker()}
      {renderRoutePins()}
    </View>
  );
};

export default memo(MapSVG);

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
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  originPin: {
    zIndex: 1001,
  },
  destinationPin: {
    zIndex: 1002,
  },
  pinContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0033A0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  destinationPinContainer: {
    backgroundColor: '#FF6B35',
  },
  pinGlow: {
    padding: 2,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    elevation: 6,
    shadowColor: '#0033A0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  pinLabel: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(0, 51, 160, 0.9)',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  destinationLabel: {
    backgroundColor: 'rgba(255, 107, 53, 0.95)',
  },
  pinLabelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
