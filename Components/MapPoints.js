import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

export const MapPoints = ({ onPointPress }) => {
  const points = [
    { id: "point1", left: 200, top: 300, width: 90, height: 20 },
    {
      id: "Modulo X",
      left: 265,
      top: 488,
      width: 90,
      height: 20,
    },
    {
      id: "Modulo Z",
      left: 187,
      top: 649,
      height: 45,
      width: 18,
      transform: [{ rotate: "5deg" }],
    },
    // Agrega más puntos aquí
  ];

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
            },
          ]}
          onPress={() => onPointPress(point.id)}
        />
      ))}
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
    backgroundColor: "rgba(255, 0, 0, 0.5)",
    borderRadius: 10,
    zIndex: 10,
  },
});