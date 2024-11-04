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

export const Scholarships = () => {
  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("A ocurrido un error", err)
    );
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#0056b3", "#007bff"]} style={styles.header}>
        <FontAwesomeIcon icon={faGraduationCap} size={40} color="white" />
        <Text style={styles.headerText}>Becas Disponibles</Text>
      </LinearGradient>
      {staticScholarshipsData.length > 0 ? (
        staticScholarshipsData.map((scholarship, index) => (
          <View key={index} style={styles.card}>
              <Text style={styles.title}>{scholarship.convocatoria}</Text>
              <View style={styles.infoRow}>
                <FontAwesomeIcon
                  icon={faUsers}
                  size={16}
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
                  size={16}
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
                  size={16}
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
                onPress={() => openLink(scholarship.hipervinculo)}>
                <Text style={styles.linkButtonText}>Más información</Text>
                <FontAwesomeIcon
                  icon={faExternalLinkAlt}
                  size={16}
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
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    padding: 30,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0b34b0",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
    marginTop: 3,
  },
  text: {
    fontSize: 16,
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
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  linkButtonText: {
    color: "white",
    fontSize: 16,
    marginRight: 8,
  },
  noDataText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});

export default Scholarships;
