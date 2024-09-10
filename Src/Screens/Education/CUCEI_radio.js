import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getJsons } from "../../Api/fetchJsons";


export const CUCEI_radio = () =>{
    /*
    const url = 'url-a-la-api-correspondiente';
    const [data, setData] = useState([]);

    useEffect(() => {
        getJsons().then(result => {
          setData(result);
        });
      }, []);
      */
    return(
        <View style={styles.container}>
            <Text>CUCEI_radio</Text>
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