import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";



export const Notifications = () =>{
    return(
        <View style={styles.container}>
            <Text>Notifications</Text>
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
