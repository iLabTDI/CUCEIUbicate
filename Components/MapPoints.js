import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";

export const MapPoints = ({ onPointPress, selectedRoute, selectedPoint, points }) => {
  return (
    <View style={styles.container}>
      {points.map((point) => (
        <TouchableOpacity
          key={point.id}
          style={[
            styles.point,
            {
              left: point.left,
              top: point.top,
              height: point.height,
              width: point.width,
              transform: point.transform,
              backgroundColor: selectedRoute && (selectedRoute.origin === point.id || selectedRoute.destination === point.id)
                ? "rgba(255, 255, 0, 0.5)"
                : "rgba(255, 0, 0, 0.5)",
            },
          ]}
          onPress={() => onPointPress(point.id)}
        />
      ))}
      {selectedPoint && (
        <Image
          source={require('../assets/images/pin.png')} // Asegúrate de tener esta imagen en tu proyecto
          style={[
            styles.pin,
            {
              left: points.find(point => point.id === selectedPoint)?.left || 0,
              top: points.find(point => point.id === selectedPoint)?.top || 0,
            }
          ]}
        />
      )}
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
    borderRadius: 20,
    zIndex: 10,
  },
  pin: {
    position: "absolute",
    width: 30,
    height: 30,
    zIndex: 20,
  },
});

export default MapPoints;
