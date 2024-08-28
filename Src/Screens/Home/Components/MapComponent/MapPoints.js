import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { routes } from './data'; // Importa las rutas de los puntos

export const MapWithPointsAndRoutes = ({
  onPointPress,
  selectedRoute,
  selectedPoint,
  points,
  clearRoute
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
            backgroundColor: selectedPoint === point.id ? 'yellow' : 'red',
          },
        ]}
        onPress={() => onPointPress(point.id)}
      />
    ));
  };

  // Renderizacion la rutaa seleccionadas en el mapa
  const renderRoute = () => {
    if (!selectedRoute || !selectedRoute.origin || !selectedRoute.destination) return null; // Si no hay ruta seleccionada, no renderiza nada

    const originBuilding = points.find(point => point.name === selectedRoute.origin);
    const destinationBuilding = points.find(point => point.name === selectedRoute.destination); // Busca los puntos de origen y destino

    if (!originBuilding || !destinationBuilding) return null; 
    

    const routeCoordinates = routes[selectedRoute.origin]?.[selectedRoute.destination]; // Obtiene las coordenadas de la ruta 
    
    if (!routeCoordinates || !Array.isArray(routeCoordinates) || routeCoordinates.length === 0) return null; 
 
    const pointsStr = routeCoordinates.map(coord => `${coord.x},${coord.y}`).join(' '); // Convierte las coordenadas en un string para renderizar la ruta

    return (
      <Svg style={styles.svgContainer}> 
        <Polyline
          points={pointsStr}
          stroke="blue"
          strokeWidth="4"
          fill="none"
        />
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      {renderPoints()}
      {renderRoute()}
      {/* {clearRoute && (
        <TouchableOpacity style={styles.clearButton} onPress={clearRoute}>
          <Text style={styles.clearButtonText}>Limpiar Ruta</Text>
        </TouchableOpacity>
      )} */}
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
    borderRadius: 20,
    opacity: 0
  },
  svgContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none', 
  },
  clearButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    zIndex: 1000
  },
});
