// BottomSheetComponent.js
import React, { useRef, useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Animated,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMapMarkerAlt,
  faInfoCircle,
  faChevronLeft,
  faChevronRight,
  faToilet,
  faChalkboardTeacher,
  faMapSigns,
  faCamera,
  faStar, // ✨ AGREGAR ESTE IMPORT QUE FALTA
  faLocationDot, // ✨ TAMBIÉN ESTE SI NO ESTÁ
} from "@fortawesome/free-solid-svg-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { bottomSheetContents } from "./bottomSheetContents";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

// Función para sombras optimizadas según plataforma
const getShadowStyle = (elevation, color = "#000", opacity = 0.1) => {
  if (Platform.OS === 'android') {
    return {
      elevation: Math.min(elevation, 8),
      shadowColor: color,
    };
  } else {
    return {
      shadowColor: color,
      shadowOffset: { width: 0, height: elevation / 2 },
      shadowOpacity: opacity,
      shadowRadius: elevation,
    };
  }
};

export const BottomSheetComponent = React.forwardRef(
  ({ snapPoints, selectedPoint, isVisible, onClose }, ref) => {
    const bottomSheetRef = useRef(null);
    const scrollRef = useRef(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState([]);
    const [headerAnimation] = useState(new Animated.Value(0));

    // Expone métodos para expandir o cerrar el BottomSheet
    useEffect(() => {
      if (ref) {
        ref.current = {
          expand: () => bottomSheetRef.current?.expand(),
          close: () => bottomSheetRef.current?.close(),
        };
      }
    }, [ref]);

    useEffect(() => {
      if (isVisible) {
        bottomSheetRef.current?.expand();
        // Animación del header
        Animated.timing(headerAnimation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      } else {
        bottomSheetRef.current?.close();
        headerAnimation.setValue(0);
      }
    }, [isVisible]);

    const handleSheetChanges = useCallback(
      (index) => {
        if (index === -1) {
          setCurrentImageIndex(0);
          setLoadedImages([]);
          onClose();
        }
      },
      [onClose]
    );

    const goToNextImage = useCallback(
      (imagesLength) => {
        const nextIndex = (currentImageIndex + 1) % imagesLength;
        scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
        setCurrentImageIndex(nextIndex);
      },
      [currentImageIndex]
    );

    const goToPrevImage = useCallback(
      (imagesLength) => {
        const prevIndex =
          currentImageIndex === 0 ? imagesLength - 1 : currentImageIndex - 1;
        scrollRef.current?.scrollTo({ x: prevIndex * width, animated: true });
        setCurrentImageIndex(prevIndex);
      },
      [currentImageIndex]
    );

    const handleMomentumScrollEnd = useCallback((event) => {
      const slideWidth = event.nativeEvent.layoutMeasurement.width;
      const index = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
      setCurrentImageIndex(index);
    }, []);

    // ✨ CARRUSEL SÚPER HERMOSO Y BIEN CONTENIDO
    const renderImageCarousel = useCallback(
      (images) => {
        if (!images || images.length === 0) {
          return (
            <View style={styles.noImageContainerNew}>
              <View style={styles.noImageIconContainerNew}>
                <FontAwesomeIcon icon={faCamera} size={32} color="#d1d5db" />
              </View>
              <Text style={styles.noImageTextNew}>Sin imágenes disponibles</Text>
            </View>
          );
        }

        return (
          <View style={styles.carouselSuperContainer}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleMomentumScrollEnd}
              scrollEventThrottle={16}
              decelerationRate="fast"
            >
              {images.map((image, index) => (
                <View key={index} style={styles.imageSlideContainer}>
                  {!loadedImages.includes(index) && (
                    <View style={styles.loadingImageContainer}>
                      <ActivityIndicator size="large" color="#0b34b0" />
                      <Text style={styles.loadingImageText}>Cargando...</Text>
                    </View>
                  )}
                  <Image
                    source={image}
                    style={styles.carouselImagePerfect}
                    resizeMode="contain"
                    onLoad={() => setLoadedImages((prev) => [...prev, index])}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.4)']}
                    style={styles.imageGradientOverlay}
                  />
                </View>
              ))}
            </ScrollView>

            {images.length > 1 && (
              <>
                {/* ✨ BOTONES SÚPER DESVANECIDOS Y LINDOS */}
                <TouchableOpacity
                  style={styles.navButtonLeft}
                  onPress={() => goToPrevImage(images.length)}
                  activeOpacity={0.6}
                >
                  <View style={styles.navButtonContent}>
                    <FontAwesomeIcon icon={faChevronLeft} size={14} color="rgba(255, 255, 255, 0.9)" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.navButtonRight}
                  onPress={() => goToNextImage(images.length)}
                  activeOpacity={0.6}
                >
                  <View style={styles.navButtonContent}>
                    <FontAwesomeIcon icon={faChevronRight} size={14} color="rgba(255, 255, 255, 0.9)" />
                  </View>
                </TouchableOpacity>

                {/* ✨ INDICADORES LINDOS */}
                <View style={styles.paginationSuperContainer}>
                  {images.map((_, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.paginationDotNew,
                        index === currentImageIndex && styles.paginationDotActiveNew,
                      ]}
                      onPress={() => {
                        scrollRef.current?.scrollTo({ x: index * width, animated: true });
                        setCurrentImageIndex(index);
                      }}
                    />
                  ))}
                </View>

                <View style={styles.imageCounterNew}>
                  <Text style={styles.imageCounterTextNew}>
                    {currentImageIndex + 1} de {images.length}
                  </Text>
                </View>
              </>
            )}
          </View>
        );
      },
      [currentImageIndex, goToNextImage, goToPrevImage, handleMomentumScrollEnd, loadedImages]
    );

    // ✨ LUGARES RELEVANTES SÚPER ORGANIZADOS
    const renderRelevantPlacesNew = useCallback((places) => (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderNew}>
          <View style={styles.sectionIconContainer}>
            <FontAwesomeIcon icon={faMapSigns} size={16} color="#0b34b0" />
          </View>
          <Text style={styles.sectionTitleNew}>Lugares Relevantes</Text>
        </View>
        <View style={styles.placesGrid}>
          {places.map((place, index) => (
            <View key={index} style={styles.placeChip}>
              <View style={styles.placeChipIcon}>
                <FontAwesomeIcon icon={faStar} size={10} color="#fbbf24" />
              </View>
              <Text style={styles.placeChipText}>{place}</Text>
            </View>
          ))}
        </View>
      </View>
    ), []);

    // ✨ BAÑOS SÚPER ORGANIZADOS
    const renderBathroomsNew = useCallback((bathrooms) => (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderNew}>
          <View style={styles.sectionIconContainer}>
            <FontAwesomeIcon icon={faToilet} size={16} color="#059669" />
          </View>
          <Text style={styles.sectionTitleNew}>Sanitarios</Text>
        </View>
        <View style={styles.bathroomsList}>
          {bathrooms.map((bathroom, index) => (
            <View key={index} style={styles.bathroomItemNew}>
              <View style={styles.bathroomIconNew}>
                <FontAwesomeIcon icon={faLocationDot} size={10} color="#059669" />
              </View>
              <Text style={styles.bathroomTextNew}>{bathroom}</Text>
            </View>
          ))}
        </View>
      </View>
    ), []);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={styles.bottomSheetBackgroundNew}
        handleIndicatorStyle={styles.bottomSheetIndicatorNew}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        android_keyboardInputMode="adjustResize"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContentNew}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {selectedPoint && bottomSheetContents[selectedPoint] && (
              <View style={styles.mainContentContainer}>

                {/* ✨ HEADER MINIMALISTA Y ELEGANTE */}
                <Animated.View
                  style={[
                    styles.headerMinimal,
                    {
                      opacity: headerAnimation,
                      transform: [{
                        translateY: headerAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-10, 0],
                        })
                      }]
                    }
                  ]}
                >
                  <View style={styles.headerContentMinimal}>
                    <View style={styles.headerIconMinimal}>
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        size={16}
                        color="#0b34b0"
                      />
                    </View>
                    <View style={styles.headerTextMinimal}>
                      <Text style={styles.titleMinimal}>
                        {bottomSheetContents[selectedPoint].name}
                      </Text>
                    </View>
                  </View>
                </Animated.View>

                {/* ✨ CARRUSEL PERFECTO Y CONTENIDO */}
                {renderImageCarousel(bottomSheetContents[selectedPoint]["images-path"])}

                {/* ✨ INFORMACIÓN PRINCIPAL */}
                <View style={styles.mainInfoSection}>
                  <View style={styles.descriptionCard}>
                    <View style={styles.descriptionHeaderNew}>
                      <FontAwesomeIcon icon={faInfoCircle} size={14} color="#0b34b0" />
                      <Text style={styles.descriptionTitleNew}>Descripción</Text>
                    </View>
                    <Text style={styles.descriptionTextNew}>
                      {bottomSheetContents[selectedPoint].description}
                    </Text>
                  </View>

                  {/* ✨ AULAS CARD */}
                  <View style={styles.infoCardSimple}>
                    <View style={styles.infoCardIconContainer}>
                      <FontAwesomeIcon icon={faChalkboardTeacher} size={14} color="#0b34b0" />
                    </View>
                    <View style={styles.infoCardContent}>
                      <Text style={styles.infoCardLabel}>Aulas disponibles</Text>
                      <Text style={styles.infoCardValue}>{bottomSheetContents[selectedPoint].classrooms}</Text>
                    </View>
                  </View>
                </View>

                {/* ✨ SECCIONES ORGANIZADAS */}
                {renderRelevantPlacesNew(bottomSheetContents[selectedPoint]["relevant-places"])}
                {renderBathroomsNew(bottomSheetContents[selectedPoint].bathrooms)}

                {/* ✨ ESPACIADO FINAL */}
                <View style={styles.finalSpacer} />

              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: Platform.OS === 'android' ? 24 : 28,
    borderTopRightRadius: Platform.OS === 'android' ? 24 : 28,
    ...getShadowStyle(12, "#000", 0.15),
  },
  bottomSheetIndicator: {
    backgroundColor: "#0b34b0",
    width: Platform.OS === 'android' ? 50 : 60,
    height: Platform.OS === 'android' ? 4 : 5,
    borderRadius: Platform.OS === 'android' ? 2 : 2.5,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  bottomSheetContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'android' ? 20 : 30,
  },
  contentContainer: {
    flex: 1,
  },

  // ✨ HEADER COMPACTO Y MINIMALISTA
  headerCompact: {
    overflow: 'hidden',
    borderTopLeftRadius: Platform.OS === 'android' ? 20 : 24,
    borderTopRightRadius: Platform.OS === 'android' ? 20 : 24,
    marginBottom: Platform.OS === 'android' ? 12 : 16,
  },

  headerGradientCompact: {
    paddingVertical: Platform.OS === 'android' ? 12 : 16,
    paddingHorizontal: Platform.OS === 'android' ? 16 : 20,
  },

  headerContentCompact: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerIconContainerCompact: {
    width: Platform.OS === 'android' ? 32 : 36,
    height: Platform.OS === 'android' ? 32 : 36,
    borderRadius: Platform.OS === 'android' ? 16 : 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Platform.OS === 'android' ? 12 : 16,
  },

  headerTextContainerCompact: {
    flex: 1,
  },

  titleCompact: {
    fontSize: Platform.OS === 'android'
      ? (isTablet ? 16 : 14)
      : (isTablet ? 18 : 16),
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  subtitleCompact: {
    fontSize: Platform.OS === 'android'
      ? (isTablet ? 11 : 10)
      : (isTablet ? 12 : 11),
    color: "#ffffff",
    opacity: 0.8,
    fontWeight: "400",
  },

  // ✨ CARRUSEL MÁS COMPACTO
  carouselContainerCompact: {
    width: "100%",
    height: Platform.OS === 'android'
      ? (isTablet ? width * 0.45 : width * 0.5)
      : (isTablet ? width * 0.4 : width * 0.45),
    position: "relative",
    marginBottom: Platform.OS === 'android' ? 16 : 20,
    borderRadius: Platform.OS === 'android' ? 12 : 16,
    overflow: 'hidden',
    ...getShadowStyle(4, "#000", 0.08),
  },

  // ✨ BOTONES DE NAVEGACIÓN MÁS DESVANECIDOS
  prevButtonFaded: {
    position: "absolute",
    left: Platform.OS === 'android' ? 12 : 16,
    top: "50%",
    zIndex: 2,
    transform: [{ translateY: Platform.OS === 'android' ? -18 : -20 }],
    borderRadius: Platform.OS === 'android' ? 18 : 20,
    overflow: 'hidden',
  },

  nextButtonFaded: {
    position: "absolute",
    right: Platform.OS === 'android' ? 12 : 16,
    top: "50%",
    zIndex: 2,
    transform: [{ translateY: Platform.OS === 'android' ? -18 : -20 }],
    borderRadius: Platform.OS === 'android' ? 18 : 20,
    overflow: 'hidden',
  },

  navButtonFaded: {
    width: Platform.OS === 'android' ? 36 : 40,
    height: Platform.OS === 'android' ? 36 : 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
  },

  // ✨ PAGINACIÓN COMPACTA
  paginationContainerCompact: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: Platform.OS === 'android' ? 12 : 16,
    left: 0,
    right: 0,
  },

  paginationDotCompact: {
    width: Platform.OS === 'android' ? 6 : 8,
    height: Platform.OS === 'android' ? 6 : 8,
    borderRadius: Platform.OS === 'android' ? 3 : 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: Platform.OS === 'android' ? 3 : 4,
  },

  paginationDotActiveCompact: {
    backgroundColor: "#FFFFFF",
    ...getShadowStyle(1, "#000", 0.3),
  },

  // ✨ CONTADOR DE IMÁGENES COMPACTO
  imageCounterCompact: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 12 : 16,
    right: Platform.OS === 'android' ? 12 : 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: Platform.OS === 'android' ? 8 : 12,
    paddingVertical: Platform.OS === 'android' ? 4 : 6,
    borderRadius: Platform.OS === 'android' ? 12 : 16,
  },

  imageCounterTextCompact: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'android' ? 10 : 12,
    fontWeight: '500',
  },

  // ✨ DESCRIPCIÓN COMPACTA
  descriptionContainerCompact: {
    backgroundColor: "#ffffff",
    borderRadius: Platform.OS === 'android' ? 12 : 16,
    marginHorizontal: Platform.OS === 'android' ? 16 : 20,
    marginBottom: Platform.OS === 'android' ? 12 : 16,
    padding: Platform.OS === 'android' ? 16 : 20,
    ...getShadowStyle(2, "#000", 0.05),
    borderWidth: 1,
    borderColor: '#f8fafc',
  },

  descriptionHeaderCompact: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Platform.OS === 'android' ? 8 : 12,
  },

  descriptionTitleCompact: {
    fontSize: Platform.OS === 'android'
      ? (isTablet ? 14 : 13)
      : (isTablet ? 16 : 14),
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: Platform.OS === 'android' ? 8 : 12,
  },

  descriptionCompact: {
    fontSize: Platform.OS === 'android'
      ? (isTablet ? 13 : 12)
      : (isTablet ? 14 : 13),
    color: "#4b5563",
    lineHeight: Platform.OS === 'android'
      ? (isTablet ? 20 : 18)
      : (isTablet ? 22 : 20),
    fontWeight: "400",
  },

  // ✨ TARJETA DE INFORMACIÓN COMPACTA (SOLO AULAS)
  infoCardCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: Platform.OS === 'android' ? 12 : 16,
    padding: Platform.OS === 'android' ? 12 : 16,
    marginHorizontal: Platform.OS === 'android' ? 16 : 20,
    marginBottom: Platform.OS === 'android' ? 12 : 16,
    ...getShadowStyle(2, "#000", 0.04),
    borderWidth: 1,
    borderColor: '#f8fafc',
  },

  infoCardIconCompact: {
    width: Platform.OS === 'android' ? 28 : 32,
    height: Platform.OS === 'android' ? 28 : 32,
    borderRadius: Platform.OS === 'android' ? 14 : 16,
    backgroundColor: 'rgba(11, 52, 176, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Platform.OS === 'android' ? 12 : 16,
  },

  infoCardContentCompact: {
    flex: 1,
  },

  infoCardTitleCompact: {
    fontSize: Platform.OS === 'android' ? 10 : 11,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 2,
  },

  infoCardValueCompact: {
    fontSize: Platform.OS === 'android' ? 12 : 13,
    color: '#1f2937',
    fontWeight: '600',
  },

  // ✨ LUGARES RELEVANTES COMPACTOS
  placesContainerCompact: {
    marginHorizontal: Platform.OS === 'android' ? 16 : 20,
    marginBottom: Platform.OS === 'android' ? 12 : 16,
    backgroundColor: '#ffffff',
    borderRadius: Platform.OS === 'android' ? 12 : 16,
    padding: Platform.OS === 'android' ? 12 : 16,
    ...getShadowStyle(2, "#000", 0.04),
    borderWidth: 1,
    borderColor: '#f8fafc',
  },

  sectionHeaderCompact: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Platform.OS === 'android' ? 8 : 12,
  },

  sectionTitleCompact: {
    fontSize: Platform.OS === 'android'
      ? (isTablet ? 13 : 12)
      : (isTablet ? 14 : 13),
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: Platform.OS === 'android' ? 8 : 12,
  },

  placesGridCompact: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  placeItemCompact: {
    backgroundColor: '#f8fafc',
    borderRadius: Platform.OS === 'android' ? 8 : 10,
    paddingHorizontal: Platform.OS === 'android' ? 10 : 12,
    paddingVertical: Platform.OS === 'android' ? 6 : 8,
    marginRight: Platform.OS === 'android' ? 6 : 8,
    marginBottom: Platform.OS === 'android' ? 6 : 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  placeTextCompact: {
    fontSize: Platform.OS === 'android' ? 11 : 12,
    color: '#374151',
    fontWeight: '500',
  },

  // ✨ BAÑOS COMPACTOS
  bathroomsContainerCompact: {
    marginHorizontal: Platform.OS === 'android' ? 16 : 20,
    marginBottom: Platform.OS === 'android' ? 16 : 20,
    backgroundColor: '#ffffff',
    borderRadius: Platform.OS === 'android' ? 12 : 16,
    padding: Platform.OS === 'android' ? 12 : 16,
    ...getShadowStyle(2, "#000", 0.04),
    borderWidth: 1,
    borderColor: '#f8fafc',
  },

  bathroomsListCompact: {
    // Contenedor de la lista compacta
  },

  bathroomItemCompact: {
    paddingVertical: Platform.OS === 'android' ? 6 : 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  bathroomTextCompact: {
    fontSize: Platform.OS === 'android' ? 11 : 12,
    color: '#374151',
    fontWeight: '500',
  },

  // ✨ SIN IMAGEN - COMPACTO
  noImageContainer: {
    width: "100%",
    height: Platform.OS === 'android' ? 140 : 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: Platform.OS === 'android' ? 12 : 16,
    marginBottom: Platform.OS === 'android' ? 16 : 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },

  noImageIconContainer: {
    marginBottom: Platform.OS === 'android' ? 8 : 12,
  },

  noImageText: {
    color: '#9ca3af',
    fontSize: Platform.OS === 'android' ? 12 : 14,
    fontWeight: '500',
  },

  // ✨ ESPACIADO FINAL
  bottomSpacer: {
    height: Platform.OS === 'android' ? 30 : 40,
  },

  // ✨ BOTTOMSHEET SÚPER HERMOSO
  bottomSheetBackgroundNew: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: Platform.OS === 'android' ? 20 : 24,
    borderTopRightRadius: Platform.OS === 'android' ? 20 : 24,
    ...getShadowStyle(8, "#000", 0.1),
  },

  bottomSheetIndicatorNew: {
    backgroundColor: "#0b34b0",
    width: Platform.OS === 'android' ? 40 : 50,
    height: Platform.OS === 'android' ? 4 : 5,
    borderRadius: Platform.OS === 'android' ? 2 : 2.5,
  },

  // ✨ SCROLL CONTENT OPTIMIZADO
  scrollContentNew: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'android' ? 20 : 30,
  },

  mainContentContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // ✨ HEADER MINIMALISTA Y ELEGANTE
  headerMinimal: {
    paddingHorizontal: Platform.OS === 'android' ? 16 : 20,
    paddingVertical: Platform.OS === 'android' ? 12 : 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  headerContentMinimal: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerIconMinimal: {
    width: Platform.OS === 'android' ? 28 : 32,
    height: Platform.OS === 'android' ? 28 : 32,
    borderRadius: Platform.OS === 'android' ? 14 : 16,
    backgroundColor: 'rgba(11, 52, 176, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Platform.OS === 'android' ? 10 : 12,
  },

  headerTextMinimal: {
    flex: 1,
  },

  titleMinimal: {
    fontSize: Platform.OS === 'android'
      ? (isTablet ? 16 : 15)
      : (isTablet ? 18 : 16),
    fontWeight: "700",
    color: "#1f2937",
    lineHeight: Platform.OS === 'android' ? 20 : 22,
  },

  // ✨ CARRUSEL SÚPER HERMOSO Y CONTENIDO
  carouselSuperContainer: {
    width: "100%",
    aspectRatio: width / (height * 0.3), // Mantiene la relación de aspecto
    position: "relative",
    backgroundColor: '#f8fafc',
    marginBottom: Platform.OS === 'android' ? 16 : 20,
  },

  imageSlideContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    position: 'relative',
  },

  carouselImagePerfect: {
    width: width,
    height: undefined,
    aspectRatio: 16 / 9, // Puedes ajustar la relación según tus imágenes
    borderRadius: Platform.OS === 'android' ? 12 : 16,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    ...getShadowStyle(2, "#000", 0.05),
  },

  imageGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    pointerEvents: 'none',
  },

  loadingImageContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },

  loadingImageText: {
    marginTop: Platform.OS === 'android' ? 8 : 12,
    color: "#0b34b0",
    fontSize: Platform.OS === 'android' ? 12 : 14,
    fontWeight: "500",
  },

  // ✨ BOTONES DE NAVEGACIÓN SÚPER DESVANECIDOS
  navButtonLeft: {
    position: "absolute",
    left: Platform.OS === 'android' ? 12 : 16,
    top: "50%",
    zIndex: 2,
    transform: [{ translateY: Platform.OS === 'android' ? -18 : -20 }],
  },

  navButtonRight: {
    position: "absolute",
    right: Platform.OS === 'android' ? 12 : 16,
    top: "50%",
    zIndex: 2,
    transform: [{ translateY: Platform.OS === 'android' ? -18 : -20 }],
  },

  navButtonContent: {
    width: Platform.OS === 'android' ? 36 : 40,
    height: Platform.OS === 'android' ? 36 : 40,
    borderRadius: Platform.OS === 'android' ? 18 : 20,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ✨ INDICADORES SÚPER LINDOS
  paginationSuperContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: Platform.OS === 'android' ? 12 : 16,
    left: 0,
    right: 0,
  },

  paginationDotNew: {
    width: Platform.OS === 'android' ? 6 : 8,
    height: Platform.OS === 'android' ? 6 : 8,
    borderRadius: Platform.OS === 'android' ? 3 : 4,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    marginHorizontal: Platform.OS === 'android' ? 3 : 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },

  paginationDotActiveNew: {
    backgroundColor: "#FFFFFF",
    ...getShadowStyle(2, "#000", 0.2),
  },

  // ✨ CONTADOR DE IMÁGENES
  imageCounterNew: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 12 : 16,
    right: Platform.OS === 'android' ? 12 : 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: Platform.OS === 'android' ? 8 : 10,
    paddingVertical: Platform.OS === 'android' ? 4 : 6,
    borderRadius: Platform.OS === 'android' ? 12 : 14,
  },

  imageCounterTextNew: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'android' ? 10 : 12,
    fontWeight: '600',
  },

  // ✨ ESTADO SIN IMÁGENES MEJORADO
  noImageContainerNew: {
    width: "100%",
    height: Platform.OS === 'android' ? 120 : 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    marginBottom: Platform.OS === 'android' ? 16 : 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },

  noImageIconContainerNew: {
    marginBottom: Platform.OS === 'android' ? 8 : 10,
  },

  noImageTextNew: {
    color: '#9ca3af',
    fontSize: Platform.OS === 'android' ? 12 : 14,
    fontWeight: '500',
  },

  // ✨ INFORMACIÓN PRINCIPAL SÚPER ORGANIZADA
  mainInfoSection: {
    paddingHorizontal: Platform.OS === 'android' ? 16 : 20,
    marginBottom: Platform.OS === 'android' ? 20 : 24,
  },

  descriptionCard: {
    backgroundColor: "#ffffff",
    borderRadius: Platform.OS === 'android' ? 12 : 16,
    padding: Platform.OS === 'android' ? 16 : 20,
    marginBottom: Platform.OS === 'android' ? 12 : 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    ...getShadowStyle(2, "#000", 0.04),
  },

  descriptionHeaderNew: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Platform.OS === 'android' ? 10 : 12,
  },

  descriptionTitleNew: {
    fontSize: Platform.OS === 'android'
      ? (isTablet ? 14 : 13)
      : (isTablet ? 16 : 14),
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: Platform.OS === 'android' ? 8 : 10,
  },

  descriptionTextNew: {
    fontSize: Platform.OS === 'android'
      ? (isTablet ? 13 : 12)
      : (isTablet ? 14 : 13),
    color: "#4b5563",
    lineHeight: Platform.OS === 'android'
      ? (isTablet ? 18 : 17)
      : (isTablet ? 20 : 18),
    fontWeight: "400",
  },

  // ✨ TARJETA DE AULAS SIMPLE
  infoCardSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: Platform.OS === 'android' ? 12 : 16,
    padding: Platform.OS === 'android' ? 14 : 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    ...getShadowStyle(2, "#000", 0.04),
  },

  infoCardIconContainer: {
    width: Platform.OS === 'android' ? 28 : 32,
    height: Platform.OS === 'android' ? 28 : 32,
    borderRadius: Platform.OS === 'android' ? 14 : 16,
    backgroundColor: 'rgba(11, 52, 176, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Platform.OS === 'android' ? 12 : 16,
  },

  infoCardContent: {
    flex: 1,
  },

  infoCardLabel: {
    fontSize: Platform.OS === 'android' ? 10 : 11,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 2,
  },

  infoCardValue: {
    fontSize: Platform.OS === 'android' ? 12 : 13,
    color: '#1f2937',
    fontWeight: '600',
  },

  // ✨ SECCIONES SÚPER ORGANIZADAS
  sectionContainer: {
    paddingHorizontal: Platform.OS === 'android' ? 16 : 20,
    marginBottom: Platform.OS === 'android' ? 16 : 20,
    backgroundColor: '#ffffff',
    borderRadius: Platform.OS === 'android' ? 12 : 16,
    padding: Platform.OS === 'android' ? 16 : 20,
    marginHorizontal: Platform.OS === 'android' ? 16 : 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    ...getShadowStyle(2, "#000", 0.04),
  },

  sectionHeaderNew: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Platform.OS === 'android' ? 12 : 16,
  },

  sectionIconContainer: {
    width: Platform.OS === 'android' ? 24 : 28,
    height: Platform.OS === 'android' ? 24 : 28,
    borderRadius: Platform.OS === 'android' ? 12 : 14,
    backgroundColor: 'rgba(11, 52, 176, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Platform.OS === 'android' ? 8 : 10,
  },

  sectionTitleNew: {
    fontSize: Platform.OS === 'android'
      ? (isTablet ? 13 : 12)
      : (isTablet ? 14 : 13),
    fontWeight: "600",
    color: "#1f2937",
  },

  // ✨ LUGARES RELEVANTES SÚPER LINDOS
  placesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  placeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: Platform.OS === 'android' ? 8 : 10,
    paddingHorizontal: Platform.OS === 'android' ? 8 : 10,
    paddingVertical: Platform.OS === 'android' ? 6 : 8,
    marginRight: Platform.OS === 'android' ? 6 : 8,
    marginBottom: Platform.OS === 'android' ? 6 : 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  placeChipIcon: {
    marginRight: Platform.OS === 'android' ? 6 : 8,
  },

  placeChipText: {
    fontSize: Platform.OS === 'android' ? 11 : 12,
    color: '#374151',
    fontWeight: '500',
  },

  // ✨ BAÑOS SÚPER ORGANIZADOS
  bathroomsList: {
    // Contenedor de la lista
  },

  bathroomItemNew: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'android' ? 8 : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  bathroomIconNew: {
    width: Platform.OS === 'android' ? 20 : 24,
    height: Platform.OS === 'android' ? 20 : 24,
    borderRadius: Platform.OS === 'android' ? 10 : 12,
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Platform.OS === 'android' ? 10 : 12,
  },

  bathroomTextNew: {
    fontSize: Platform.OS === 'android' ? 11 : 12,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },

  // ✨ ESPACIADO FINAL
  finalSpacer: {
    height: Platform.OS === 'android' ? 20 : 30,
  },

  // ...existing modal styles...
});

export default BottomSheetComponent;
