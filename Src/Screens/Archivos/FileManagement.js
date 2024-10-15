import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import { supabase } from "../../Api/lib/supabase";
import * as FileSystem from "expo-file-system";
import * as Network from "expo-network";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCloudDownloadAlt,
  faTrashAlt,
  faCheckCircle,
  faExclamationTriangle,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";

export const FileManagement = ({ route, navigation }) => {
  // Estados para manejar la información de los archivos y el proceso de descarga
  const [files, setFiles] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState("idle");
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  // Parámetro para iniciar la descarga automáticamente
  const { startDownloadAutomatically = true } = route.params || {};

  // Función para verificar la conexión de red
  const checkNetworkConnection = useCallback(async () => {
    const networkStatus = await Network.getNetworkStateAsync();
    setIsConnected(networkStatus.isConnected);
    return networkStatus.isConnected;
  }, []);

  // Función para obtener la lista de archivos
  const fetchFileList = useCallback(async () => {
    setIsLoading(true);
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
          return {
            name: file.name,
            size: file.metadata.size,
            downloaded: fileExists.exists,
          };
        });

      const fileInfos = await Promise.all(fileInfoPromises);
      setFiles(fileInfos);
      setTotalSize(fileInfos.reduce((acc, file) => acc + file.size, 0));
      console.log("Lista de archivos obtenida:", fileInfos);
    } catch (error) {
      console.error("Error al obtener la lista de archivos:", error);
      Alert.alert(
        "Error",
        "No se pudieron obtener los archivos. Intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para descargar los archivos
  const downloadFiles = useCallback(async () => {
    if (!isConnected) {
      Alert.alert(
        "Error",
        "No hay conexión a internet. Por favor, intenta nuevamente."
      );
      return;
    }

    setDownloadStatus("downloading");
    let downloadedSize = 0;

    try {
      const downloadPromises = files.map(async (file) => {
        if (!file.downloaded) {
          console.log(`Iniciando descarga de: ${file.name}`);
          const { data, error } = await supabase.storage
            .from("route_images")
            .download(`nuevas/${file.name}`);

          if (error) throw error;

          if (!data) {
            throw new Error(`No se pudo obtener el archivo: ${file.name}`);
          }

          const localUri = `${FileSystem.documentDirectory}${file.name}`;

          // Convertir el Blob a una cadena base64
          const reader = new FileReader();
          reader.readAsDataURL(data);
          const base64data = await new Promise((resolve) => {
            reader.onloadend = () => {
              resolve(reader.result.split(",")[1]);
            };
          });

          // Escribir los datos base64 en el archivo
          await FileSystem.writeAsStringAsync(localUri, base64data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          downloadedSize += file.size;
          const progress = Math.min((downloadedSize / totalSize) * 100);
          setDownloadProgress(progress);
          console.log(`Archivo descargado: ${file.name}, Progreso: ${progress.toFixed(2)}%`);

          return { ...file, downloaded: true };
        }
        return file;
      });

      const updatedFiles = await Promise.all(downloadPromises);
      setFiles(updatedFiles);

      setDownloadStatus("completed");
      console.log("Todos los archivos se han descargado correctamente");
      Alert.alert(
        "Éxito",
        "Todos los archivos se han descargado correctamente."
      );
    } catch (error) {
      console.error("Error al descargar archivos:", error);
      setDownloadStatus("error");
      Alert.alert(
        "Error",
        "Ocurrió un error durante la descarga. Intenta nuevamente."
      );
    }
  }, [files, isConnected, totalSize]);

  // Efecto para inicializar el componente
  useEffect(() => {
    const initializeComponent = async () => {
      const isNetworkConnected = await checkNetworkConnection();
      if (isNetworkConnected) {
        await fetchFileList();
      } else {
        Alert.alert(
          "Error de conexión",
          "No hay conexión a internet. Por favor, verifica tu conexión e intenta nuevamente."
        );
      }
    };

    initializeComponent();
  }, [checkNetworkConnection, fetchFileList]);

  // Efecto para iniciar la descarga automática si es necesario
  useEffect(() => {
    if (
      files.length > 0 &&
      !files.every((f) => f.downloaded) &&
      startDownloadAutomatically
    ) {
      downloadFiles();
    } else if (files.every((f) => f.downloaded)) {
      setDownloadStatus("completed");
      setDownloadProgress(100);
    }
  }, [files, startDownloadAutomatically, downloadFiles]);

  // Función para eliminar archivos
  const deleteFiles = async () => {
    try {
      for (const file of files) {
        const localUri = `${FileSystem.documentDirectory}${file.name}`;
        await FileSystem.deleteAsync(localUri, { idempotent: true });
        console.log(`Archivo eliminado: ${file.name}`);
      }
      await fetchFileList();
      setDownloadProgress(0);
      setDownloadStatus("idle");
      console.log("Todos los archivos han sido eliminados");
      Alert.alert("Éxito", "Todos los archivos han sido eliminados.");
    } catch (error) {
      console.error("Error al eliminar archivos:", error);
      Alert.alert(
        "Error",
        "Ocurrió un error al eliminar los archivos. Intenta nuevamente."
      );
    }
  };

  // Función para formatear el tamaño de los archivos
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Gestión de Archivos</Text>
          <Text style={styles.description}>
            Descarga y elimina archivos de rutas
          </Text>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#0033A0"
              style={styles.loader}
            />
          ) : (
            <>
              <View style={styles.fileInfoContainer}>
                <View style={styles.fileIconContainer}>
                  <FontAwesomeIcon icon={faFolder} size={40} color="#0033A0" />
                  <Text style={styles.fileCount}>{files.length} archivos</Text>
                </View>
                <View style={styles.fileSizeContainer}>
                  <Text style={styles.totalSizeLabel}>Tamaño total:</Text>
                  <Text style={styles.totalSizeValue}>
                    {formatSize(totalSize)}
                  </Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${downloadProgress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {downloadStatus === "downloading"
                    ? `${Math.round(downloadProgress)}%`
                    : downloadStatus === "completed"
                    ? "Archivos Descargados"
                    : "Listo para descargar"}
                </Text>
              </View>

              {downloadStatus === "completed" && (
                <View style={styles.statusContainer}>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    color="#4CAF50"
                    size={24}
                  />
                  <Text style={[styles.statusText, { color: "#4CAF50" }]}>
                    Todos los archivos están descargados
                  </Text>
                </View>
              )}

              {downloadStatus === "error" && (
                <View style={styles.statusContainer}>
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    color="#FF5252"
                    size={24}
                  />
                  <Text style={styles.statusText}>
                    Error en la descarga. Intente nuevamente.
                  </Text>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.downloadButton,
                    (downloadStatus === 'downloading' || files.every(f => f.downloaded)) && styles.disabledButton
                  ]}
                  onPress={downloadFiles}
                  disabled={downloadStatus === 'downloading' || files.every(f => f.downloaded)}
                >
                  <FontAwesomeIcon icon={faCloudDownloadAlt} color="#FFFFFF" size={20} style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Descargar</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  style={[
                    styles.button,
                    styles.deleteButton,
                    files.every(f => !f.downloaded) && styles.disabledButton
                  ]}
                  onPress={deleteFiles}
                  disabled={files.every(f => !f.downloaded)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} color="#FFFFFF" size={20} style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity> */}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    padding: 16,
    paddingTop: 32,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0033A0",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  loader: {
    marginVertical: 20,
  },
  fileInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#F0F4F8",
    borderRadius: 12,
    padding: 16,
  },
  fileIconContainer: {
    alignItems: "center",
  },
  fileCount: {
    marginTop: 8,
    fontSize: 16,
    color: "#0033A0",
    fontWeight: "bold",
  },
  fileSizeContainer: {
    alignItems: "flex-end",
  },
  totalSizeLabel: {
    fontSize: 14,
    color: "#666",
  },
  totalSizeValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0033A0",
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 6,
  },
  progressText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#0033A0",
    textAlign: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
  },
  statusText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  buttonContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems:  "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    width: "100%",
  },
  downloadButton: {
    backgroundColor: "#0033A0",
  },
  deleteButton: {
    backgroundColor: "#FF5252",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});