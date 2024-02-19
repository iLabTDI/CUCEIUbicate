import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { PinchGestureHandler } from "react-native-gesture-handler";
import ImageZoom from "react-native-image-pan-zoom";
import { Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const HomePage = () => {
  const handleZoomEvent = React.useRef((event) => {
    console.log("Zoom Scale:", event.nativeEvent.scale);
    console.log("hola");
  });

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PinchGestureHandler
          onGestureEvent={handleZoomEvent.current}
          onHandlerStateChange={handleZoomEvent.current}>
          <ImageZoom
            cropWidth={Dimensions.get("window").width}
            cropHeight={Dimensions.get("window").height}
            imageWidth={1200}
            imageHeight={1250}
            onZoom={() => console.log("onZoom")}
            enableSwipeDown={false}
            panToMove={true}
            pinchToZoomInSensitivity={1}
            pinchToZoomOutSensitivity={3}
            doubleClickToZoomOut={false}
            minScale={1.2}
            maxScale={5} // Puedes ajustar esto según tus necesidades
            centerOn={{ x: 10, y: 0, scale: 1.2 }}
            maxOverflow={0} // Limita el desbordamiento de la imagen
          >
            <Image
              source={require("../assets/images/mapa_png.png")}
              style={{
                flex: 1,
                width: undefined,
                height: undefined,
                alignSelf: "stretch",
              }}
              resizeMode="contain"
            />
            <Svg style={styles.svg}>
              <Path
                d="M50 100 L70 40 L2 40"
                fill="none"
                stroke="red"
                strokeWidth="3"
              />
            </Svg>
          </ImageZoom>
        </PinchGestureHandler>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  svg: {
    ...StyleSheet.absoluteFillObject,
  },

});

