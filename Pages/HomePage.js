// import React from "react";
// import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
// import { PinchGestureHandler } from "react-native-gesture-handler";
// import ImageZoom from "react-native-image-pan-zoom";
// import { Dimensions } from "react-native";
// import Svg, { Path } from "react-native-svg";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

// export const HomePage = () => {
//   const handleZoomEvent = React.useRef((event) => {
//     console.log("Zoom Scale:", event.nativeEvent.scale);
//     console.log("hola");
//   });

//   return (
//     <View style={styles.container}>
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <PinchGestureHandler
//           onGestureEvent={handleZoomEvent.current}
//           onHandlerStateChange={handleZoomEvent.current}>
//           <ImageZoom
//             cropWidth={Dimensions.get("window").width}
//             cropHeight={Dimensions.get("window").height}
//             imageWidth={700}
//             imageHeight={950}
//             onZoom={() => console.log("onZoom")}
//             enableSwipeDown={false}
//             panToMove={true}
//             pinchToZoomInSensitivity={1}
//             pinchToZoomOutSensitivity={3}
//             doubleClickToZoomOut={false}
//             minScale={1.2}
//             maxScale={3} // Puedes ajustar esto según tus necesidades
//             centerOn={{ x: 10, y: 0, scale: 1.2 }}
//             maxOverflow={0} // Limita el desbordamiento de la imagen
//           >
//             <Image
//               source={require("../assets/images/Mapa.png")}
//               style={{
//                 flex: 1,
//                 width: undefined,
//                 height: undefined,
//                 alignSelf: "stretch",
//               }}
//               resizeMode="contain"
//             />
//             <Svg style={styles.svg}>
//               <Path
//                 d="M50 100 L70 40 L2 40"
//                 fill="none"
//                 stroke="red"
//                 strokeWidth="3"
//               />
//             </Svg>
//           </ImageZoom>
//         </PinchGestureHandler>
//       </GestureHandlerRootView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   svg: {
//     ...StyleSheet.absoluteFillObject,
//   },

// });

import React, { useState } from 'react';
import { Dimensions, View, StyleSheet, Image} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import Svg, { Polyline } from 'react-native-svg';

export const HomePage = () => {
  const [points, setPoints] = useState([]);
  const [dragging, setDragging] = useState(false);

  const handleTouch = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    if (event.nativeEvent.state === State.ACTIVE) {
      setDragging(true);
      setPoints([...points, { x: locationX, y: locationY }]);
    } else if (event.nativeEvent.state === State.END) {
      setDragging(false);
    }
  };

  const handleDrag = (event) => {
    const { translationX, translationY } = event.nativeEvent;
    if (dragging && points.length > 0) {
      const lastPoint = points[points.length - 1];
      const newPoint = { x: lastPoint.x + translationX, y: lastPoint.y + translationY };
      setPoints([...points, newPoint]);
    }
  };

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PanGestureHandler onGestureEvent={handleDrag}>
          <View style={{ flex: 1 }}>
            <Svg style={styles.svg}>
              <Polyline
                points={points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="red"
                strokeWidth="3"
              />
            </Svg>
          </View>
        </PanGestureHandler>
        <PanGestureHandler onGestureEvent={handleTouch}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/images/Mapa.png")}
              style={{
                flex: 1,
                width: undefined,
                height: undefined,
                alignSelf: "stretch",
              }}
              resizeMode="contain"
            />
          </View>
        </PanGestureHandler>
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
  imageContainer: {
    flex: 1,
    position: 'absolute',
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
