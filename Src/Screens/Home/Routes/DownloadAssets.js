import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { supabase } from "../../../Api/lib/supabase";
import * as FileSystem from "expo-file-system";
import LottieView from "lottie-react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCloudDownloadAlt,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export const DownloadAssets = ({ onClose, onViewDownload }) => {
  const [showModal, setShowModal] = useState(false);
  const [filesExist, setFilesExist] = useState(false);

  useEffect(() => {
    checkExistingFiles();
  }, []);

  const checkExistingFiles = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("route_images")
        .list("nuevas");

      if (error) throw error;

      const fileInfoPromises = data
        .filter((file) => file.name.endsWith(".webp"))
        .map(async (file) => {
          const localUri = `${FileSystem.documentDirectory}${file.name}`;
          const fileExists = await FileSystem.getInfoAsync(localUri);
          return fileExists.exists;
        });

      const fileExistsResults = await Promise.all(fileInfoPromises);
      const allFilesExist = fileExistsResults.every((exists) => exists);

      setFilesExist(allFilesExist);
      setShowModal(!allFilesExist);
      if (allFilesExist) {
        onDownloadComplete(); // Notifica que ya están descargados
      }
    } catch (error) {
      console.error("Error checking existing files:", error);
      setShowModal(true);
    }
  };

  if (filesExist) {
    return null;
  }
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showModal}
      onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <LottieView
            source={require("../../../assets/animations/Archivo.json")}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
          <Text style={styles.title}>Archivos Necesarios</Text>
          <Text style={styles.description}>
            Para usar la aplicación sin conexión, es necesario descargar algunos
            archivos.
          </Text>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={onViewDownload}>
            <FontAwesomeIcon
              icon={faCloudDownloadAlt}
              size={24}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Ver Descarga</Text>
            <FontAwesomeIcon
              icon={faArrowRight}
              size={24}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
    maxWidth: 400,
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0033A0",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0033A0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginBottom: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 12,
  },
  buttonIcon: {
    marginHorizontal: 8,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: "#0033A0",
    fontSize: 16,
    fontWeight: "600",
  },
});

