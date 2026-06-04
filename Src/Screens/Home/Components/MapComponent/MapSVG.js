import React, { memo, useCallback, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Animated } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTimes,
  faMapMarkerAlt,
  faLocationArrow,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import { RouteLine } from "./RouteLine";

const MapSVG = ({
  isRouteActive = false,
  activeRoutePoints = [],
  points = [],
  onPointPress,
  markedObject,
  setMarkedObject,
}) => {
  // Animaciones múltiples para efectos más sofisticados
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    let animationGroup;

    if (isRouteActive && activeRoutePoints.length > 1) {
      animationGroup = Animated.parallel([
        // Pulse (Escala)
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.3, duration: 800, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          ])
        ),
      ]);

      animationGroup.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => {
      if (animationGroup) animationGroup.stop();
    };
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
            //backgroundColor: "rgba(255, 0, 0 ,0.5) "
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

      {activeRoutePoints !== undefined && activeRoutePoints.length > 1 &&
        <RouteLine points={activeRoutePoints} />
      }
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
