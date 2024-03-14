import React, { useRef } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const BottomSheetComponent = () => {
    const bottomSheetRef = useRef(null);
    const snapPoints = ["40%", "60%"];

    const handleOpen = () => {
        if (bottomSheetRef.current) {
            bottomSheetRef.current.expand(); // Cambia a expand() para abrir el BottomSheet
        }
    };

    const handleClose = () => {
        if (bottomSheetRef.current) {
            bottomSheetRef.current.close(); // Cambia a close() para cerrar el BottomSheet
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Button title="Open Bottom Sheet" onPress={handleOpen} />

                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                >
                    <BottomSheetScrollView contentContainerStyle={styles.content}>
                        <View style={styles.bottomSheetContent}>
                            <Text>Modulos</Text>
                            <Image></Image>
                            <Button title="Cerrar" onPress={handleClose} />
                        </View>
                    </BottomSheetScrollView>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "gray",
    },
    content: {
        alignItems: "center",
        padding: 20,
    },
    bottomSheetContent: {
        alignItems: "center",
        padding: 20,
    },
});
