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
} from "@fortawesome/free-solid-svg-icons";
// Supongo que bottomSheetContents es un objeto que asocia un id de punto a la información del lugar
import { bottomSheetContents } from "./bottomSheetContents";

const { width } = Dimensions.get("window");

export const BottomSheetComponent = React.forwardRef(
  ({ snapPoints, selectedPoint, isVisible, onClose }, ref) => {
    const bottomSheetRef = useRef(null);
    const scrollRef = useRef(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState([]);

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
      } else {
        bottomSheetRef.current?.close();
      }
    }, [isVisible]);

    const handleSheetChanges = useCallback(
      (index) => {
        if (index === -1) {
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

    const renderImageCarousel = useCallback(
      (images) => {
        if (!images || images.length === 0) return null;
        return (
          <View style={styles.carouselContainer}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleMomentumScrollEnd}
              scrollEventThrottle={16}
              contentContainerStyle={styles.scrollViewContent}
            >
              {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  {!loadedImages.includes(index) && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size={24} color="#0000ff" />
                      <Text style={styles.loadingText}>Cargando...</Text>
                    </View>
                  )}
                  <Image
                    source={image}
                    style={styles.carouselImage}
                    resizeMode="cover"
                    onLoad={() => setLoadedImages((prev) => [...prev, index])}
                  />
                </View>
              ))}
            </ScrollView>
            {images.length > 1 && (
              <>
                <TouchableOpacity
                  style={styles.prevButton}
                  onPress={() => goToPrevImage(images.length)}
                  activeOpacity={0.6}
                >
                  <FontAwesomeIcon icon={faChevronLeft} size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={() => goToNextImage(images.length)}
                  activeOpacity={0.6}
                >
                  <FontAwesomeIcon icon={faChevronRight} size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.paginationContainer}>
                  {images.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.paginationDot,
                        index === currentImageIndex && styles.paginationDotActive,
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
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            contentContainerStyle={styles.bottomSheetContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {selectedPoint && bottomSheetContents[selectedPoint] && (
              <View style={styles.contentContainer}>
                <View style={styles.header}>
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
                {renderImageCarousel(
                  bottomSheetContents[selectedPoint]["photo-path"]
                )}
                {renderImageCarousel(
                  bottomSheetContents[selectedPoint]["images-path"]
                )}
                <View style={styles.infoContainer}>
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
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#0000ff",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  descriptionIcon: {
    marginRight: 10,
    marginTop: 3,
  },
  description: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    lineHeight: 24,
  },
  detailsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginTop: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    color: "#000",
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  detailSubText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 30,
    marginBottom: 8,
  },
});

export default BottomSheetComponent;
