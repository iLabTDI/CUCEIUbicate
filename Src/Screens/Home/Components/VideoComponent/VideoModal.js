import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions, Text, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes, faPlay, faPause, faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export const VideoModal = ({ isVisible, onClose, videoUri }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 0, friction: 5, tension: 40, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      if (!videoUri) {
        setError('El video no está disponible en este momento');
        setIsLoading(false);
      } else {
        setIsLoading(true);
        setError(null);
        if (videoRef.current) {
          videoRef.current.loadAsync(videoUri, {}, false)
            .catch(error => {
              console.error('Error al cargar el video:', error);
              setError('El video no está disponible en este momento');
              setIsLoading(false);
            });
        }
      }
    }
  }, [isVisible, videoUri]);

  const handleVideoLoad = (status) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setError(null);
    } else if (status.error) {
      setIsLoading(false);
      setError("La ruta es muy corta para mostrar un video. Por favor, selecciona una ruta más larga.");
    }
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.backgroundOverlay} />
      <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'transparent']}
          style={styles.gradientOverlay}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesomeIcon icon={faTimes} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Cargando video...</Text>
          </View>
        )}
        {error && (
          <View style={styles.errorContainer}>
            <FontAwesomeIcon icon={faVideoSlash} size={50} color="#FFFFFF" />
            <Text style={styles.errorText}>{error}</Text>
            {/* <Text style={styles.errorSubtext}>Por favor, inténtelo de nuevo más tarde.</Text> */}
          </View>
        )}
        {!error && videoUri && (
          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              source={videoUri}
              rate={1.0}
              volume={1.0}
              isMuted={true}
              resizeMode="contain"
              shouldPlay
              isLooping={true}
              style={styles.video}
              onPlaybackStatusUpdate={handleVideoLoad}
            />
            <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayPause}>
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size={30} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: width * 0.8,
    height: height * 0.6,
    backgroundColor: '#0b34b0',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 3,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b34b0',
  },
  video: {
    width: '100%',
    height: '90%',
    borderRadius: 40,
  },
  playPauseButton: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 40,
    padding: 20,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b34b0',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b34b0',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    padding: 20,
    fontWeight: 'bold',
  },
  errorSubtext: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
});