import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faRoute, faUser } from '@fortawesome/free-solid-svg-icons';
import { PinchGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageZoom from 'react-native-image-pan-zoom';
import { SearchRoute } from './Components/Layout/SearchRoute';
import { SpecificSearch } from './Components/Layout/SearchSpecific';
import { BottomSheetComponent } from './Components/BottonSheetComponent/BottonSheet';
import { MapWithPointsAndRoutes } from './Components/MapComponent/MapPoints'; 
import { points } from './Components/MapComponent/data';

export const HomePage = () => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showSpecificSearch, setShowSpecificSearch] = useState(false);

  const handlePointPress = (pointId) => {
    setSelectedPoint(pointId);
    bottomSheetRef.current?.expand();
  };

  const handleZoomEvent = (event) => {
    console.log('Zoom Scale:', event.nativeEvent.scale);
  };

  const toggleSearchBar = () => {
    setShowSearchBar((prev) => !prev);
  };

  const closeSearchBar = () => {
    setShowSearchBar(false);
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const handleSpecificSearch = (pointId) => {
    setSelectedPoint(pointId);
    bottomSheetRef.current?.expand(); // Abrir BottomSheet si se selecciona un punto
    setShowSpecificSearch(false);
  };

  const handleProfilePress = () => {
    navigation.navigate('Perfil');
  };

  const handleSearch = (search) => {
    setSelectedRoute(search);
    setShowSearchBar(false);
  };

  const clearRoute = () => {
    setSelectedRoute(null);
  };

  return (
    <View style={styles.container}>
      {showSpecificSearch && <View style={styles.overlay} />}
      <TouchableOpacity
        style={styles.menu_icon}
        onPress={() => navigation.openDrawer()}>
        <FontAwesomeIcon icon={faBars} size={23} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.profile_icon}
        onPress={handleProfilePress}>
        <FontAwesomeIcon icon={faUser} size={23} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.search_icon} onPress={toggleSearchBar}>
        <FontAwesomeIcon icon={faRoute} size={23} color="white" />
      </TouchableOpacity>
      {showSearchBar && (
        <SearchRoute
          onClose={closeSearchBar}
          onSearch={handleSearch}
          points={points}
        />
      )}

      <SpecificSearch
        points={points}
        onSearch={handleSpecificSearch}
        setShowSpecificSearch={setShowSpecificSearch}
      />

      <GestureHandlerRootView style={styles.imageContainer}>
        <PinchGestureHandler
          onGestureEvent={handleZoomEvent}
          onHandlerStateChange={handleZoomEvent}>
          <ImageZoom
            cropWidth={Dimensions.get('window').width}
            cropHeight={Dimensions.get('window').height}
            imageWidth={1600}
            imageHeight={1400}
            enableSwipeDown={false}
            panToMove={true}
            pinchToZoomInSensitivity={1}
            minScale={1.1}
            maxScale={3}
            centerOn={{ x: 250, y: -90, scale: 1.1 }}
            maxOverflow={0}>
            <Image
              source={require('./assets/images/mapa2.webp')}
              style={styles.image}
            />
            <MapWithPointsAndRoutes
              onPointPress={handlePointPress}
              selectedRoute={selectedRoute}
              selectedPoint={selectedPoint}
              points={points}
              clearRoute={clearRoute}
            />
          </ImageZoom>
        </PinchGestureHandler>
      </GestureHandlerRootView>

      <BottomSheetComponent
        ref={bottomSheetRef}
        snapPoints={['1%', '35%']}
        selectedPoint={selectedPoint}
        onClose={handleCloseBottomSheet}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  menu_icon: {
    position: 'absolute',
    top: 45,
    left: 10,
    backgroundColor: 'blue',
    borderRadius: 35,
    padding: 15,
    zIndex: 2,
  },
  search_icon: {
    position: 'absolute',
    top: 45,
    right: 70,
    backgroundColor: 'blue',
    borderRadius: 25,
    padding: 15,
    zIndex: 2,
  },
  profile_icon: {
    position: 'absolute',
    top: 45,
    right: 305,
    backgroundColor: 'blue',
    borderRadius: 25,
    padding: 15,
    zIndex: 2,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
    alignSelf: 'stretch',
  },
});

export default HomePage;
