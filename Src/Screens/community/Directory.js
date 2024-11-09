import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBuilding,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { LinearGradient } from "expo-linear-gradient";
import staticJsonData from "../../../json/contact_info.json";
import { ContactImage } from "../../../json/contact_images";

export const Directory = () => {
  const [jsonData, setJsonData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setJsonData(staticJsonData);
      setLoading(false);
    }, 2000);
  }, []);

  const getImageSource = (imageName) => {
    if (ContactImage.hasOwnProperty(imageName)) {
      return ContactImage[imageName];
    } else {
      return require("../../../json/contact_info/noasignado.jpg");
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      setJsonData(staticJsonData);
      setRefreshing(false);
      setLoading(false);
    }, 2000);
  }, []);

  const openEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const openPhone = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.Cargando}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <LinearGradient colors={["#0056b3", "#007bff"]} style={styles.header}>
        <FontAwesomeIcon icon={faUser} size={24} color="#fff" />
        <Text style={styles.headerTitle}>Directorio</Text>
      </LinearGradient>
      <View style={styles.content}>
        {jsonData.map((contact, index) => (
          <View key={index} style={styles.card}>
            <LinearGradient
              colors={["#0b34b0", "#0056b3"]}
              style={styles.cardHeader}>
              <Image
                source={getImageSource(contact.imagen)}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.headerText}>
                <Text style={styles.name}>{contact.nombre}</Text>
                <Text style={styles.position}>{contact.puesto}</Text>
              </View>
            </LinearGradient>
            <View style={styles.cardBody}>
              <View style={styles.infoRow}>
                <FontAwesomeIcon icon={faBuilding} style={styles.icon} />
                <Text style={styles.infoText}>{contact.departamento}</Text>
              </View>
              <View style={styles.infoRow}>
                <FontAwesomeIcon icon={faMapMarkerAlt} style={styles.icon} />
                <Text style={styles.infoText}>{contact.direccion}</Text>
              </View>
              <TouchableOpacity
                style={styles.infoRow}
                onPress={() => openPhone(contact.conmutador)}>
                <FontAwesomeIcon icon={faPhone} style={styles.icon} />
                <Text style={[styles.infoText, styles.linkText]}>
                  {contact.conmutador}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.infoRow}
                onPress={() => openEmail(contact.correo_electronico)}>
                <FontAwesomeIcon icon={faEnvelope} style={styles.icon} />
                <Text style={[styles.infoText, styles.linkText]}>
                  {contact.correo_electronico}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  Cargando: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    marginTop: 10,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  position: {
    fontSize: 14,
    color: "#e0e0e0",
    marginTop: 4,
  },
  cardBody: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    color: "#0b34b0",
    marginRight: 12,
    width: 20,
    height: 20,
  },
  infoText: {
    fontSize: 16,
    color: "#333333",
    flex: 1,
  },
  linkText: {
    color: "#0b34b0",
    textDecorationLine: "underline",
  },
});

export default Directory;
