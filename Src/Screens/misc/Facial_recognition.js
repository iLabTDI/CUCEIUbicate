import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";



export const Facial_recognition = () =>{
    return(
        <View style={styles.container}>
            <Text>Facial_recognition</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});