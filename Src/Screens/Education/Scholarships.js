import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faExternalLinkAlt,
  faGraduationCap,
  faCalendarAlt,
  faUsers,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import staticScholarshipsData from "../../../json/becas_convocatorias.json";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

export const Scholarships = () => {
  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Ha ocurrido un error", err)
    );
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#0056b3", "#007bff"]} style={styles.header}>
        <FontAwesomeIcon icon={faGraduationCap} size={isTablet ? 48 : 40} color="white" />
        <Text style={styles.headerText}>Becas Disponibles</Text>
      </LinearGradient>
      {staticScholarshipsData.length > 0 ? (
        staticScholarshipsData.map((scholarship, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.title}>{scholarship.convocatoria}</Text>
            <View style={styles.infoRow}>
              <FontAwesomeIcon
                icon={faUsers}
                size={isTablet ? 20 : 16}
                color="#0b34b0"
                style={styles.icon}
              />
              <Text style={styles.text}>
                <Text style={styles.bold}>Beneficiados:</Text>{" "}
                {scholarship.beneficiados}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <FontAwesomeIcon
                icon={faCalendarAlt}
                size={isTablet ? 20 : 16}
                color="#0b34b0"
                style={styles.icon}
              />
              <Text style={styles.text}>
                <Text style={styles.bold}>Fecha:</Text> {scholarship.fecha}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <FontAwesomeIcon
                icon={faInfoCircle}
                size={isTablet ? 20 : 16}
                color="#0b34b0"
                style={styles.icon}
              />
              <Text style={styles.text}>
                <Text style={styles.bold}>Resumen:</Text>{" "}
                {scholarship.resumen}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => openLink(scholarship.hipervinculo)}
            >
              <Text style={styles.linkButtonText}>Más información</Text>
              <FontAwesomeIcon
                icon={faExternalLinkAlt}
                size={isTablet ? 20 : 16}
                color="white"
              />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>
          No se encontraron becas disponibles.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: isTablet ? 30 : 20,
    borderBottomLeftRadius: isTablet ? 30 : 20,
    borderBottomRightRadius: isTablet ? 30 : 20,
    marginBottom: isTablet ? 20 : 10,
  },
  headerText: {
    fontSize: isTablet ? 28 : 22,
    fontWeight: "bold",
    color: "white",
    marginLeft: isTablet ? 20 : 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: isTablet ? 15 : 10,
    padding: isTablet ? 40 : 30,
    borderRadius: isTablet ? 16 : 12,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: isTablet ? 15 : 10,
    shadowOffset: { width: 0, height: isTablet ? 8 : 5 },
    elevation: isTablet ? 8 : 5,
  },
  title: {
    fontSize: isTablet ? 22 : 16,
    fontWeight: "bold",
    color: "#0b34b0",
    marginBottom: isTablet ? 15 : 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: isTablet ? 12 : 8,
  },
  icon: {
    marginRight: isTablet ? 15 : 10,
    marginTop: 3,
  },
  text: {
    fontSize: isTablet ? 16 : 14,
    color: "#333",
    flex: 1,
  },
  bold: {
    fontWeight: "bold",
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b34b0",
    padding: isTablet ? 15 : 10,
    borderRadius: isTablet ? 8 : 5,
    marginTop: isTablet ? 20 : 10,
  },
  linkButtonText: {
    color: "white",
    fontSize: isTablet ? 16 : 14,
    marginRight: isTablet ? 12 : 8,
  },
  noDataText: {
    fontSize: isTablet ? 18 : 16,
    textAlign: "center",
    marginTop: isTablet ? 30 : 20,
    color: "#666",
  },
});

export default Scholarships;