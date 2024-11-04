import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faRadio,
  faMusic,
  faPlayCircle,
  faGlobe,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import staticJsonData from "../../../json/radio_cucei.json";

export const CUCEI_radio = () => {
  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <LinearGradient colors={["#0056b3", "#007bff"]} style={styles.header}>
        <FontAwesomeIcon icon={faRadio} size={40} color="white" />
        <Text style={styles.headerTitle}>
          {staticJsonData["section-description"].name}
        </Text>
      </LinearGradient>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.descriptionText}>
            {staticJsonData["section-description"].description}
          </Text>
        </View>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <FontAwesomeIcon icon={faMusic} size={20} color="#0b34b0" style={styles.icon} />
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Género:</Text> {staticJsonData.genero}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesomeIcon icon={faGlobe} size={20} color="#0b34b0" style={styles.icon} />
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Idioma:</Text> {staticJsonData.idioma}
            </Text> 
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              openLink("http://radio.cucei.udg.mx/reproductor.html")
            }>
            <FontAwesomeIcon
              icon={faPlayCircle}
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Escuchar Radio CUCEI</Text>
          </TouchableOpacity>
        </View>
        {staticJsonData["listed-elements"] && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Información Adicional</Text>
            {Object.entries(staticJsonData["listed-elements"]).map(
              ([key, value]) => (
                <View key={key} style={styles.infoRow}>
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    size={20}
                    color="#0b34b0"
                    style={styles.icon}
                  />
                  <Text style={styles.infoText}>{value}</Text>
                </View>
              )
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  descriptionText: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
    marginTop: 3,
  },
  infoText: {
    fontSize: 16,
    color: "#333333",
    flex: 1,
  },
  bold: {
    fontWeight: "bold",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b34b0",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0b34b0",
    marginBottom: 15,
  },
});

export default CUCEI_radio;
