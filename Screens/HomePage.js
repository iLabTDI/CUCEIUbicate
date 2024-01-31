import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { PinchGestureHandler } from "react-native-gesture-handler";
import ImageZoom from "react-native-image-pan-zoom";
import { Dimensions } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBars,
  faUser,
  faSearch,
  faRoute,
} from "@fortawesome/free-solid-svg-icons";

export const HomePage = () => {
  const renderTopLeftMenu = () => {
    return (
      <View style={styles.topLeftContainer}>
        <TouchableOpacity style={styles.topLeftIcon}>
          <FontAwesomeIcon icon={faBars} size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topLeftIcon}>
          <FontAwesomeIcon icon={faUser} size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderTopRightIcons = () => {
    return (
      <View style={styles.topRightIcons}>
        <TouchableOpacity style={styles.topRightIcon}>
          <FontAwesomeIcon icon={faSearch} size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topRightIcon}>
          <FontAwesomeIcon icon={faRoute} size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const handleZoomEvent = React.useRef((event) => {
    console.log("Zoom Scale:", event.nativeEvent.scale);
  });

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PinchGestureHandler
          onGestureEvent={handleZoomEvent.current}
          onHandlerStateChange={handleZoomEvent.current}>
          <ImageZoom
            cropWidth={Dimensions.get('window').width}
            cropHeight={Dimensions.get('window').height}
            imageWidth={700}
            imageHeight={950}
            onZoom={() => console.log('onZoom')}
            enableSwipeDown={false}
            panToMove={true}
            pinchToZoomInSensitivity={1}
            pinchToZoomOutSensitivity={1}
            doubleClickToZoomOut={false}
            minScale={1.2}
            maxScale={3}  // Puedes ajustar esto según tus necesidades
            centerOn={{ x: 10, y: 0, scale: 1.2 }}
            >
            <Image
              source={require("../assets/images/Mapa.png")}
              style={{ flex: 1, width: undefined, height: undefined, alignSelf: 'stretch' }}
              resizeMode="contain"
            />
          </ImageZoom>
        </PinchGestureHandler>
      </GestureHandlerRootView>
      {renderTopLeftMenu()}
      {renderTopRightIcons()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topLeftContainer: {
    position: "absolute",
    top: 60,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
  },
  topLeftIcon: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 60,
    marginLeft: 10,
  },
  topRightIcons: {
    position: "absolute",
    top: 60,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 2,
  },
  topRightIcon: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 60,
    marginLeft: 10,
  },
});
