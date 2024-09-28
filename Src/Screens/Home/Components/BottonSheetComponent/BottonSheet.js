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
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar, faMapMarkerAlt, faInfoCircle, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { bottomSheetContents } from "./bottomSheetContents";

const { width } = Dimensions.get("window");

export const BottomSheetComponent = React.forwardRef(
  ({ snapPoints, selectedPoint, isVisible, onClose }, ref) => {
    const bottomSheetRef = useRef(null);
    const scrollRef = useRef(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

    const goToNextImage = (imagesLength) => {
      const nextIndex = (currentImageIndex + 1) % imagesLength;
      scrollRef.current.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentImageIndex(nextIndex);
    };

    const goToPrevImage = (imagesLength) => {
      const prevIndex = currentImageIndex === 0 ? imagesLength - 1 : currentImageIndex - 1;
      scrollRef.current.scrollTo({ x: prevIndex * width, animated: true });
      setCurrentImageIndex(prevIndex);
    };

    const handleMomentumScrollEnd = (event) => {
      const slideWidth = event.nativeEvent.layoutMeasurement.width;
      const index = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
      setCurrentImageIndex(index);
    };

    const renderImageCarousel = (images) => {
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
              <Image
                key={index}
                source={image}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {images.length > 1 && (
            <>
              <TouchableOpacity
                style={styles.prevButton}
                onPress={() => goToPrevImage(images.length)}
                activeOpacity={0.6}
              >
                <FontAwesomeIcon icon={faChevronLeft} size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => goToNextImage(images.length)}
                activeOpacity={0.6}
              >
                <FontAwesomeIcon icon={faChevronRight} size={24} color="#fff" />
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
    };

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
        enablePanDownToClose={true}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <BottomSheetScrollView
            contentContainerStyle={styles.bottomSheetContent}
          >
            {bottomSheetContents.map(
              (content) =>
                selectedPoint === content.id && (
                  <View key={content.id} style={styles.contentContainer}>
                    <View style={styles.header}>
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        size={24}
                        color="#000"
                        style={styles.headerIcon}
                      />
                      <Text style={styles.title}>{content.id}</Text>
                    </View>
                    {renderImageCarousel(content.images)}
                    <View style={styles.infoContainer}>
                      <View style={styles.descriptionContainer}>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          size={20}
                          color="#0066CC"
                          style={styles.descriptionIcon}
                        />
                        <Text style={styles.description}>
                          {content.description}
                        </Text>
                      </View>

                      <View style={styles.recommendationsContainer}>
                        <Text style={styles.sectionTitle}>
                          Recomendaciones:
                        </Text>
                        {content.recommendations.map((rec, index) => (
                          <View key={index} style={styles.recommendationItem}>
                            <FontAwesomeIcon
                              icon={faStar}
                              size={16}
                              color="#FFD700"
                              style={styles.recommendationIcon}
                            />
                            <Text style={styles.recommendationText}>
                              {rec}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                )
            )}
          </BottomSheetScrollView>
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
    backgroundColor: "#000",
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
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  carouselContainer: {
    width: "100%",
    height: width * (9 / 16),
    position: "relative",
  },
  scrollViewContent: {
    height: "100%",
  },
  carouselImage: {
    width: width,
    height: "100%",
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
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "white",
  },
  infoContainer: {
    padding: 16,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
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
    color: "#333",
    lineHeight: 24,
  },
  recommendationsContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  recommendationIcon: {
    marginRight: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});

export default BottomSheetComponent;