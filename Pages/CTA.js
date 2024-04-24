import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";



export const CTA = () =>{
    return(
        <View style={styles.container}>
            <Text>CTA</Text>
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