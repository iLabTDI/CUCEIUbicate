import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions"; // Importa los permisos
import { supabase } from "../../../Api/lib/supabase";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCloudDownloadAlt,
  faCheckCircle,
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export const DownloadAssets = ({ onClose }) => {
  const [showModal, setShowModal] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState("idle");

  useEffect(() => {
    if (showModal) {
      checkPermissionsAndDownload();
    }
  }, [showModal]);

  const checkPermissionsAndDownload = async () => {
    // Solicita los permisos de almacenamiento
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (status === "granted") {
      // Si los permisos son otorgados, verifica si los archivos ya existen
      checkExistingFiles();
    } else {
      setDownloadStatus("error");
      console.error("Permiso denegado para acceder al almacenamiento.");
    }
  };

  const checkExistingFiles = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );
      const webpFiles = files.filter((file) => file.endsWith(".webp"));
      if (webpFiles.length > 0) {
        setDownloadStatus("completed");
      }
    } catch (error) {
      console.error("Error checking existing files:", error);
    }
  };

  const downloadImages = async () => {
    setDownloadStatus("downloading");
    try {
      const { data, error } = await supabase.storage
        .from("route_images")
        .list("route_Images");

      if (error) throw error;

      const totalFiles = data.filter((file) =>
        file.name.endsWith(".webp")
      ).length;
      let downloadedFiles = 0;

      for (const file of data) {
        if (file.name.endsWith(".webp")) {
          const { data: imageData, error: downloadError } =
            await supabase.storage
              .from("route_images")
              .download(`route_Images/${file.name}`);

          if (downloadError) throw downloadError;

          const reader = new FileReader();
          reader.onload = async () => {
            const base64String = reader.result.split(",")[1];
            const localUri = `${FileSystem.documentDirectory}${file.name}`;

            try {
              await FileSystem.writeAsStringAsync(localUri, base64String, {
                encoding: FileSystem.EncodingType.Base64,
              });
              console.log(`Imagen descargada y guardada en: ${localUri}`);
              downloadedFiles++;
              setDownloadProgress((downloadedFiles / totalFiles) * 100);
            } catch (writeError) {
              console.error(
                "Error al guardar la imagen localmente:",
                writeError
              );
              throw writeError;
            }
          };
          reader.readAsDataURL(imageData);
        }
      }

      setDownloadStatus("completed");
    } catch (err) {
      console.error("Error al descargar imágenes:", err);
      setDownloadStatus("error");
    }
  };

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  const renderModalContent = () => {
    switch (downloadStatus) {
      case "idle":
        return (
          <>
            <FontAwesomeIcon
              icon={faCloudDownloadAlt}
              size={50}
              color="#0056b3"
            />
            <Text style={styles.modalTitle}>Descargar Archivos</Text>
            <Text style={styles.modalText}>
              Es necesario descargar los archivos para usar la aplicación sin
              conexión.
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={downloadImages}>
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                Descargar
              </Text>
            </TouchableOpacity>
          </>
        );
      case "downloading":
        return (
          <>
            <LottieView
              source={require("../../../assets/animations/Archivo.json")}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
            <Text style={styles.modalTitle}>Descargando Archivos</Text>
            <Text style={styles.modalText}>{`Progreso: ${Math.round(
              downloadProgress
            )}%`}</Text>
            <View style={styles.progressBarContainer}>
              <LinearGradient
                colors={["#0056b3", "#007bff"]}
                style={[styles.progressBar, { width: `${downloadProgress}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <FontAwesomeIcon icon={faTimes} size={24} color="#333" />
            </TouchableOpacity>
          </>
        );
      case "completed":
        return (
          <>
            <FontAwesomeIcon icon={faCheckCircle} size={50} color="#28a745" />
            <Text style={styles.modalTitle}>Descarga Completada</Text>
            <Text style={styles.modalText}>
              Todos los archivos han sido descargados exitosamente.
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleClose}>
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </>
        );
      case "error":
        return (
          <>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              size={50}
              color="#dc3545"
            />
            <Text style={styles.modalTitle}>Error en la Descarga</Text>
            <Text style={styles.modalText}>
              Ha ocurrido un error al descargar los archivos. Por favor,
              inténtelo de nuevo más tarde.
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleClose}>
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </>
        );
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showModal}
      onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>{renderModalContent()}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#f8f9fa",
    width: "40%",
  },
  buttonText: {
    color: "#0056b3",
    fontWeight: "bold",
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#0056b3",
  },
  primaryButtonText: {
    color: "white",
  },
  progressBarContainer: {
    height: 10,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginBottom: 15,
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
});
