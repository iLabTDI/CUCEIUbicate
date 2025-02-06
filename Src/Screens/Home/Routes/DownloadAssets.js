import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Platform 
} from "react-native";
import LottieView from "lottie-react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCloudDownloadAlt, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const { width, height } = Dimensions.get("window");

export const DownloadAssets = ({ onClose, onViewDownload, visible }) => {
  // Si visible es false, no renderizamos nada
  if (!visible) return null;

  return (
    <View style={styles.modalWrapper}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LottieView
              source={require("../../../assets/animations/Archivo2.json")}
              autoPlay={true}
              loop={true}
              style={styles.lottieAnimation}
            />
            <Text style={styles.title}>Archivos Necesarios</Text>
            <Text style={styles.description}>
              Para usar la aplicación sin conexión, es necesario descargar algunos archivos.
            </Text>
            <TouchableOpacity style={styles.downloadButton} onPress={onViewDownload}>
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
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Este wrapper se posiciona de forma absoluta sobre toda la pantalla
  modalWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 9999, // Asegura que se muestre sobre otros elementos
  },
  // Fondo semitransparente
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Contenedor del modal
  modalContainer: {
    width: "80%",
    maxWidth: 400,
    height: "50%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  // Contenido interno del modal
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  lottieAnimation: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0033A0",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
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
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  buttonIcon: {
    marginHorizontal: 4,
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
