import React, { useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import { PinchGestureHandler } from "react-native-gesture-handler";
import ImageZoom from "react-native-image-pan-zoom";
import { Dimensions } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const HomePage = () => {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const bottomSheetRef = useRef(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const snapPoints = ["20%", "40%"];

  const handleOpenBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.expand();
    }
  };

  const handleCloseBottomSheet = useCallback((index) => {
    if (index === 0) {
      if (bottomSheetRef.current) {
        bottomSheetRef.current.close();
      }
    }
  }, []);

  const handlePointPress = (pointId) => {
    setSelectedPoint(pointId);
    setBottomSheetVisible(true);
    handleOpenBottomSheet();
  };

  const handleZoomEvent = (event) => {
    console.log("Zoom Scale:", event.nativeEvent.scale);
  };

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PinchGestureHandler
          onGestureEvent={handleZoomEvent}
          onHandlerStateChange={handleZoomEvent}>
          <ImageZoom
            cropWidth={Dimensions.get("window").width}
            cropHeight={Dimensions.get("window").height}
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
              source={require("../assets/images/mapa.webp")}
              style={styles.image}
            />

            {/* Puntos de interes */}
            <TouchableOpacity
              style={[styles.point, { left: 100, top: 200 }]}
              onPress={handlePointPress}
            />
            <TouchableOpacity
              id="Modulo X"
              style={[styles.point, { left: 280, top: 488 }]}
              onPress={() => handlePointPress("Modulo X")}
            />
            {/* mas puntos */}
          </ImageZoom>
        </PinchGestureHandler>
      </GestureHandlerRootView>

      {/* BottomSheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleCloseBottomSheet}>
        <BottomSheetScrollView
          contentContainerStyle={styles.bottomSheetContent}>
          {/* <Text>Modulos</Text> */}

          {selectedPoint === "Modulo X" && (
            <Image
              source={require("../assets/images/Modulos/Modulo_X.jpeg")}
              style={styles.bottomSheetImage}
            />
          )}

          {/* <Button title="Cerrar" onPress={handleCloseBottomSheet} /> */}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
    alignSelf: "stretch",
  },
  point: {
    position: "absolute",
    width: 50,
    height: 20,
    backgroundColor: "blue",
    opacity: 0, //se hace invisible
  },
  bottomSheetContent: {
    alignItems: "center",
    padding: 20,
  },
  bottomSheetImage: {
    width: 400,
    height: 230,
  },
});
