import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

export const MapWithPointsAndRoutes = ({
  onPointPress,
  points,
  markedObject,
  setMarkedObject,
}) => {
  const handlePointPress = (point) => {
    onPointPress(point.id); // Llama a la función onPointPress con el ID del punto presionado
    // setMarkedObject(point); // Marca el punto como seleccionado
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
            height: point.height,
            width: point.width,
            transform: [{ rotate: `${point.rotate}deg` }],
          },
        ]}
        onPress={() => {
          handlePointPress(point);
          console.log("Punto presionado:", point.id);
        }}></TouchableOpacity>
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
          onPress={removeMarker}
          style={styles.removeMarkerButton}>
          <FontAwesomeIcon icon={faTimes} size={14} color="#666666" />
        </TouchableOpacity>
      </View>
    );
  };

  const removeMarker = () => {
    setMarkedObject(null); // Remueve la marca establecida en el mapa
  };

  return (
    <View style={styles.container}>
      {renderPoints()}
      {renderMarker()}
    </View>
  );
};

// Estilos del componente MapWithPointsAndRoutes
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  point: {
    position: "absolute",
    opacity: 10,
    backgroundColor: '#FF0000',
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
});

export default MapWithPointsAndRoutes;
