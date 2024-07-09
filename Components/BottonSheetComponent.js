import React, { useRef, useCallback, useEffect } from "react";
import { View, Image, StyleSheet, Dimensions, Text } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const bottomSheetContents = [
  {
    id: "Modulo X",
    imageSource: require("../assets/images/Modulos/Modulo_X.jpeg"),
  },
  { id: "Modulo Z", imageSource: require("../assets/images/cucei.png") },
  // Agrega más contenido aquí si es necesario
];

export const BottomSheetComponent = React.forwardRef(
  ({ snapPoints, selectedPoint, isVisible, onClose }, ref) => {
    const bottomSheetRef = useRef(null);

    useEffect(() => {
      if (ref) {
        ref.current = {
          expand: () => bottomSheetRef.current?.expand(),
          close: () => bottomSheetRef.current?.close(),
        };
      }
    }, [ref]);

    useEffect(() => {
      if (isVisible) {
        bottomSheetRef.current?.expand();
      } else {
        bottomSheetRef.current?.close();
      }
    }, [isVisible]);

    const handleSheetChanges = useCallback(
      (index) => {
        if (index === -1 || index === 0) {
          onClose();
        }
      },
      [onClose]
    );

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <BottomSheetScrollView
          contentContainerStyle={styles.bottomSheetContent}>
          {bottomSheetContents.map(
            (content) =>
              selectedPoint === content.id && (
                <View key={content.id} style={styles.imageContainer}>
                  <>
                    <Image
                      source={content.imageSource}
                      style={styles.bottomSheetImage}
                      resizeMode="contain"
                    />
                  </>
                </View>
              )
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bottomSheetContent: {
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    width: Dimensions.get("window").width - 20,
    padding: 10,
  },
  bottomSheetImage: {
    width: Dimensions.get("window").width - 30,
    height: 250,
  },
});

export default BottomSheetComponent;
