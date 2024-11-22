import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
  Animated,
} from "react-native";
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes, faVideoSlash, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

export const VideoModal = ({ isVisible, onClose, videoUri, routeId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cachedUri, setCachedUri] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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

      if (videoUri) {
        cacheVideo(videoUri);
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
  }, [isVisible, videoUri]);

  const cacheVideo = async (uri) => {
    setIsLoading(true);
    setError(false);
    setProgress(0);

    const fileUri = `${FileSystem.cacheDirectory}video_${routeId}.mp4`;
    
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      
      if (fileInfo.exists) {
        setCachedUri(fileUri);
        setIsLoading(false);
        setProgress(100);
      } else {
        const downloadResumable = FileSystem.createDownloadResumable(
          uri,
          fileUri,
          {},
          (downloadProgress) => {
            const progress = (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100;
            setProgress(progress);
          }
        );

        const { uri: downloadedUri } = await downloadResumable.downloadAsync();
        setCachedUri(downloadedUri);
        setIsLoading(false);
        setProgress(100);
      }
    } catch (e) {
      console.error("Error caching video:", e);
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

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1} />
      <Animated.View style={[styles.modal, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <FontAwesomeIcon icon={faTimes} size={isTablet ? 32 : 24} color="#FFFFFF" />
        </TouchableOpacity>
        
        {videoUri ? (
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
                <TouchableOpacity style={styles.retryButton} onPress={() => cacheVideo(videoUri)}>
                  <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            )}

            {!error && cachedUri && (
              <Video
                source={{ uri: cachedUri }}
                style={styles.video}
                useNativeControls
                resizeMode="contain"
                onError={handleVideoError}
                onLoad={handleVideoLoad}
                shouldPlay
              />
            )}
          </>
        ) : (
          <View style={styles.noVideoContainer}>
            <FontAwesomeIcon icon={faExclamationTriangle} size={isTablet ? 70 : 50} color="#FFFF00" />
            <Text style={styles.noVideoText}>
              Video no disponible para esta ruta
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
    width: isTablet ? '70%' : '80%',
    height: isTablet ? 8 : 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: isTablet ? 4 : 3,
    marginTop: isTablet ? 30 : 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
});

export default VideoModal;