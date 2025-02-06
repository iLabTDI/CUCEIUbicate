// Importamos los módulos y componentes necesarios de React y React Native
import React, { useRef, useCallback, useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import FastImage from "react-native-fast-image";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMapMarkerAlt,
  faInfoCircle,
  faChevronLeft,
  faChevronRight,
  faToilet,
  faChalkboardTeacher,
  faMapSigns,
} from "@fortawesome/free-solid-svg-icons";
import { bottomSheetContents } from "./bottomSheetContents";

// Obtenemos el ancho de la ventana actual
const { width } = Dimensions.get("window");

// Definimos el componente BottomSheetComponent utilizando forwardRef para poder manipular el BottomSheet desde el exterior
export const BottomSheetComponent = React.forwardRef(
  ({ snapPoints, selectedPoint, isVisible, onClose }, ref) => {
    const bottomSheetRef = useRef(null); // Referencia del BottomSheet
    const scrollRef = useRef(null); // Referencia del ScrollView para manejar el deslizamiento de imágenes
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Estado para almacenar el índice de la imagen actual en el carrusel
    const [loadedImages, setLoadedImages] = useState([]); // Estado para almacenar las imágenes que se han cargado

    // Efecto que permite expandir o cerrar el BottomSheet desde fuera usando la referencia
    useEffect(() => {
      if (ref) {
        ref.current = {
          expand: () => bottomSheetRef.current?.expand(), // Expande el BottomSheet
          close: () => bottomSheetRef.current?.close(), // Cierra el BottomSheet
        };
      }
    }, [ref]);

    // Efecto que se activa cuando la visibilidad del BottomSheet cambia
    // Si isVisible es true, expande el BottomSheet, de lo contrario lo cierra
    useEffect(() => {
      if (isVisible) {
        bottomSheetRef.current?.expand();
      } else {
        bottomSheetRef.current?.close();
      }
    }, [isVisible]);

    // Callback que detecta cambios en el estado del BottomSheet (si se ha cerrado o no)
    const handleSheetChanges = useCallback(
      (index) => {
        if (index === -1) {
          // Cuando el índice es -1, el BottomSheet está cerrado
          onClose(); // Ejecuta la función onClose para notificar el cierre
        }
      },
      [onClose]
    );

    // Callback que avanza a la siguiente imagen en el carrusel
    const goToNextImage = useCallback(
      (imagesLength) => {
        const nextIndex = (currentImageIndex + 1) % imagesLength; // Calcula el índice de la siguiente imagen
        scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true }); // Desplaza el ScrollView a la siguiente imagen
        setCurrentImageIndex(nextIndex); // Actualiza el estado del índice actual
      },
      [currentImageIndex]
    );

    // Callback que retrocede a la imagen anterior en el carrusel
    const goToPrevImage = useCallback(
      (imagesLength) => {
        const prevIndex =
          currentImageIndex === 0 ? imagesLength - 1 : currentImageIndex - 1; // Calcula el índice de la imagen anterior
        scrollRef.current?.scrollTo({ x: prevIndex * width, animated: true }); // Desplaza el ScrollView a la imagen anterior
        setCurrentImageIndex(prevIndex); // Actualiza el estado del índice actual
      },
      [currentImageIndex]
    );

    // Callback que se ejecuta cuando se detiene el desplazamiento en el carrusel
    // Calcula el índice de la imagen actual basado en la posición de desplazamiento
    const handleMomentumScrollEnd = useCallback((event) => {
      const slideWidth = event.nativeEvent.layoutMeasurement.width;
      const index = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
      setCurrentImageIndex(index); // Actualiza el estado con el nuevo índice
    }, []);

    // Función que renderiza el carrusel de imágenes
    const renderImageCarousel = useCallback(
      (images) => {
        return (
          <View style={styles.carouselContainer}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false} // Oculta el indicador de desplazamiento horizontal
              onMomentumScrollEnd={handleMomentumScrollEnd} // Ejecuta el callback al final del desplazamiento
              scrollEventThrottle={16} // Controla la frecuencia de los eventos de desplazamiento
              contentContainerStyle={styles.scrollViewContent}>
              {/* Mapea las imágenes recibidas y las renderiza */}
              {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  {!loadedImages.includes(index) && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size={24} color="#0000ff" />
                      <Text style={styles.loadingText}>Cargando...</Text>
                    </View>
                  )}
                  <Image
                    key={index}
                    source={image} // Fuente de la imagen
                    style={styles.carouselImage} // Estilo de la imagen
                    resizeMode="cover" // La imagen se ajusta para cubrir el área del contenedor
                    onLoad={() => setLoadedImages(prev => [...prev, index])} // Actualiza el estado cuando la imagen se carga
                  />
                </View>
              ))}
            </ScrollView>
            {/* Si hay más de una imagen, muestra los botones para avanzar y retroceder */}
            {images.length > 1 && (
              <>
                {/* Botón para ir a la imagen anterior */}
                <TouchableOpacity
                  style={styles.prevButton}
                  onPress={() => goToPrevImage(images.length)}
                  activeOpacity={0.6}>
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    size={24}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
                {/* Botón para ir a la siguiente imagen */}
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={() => goToNextImage(images.length)}
                  activeOpacity={0.6}>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    size={24}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
                {/* Paginación visual para mostrar qué imagen está activa */}
                <View style={styles.paginationContainer}>
                  {images.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.paginationDot,
                        index === currentImageIndex &&
                          styles.paginationDotActive, // Resalta el punto correspondiente a la imagen actual
                      ]}
                    />
                  ))}
                </View>
              </>
            )}
          </View>
        );
      },
      [currentImageIndex, goToNextImage, goToPrevImage, handleMomentumScrollEnd, loadedImages]
    );

    return (
      // Componente BottomSheet de @gorhom/bottom-sheet
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // El índice -1 indica que el BottomSheet comienza cerrado
        snapPoints={snapPoints} // Puntos de anclaje para el BottomSheet
        onChange={handleSheetChanges} // Callback para manejar los cambios de estado del BottomSheet
        backgroundStyle={styles.bottomSheetBackground} // Estilo de fondo del BottomSheet
        handleIndicatorStyle={styles.bottomSheetIndicator} // Estilo del indicador de arrastre del BottomSheet
        enablePanDownToClose={true} // Permite cerrar el BottomSheet arrastrando hacia abajo
        enableContentPanningGesture={false} // Evita conflicto con el ScrollView
      >
        {/* El KeyboardAvoidingView permite que el contenido del BottomSheet evite el teclado en iOS */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
          >
          <ScrollView
            contentContainerStyle={styles.bottomSheetContent}
            keyboardShouldPersistTaps="handled" // Asegura que los gestos de toque y scroll funcionen correctamente
            showsVerticalScrollIndicator={false} // Opcional: Mostrar el indicador de scroll
            nestedScrollEnabled={true} // Permite que el ScrollView maneje gestos anidados en Android
            >
            {/* Solo muestra contenido si se ha seleccionado un punto y tiene datos asociados */}
            {selectedPoint && bottomSheetContents[selectedPoint] && (
              <View style={styles.contentContainer}>
                <View style={styles.header}>
                  {/* Icono y nombre del lugar seleccionado */}
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    size={24}
                    color="#4A90E2"
                    style={styles.headerIcon}
                  />
                  <Text style={styles.title}>
                    {bottomSheetContents[selectedPoint].name}
                  </Text>
                </View>
                {/* Carrusel de imágenes del lugar seleccionado */}
                {renderImageCarousel(
                  bottomSheetContents[selectedPoint]["photo-path"]
                )}
                {renderImageCarousel(
                  bottomSheetContents[selectedPoint]["images-path"]
                )}
                <View style={styles.infoContainer}>
                  {/* Sección de descripción del lugar */}
                  <View style={styles.descriptionContainer}>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      size={20}
                      color="#0000ff"
                      style={styles.descriptionIcon}
                    />
                    <Text style={styles.description}>
                      {bottomSheetContents[selectedPoint].description}
                    </Text>
                  </View>

                  {/* Detalles adicionales del lugar, como aulas, lugares relevantes y baños */}
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                      <FontAwesomeIcon
                        icon={faChalkboardTeacher}
                        size={20}
                        color="#0000ff"
                        style={styles.detailIcon}
                      />
                      <Text style={styles.detailText}>
                        Aulas: {bottomSheetContents[selectedPoint].classrooms}
                      </Text>
                    </View>

                    <View style={styles.detailItem}>
                      <FontAwesomeIcon
                        icon={faMapSigns}
                        size={20}
                        color="#0000ff"
                        style={styles.detailIcon}
                      />
                      <Text style={styles.detailTitle}>
                        Lugares relevantes:
                      </Text>
                    </View>
                    {/* Muestra los lugares relevantes asociados */}
                    {bottomSheetContents[selectedPoint]["relevant-places"].map(
                      (place, index) => (
                        <Text key={index} style={styles.detailSubText}>
                          {place}
                        </Text>
                      )
                    )}

                    <View style={styles.detailItem}>
                      <FontAwesomeIcon
                        icon={faToilet}
                        size={20}
                        color="#0000ff"
                        style={styles.detailIcon}
                      />
                      <Text style={styles.detailTitle}>Baños:</Text>
                    </View>
                    {/* Muestra los baños asociados */}
                    {bottomSheetContents[selectedPoint].bathrooms.map(
                      (bathroom, index) => (
                        <Text key={index} style={styles.detailSubText}>
                          {bathroom}
                        </Text>
                      )
                    )}
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </BottomSheet>
    );
  }
);

// Estilos del componente
const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: "#f8f9fa",
  },
  bottomSheetIndicator: {
    backgroundColor: "#4A90E2",
    width: 50,
    height: 5,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  bottomSheetContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  carouselContainer: {
    width: "100%",
    height: width * (9 / 16),
    position: "relative",
    marginBottom: 16,
    alignItems: "center",
  },
  scrollViewContent: {
    height: "100%",
  },
  imageContainer: {
    width: width,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: {
    width: width,
    height: "100%",
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#0000ff',
    fontSize: 16,
  },
  prevButton: {
    position: "absolute",
    left: 10,
    top: "50%",
    zIndex: 1,
    transform: [{ translateY: -20 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 50,
  },
  nextButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    zIndex: 1,
    transform: [{ translateY: -20 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 50,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#FFFFFF",
  },
  infoContainer: {
    padding: 16,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  descriptionIcon: {
    marginRight: 10,
    marginTop: 3,
  },
  description: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
  },
  detailsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginTop: 16,
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailIcon: {
    marginRight: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#000000",
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  detailSubText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 30,
    marginBottom: 8,
  },
});

export default BottomSheetComponent;