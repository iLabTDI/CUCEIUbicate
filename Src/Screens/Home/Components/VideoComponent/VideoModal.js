import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
  Animated,
  Alert,
} from "react-native";
import { Video } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTimes,
  faVideoSlash,
  faExclamationTriangle,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
// Importa el objeto exportado con nombre
import { routeVideos } from "./Videos_data";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

export const VideoModal = ({ isVisible, onClose, videoUri, routeId }) => {
  const [localVideoUri, setLocalVideoUri] = useState(videoUri);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cachedUri, setCachedUri] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Solicitar permiso para acceder a MediaLibrary
  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setMediaLibraryPermission(status);
      // Se puede comentar o eliminar este log
      // console.log("Permiso MediaLibrary:", status);
    };
    requestPermission();
  }, []);

  // Si se pasa un videoUri por props, actualízalo
  useEffect(() => {
    setLocalVideoUri(videoUri);
  }, [videoUri]);

  // Cada vez que cambie el routeId, reiniciamos los estados y buscamos el video correspondiente
  useEffect(() => {
    if (routeId) {
      setLocalVideoUri(null);
      setCachedUri(null);
      setIsLoading(true);
      setError(false);
      setProgress(0);
      fetchVideoFromJson();
    }
  }, [routeId]);

  const fetchVideoFromJson = () => {
    try {
      // console.log("routeId:", routeId, "routeVideos:", routeVideos);
      let videoUriFromData = routeVideos[routeId];
      if (!videoUriFromData) {
        // Si no se encontró, intentamos invertir el orden
        const parts = routeId.split(" - ");
        if (parts.length === 2) {
          const reversedKey = `${parts[1].trim()} - ${parts[0].trim()}`;
          // console.log("Intentando con clave invertida:", reversedKey);
          videoUriFromData = routeVideos[reversedKey];
        }
      }
      if (videoUriFromData) {
        setLocalVideoUri(videoUriFromData);
      } else {
        // No se encontró video: se muestra el error en el modal
        setError(true);
      }
    } catch (err) {
      // No se muestra el error en consola
      setError(true);
    }
  };

  // Cuando el modal se muestra, inicia la animación y descarga el video
  useEffect(() => {
    if (isVisible) {
      setIsLoading(true);
      setError(false);
      setProgress(0);
      setCachedUri(null);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      if (localVideoUri) {
        // console.log("Iniciando descarga del video desde:", localVideoUri);
        cacheVideo(localVideoUri);
      } else {
        setIsLoading(false);
      }
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, localVideoUri]);

  // Se utiliza el routeId para formar un nombre único de archivo en caché
  const getSanitizedRouteId = (id) => (id ? id.replace(/\s+/g, "_") : "default");

  const cacheVideo = async (uri) => {
    setIsLoading(true);
    setError(false);
    setProgress(0);

    const sanitizedRouteId = getSanitizedRouteId(routeId);
    const fileUri = `${FileSystem.cacheDirectory}video_${sanitizedRouteId}.mp4`;
    // console.log("Ruta de cache:", fileUri);

    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        // console.log("Video ya existe en cache para la ruta:", routeId);
        setCachedUri(fileUri);
        setIsLoading(false);
        setProgress(100);
      } else {
        const downloadResumable = FileSystem.createDownloadResumable(
          uri,
          fileUri,
          {},
          (downloadProgress) => {
            const progressPercent =
              (downloadProgress.totalBytesWritten /
                downloadProgress.totalBytesExpectedToWrite) *
              100;
            setProgress(progressPercent);
          }
        );
        const { uri: downloadedUri } = await downloadResumable.downloadAsync();
        // console.log("Video descargado en:", downloadedUri);
        setCachedUri(downloadedUri);
        setIsLoading(false);
        setProgress(100);
      }
    } catch (e) {
      // No se imprime el error en consola
      setError(true);
      setIsLoading(false);
    }
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setError(true);
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleDownloadRequest = () => {
    Alert.alert("Descargar Video", "¿Quieres descargar este video?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Descargar", onPress: () => handleDownload() },
    ]);
  };

  const handleDownload = async () => {
    if (cachedUri) {
      try {
        setIsDownloading(true);
        let permission = mediaLibraryPermission;
        if (permission !== "granted") {
          const { status } = await MediaLibrary.requestPermissionsAsync();
          permission = status;
          setMediaLibraryPermission(status);
        }
        if (permission !== "granted") {
          Alert.alert(
            "Permiso denegado",
            "No se han otorgado permisos para guardar el video."
          );
          setIsDownloading(false);
          return;
        }
        const asset = await MediaLibrary.createAssetAsync(cachedUri);
        await MediaLibrary.createAlbumAsync("MisVideos", asset, false);
        Alert.alert("Éxito", "El video se ha descargado correctamente.");
      } catch (error) {
        // No se imprime el error en consola
        Alert.alert("Error", "No se pudo descargar el video.");
      } finally {
        setIsDownloading(false);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1} />
      <Animated.View style={[styles.modal, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <FontAwesomeIcon icon={faTimes} size={isTablet ? 32 : 24} color="#FFFFFF" />
        </TouchableOpacity>

        {localVideoUri ? (
          <>
            {isLoading && !error && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size={isTablet ? "large" : "small"} color="#FFFFFF" />
                <Text style={styles.loadingText}>Cargando video...</Text>
                <View style={styles.progressBarContainer}>
                  <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{`${Math.round(progress)}%`}</Text>
              </View>
            )}

            {error && (
              <View style={styles.errorContainer}>
                <FontAwesomeIcon icon={faVideoSlash} size={isTablet ? 70 : 50} color="#FFFFFF" />
                <Text style={styles.errorText}>
                  No se pudo cargar el video. Inténtalo más tarde.
                </Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => cacheVideo(localVideoUri)}>
                  <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            )}

            {!error && cachedUri && (
              <View style={styles.videoContainer}>
                <Video
                  source={{ uri: cachedUri }}
                  style={styles.video}
                  useNativeControls
                  resizeMode="contain"
                  onError={handleVideoError}
                  onLoad={handleVideoLoad}
                  shouldPlay
                />
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={handleDownloadRequest}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faDownload} size={isTablet ? 24 : 18} color="#FFFFFF" />
                      <Text style={styles.downloadButtonText}>Descargar video</Text>
                    </>
                  )}
                </TouchableOpacity>
                {mediaLibraryPermission !== "granted" && (
                  <Text style={styles.permissionText}>
                    Permiso para guardar video no otorgado.
                  </Text>
                )}
              </View>
            )}
          </>
        ) : (
          <View style={styles.noVideoContainer}>
            <FontAwesomeIcon icon={faExclamationTriangle} size={isTablet ? 70 : 50} color="#FFFF00" />
            <Text style={styles.noVideoText}>
              Video no disponible para esta ruta.
            </Text>
            <Text style={styles.noVideoSubText}>
              Estamos trabajando para agregar más videos. ¡Vuelve a consultar en futuras actualizaciones!
            </Text>
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modal: {
    width: isTablet ? width * 0.7 : width * 0.9,
    height: isTablet ? height * 0.7 : height * 0.7,
    backgroundColor: "#0b34b0",
    borderRadius: isTablet ? 30 : 20,
    overflow: "hidden",
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: isTablet ? 20 : 10,
    right: isTablet ? 20 : 10,
    zIndex: 3,
    padding: isTablet ? 15 : 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: isTablet ? 30 : 20,
  },
  videoContainer: {
    flex: 1,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: isTablet ? 30 : 20,
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: isTablet ? 30 : 20,
    fontSize: isTablet ? 24 : 18,
    fontWeight: "bold",
  },
  progressBarContainer: {
    width: isTablet ? "70%" : "80%",
    height: isTablet ? 8 : 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: isTablet ? 4 : 3,
    marginTop: isTablet ? 30 : 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  progressText: {
    color: "#FFFFFF",
    marginTop: isTablet ? 15 : 10,
    fontSize: isTablet ? 20 : 16,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: isTablet ? 30 : 20,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: isTablet ? 24 : 18,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: isTablet ? 30 : 20,
  },
  retryButton: {
    marginTop: isTablet ? 30 : 20,
    paddingVertical: isTablet ? 15 : 10,
    paddingHorizontal: isTablet ? 30 : 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: isTablet ? 30 : 20,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: isTablet ? 20 : 16,
    fontWeight: "bold",
  },
  noVideoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: isTablet ? 20 : 20,
  },
  noVideoText: {
    color: "#FFFFFF",
    fontSize: isTablet ? 32 : 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: isTablet ? 30 : 20,
  },
  noVideoSubText: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: isTablet ? 30 : 20,
    fontStyle: "italic",
    opacity: 0.7,
    fontSize: isTablet ? 20 : 16,
  },
  downloadButton: {
    position: "absolute",
    bottom: isTablet ? 30 : 20,
    right: isTablet ? 30 : 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: isTablet ? 12 : 8,
    paddingHorizontal: isTablet ? 20 : 15,
    borderRadius: isTablet ? 25 : 20,
  },
  downloadButtonText: {
    color: "#FFFFFF",
    marginLeft: 10,
    fontSize: isTablet ? 24 : 18,
    fontWeight: "bold",
  },
  permissionText: {
    color: "#FFFFFF",
    fontSize: isTablet ? 18 : 14,
    marginTop: 10,
    textAlign: "center",
  },
});

export default VideoModal;
