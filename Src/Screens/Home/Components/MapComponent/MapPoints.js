import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { routes } from './data'; // Importa las rutas de los puntos

const { width, height } = Dimensions.get('window');

export const MapWithPointsAndRoutes = ({
  onPointPress,
  selectedRoute,
  selectedPoint,
  points,
  clearRoute,
  markedObject,
  setMarkedObject
}) => {
  // Renderiza los puntos en el mapa
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
            // backgroundColor: selectedPoint === point.id ? 'yellow' : 'red',
            transform: [{ rotate: `${point.rotate}deg` }],
          },
        ]}
        onPress={() => {
          onPointPress(point.id);
          console.log(point.id);
          console.log(`Coordenadas: x=${point.left}, Y=${point.top}`);
        }}
      />
    ));
  };

  // Renderiza el marcador para el objeto seleccionado
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

  // Función para remover el marcador
  const removeMarker = () => {
    setMarkedObject(null);
  };

  return (
    <View style={styles.container}>
      {renderPoints()}
      {renderMarker()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  point: {
    position: 'absolute',
    opacity: 0.5
  },
  svgContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none', 
  },
  markerContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
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
    fontSize: width * 0.03,
    color: "#000000",
    marginLeft: 6,
    marginRight: 6,
  },
  removeMarkerButton: {
    padding: 3,
  },
});

export default MapWithPointsAndRoutes;