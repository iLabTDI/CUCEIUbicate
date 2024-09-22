import React, { useRef, useCallback, useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar, faComment, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { bottomSheetContents } from "./bottomSheetContents";

const { width, height } = Dimensions.get("window");

export const BottomSheetComponent = React.forwardRef(
  ({ snapPoints, selectedPoint, isVisible, onClose }, ref) => {
    const bottomSheetRef = useRef(null);
    const [newComment, setNewComment] = useState("");
    const [isCommentInputVisible, setIsCommentInputVisible] = useState(false);
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

    const renderStars = (rating) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            size={16}
            color={i <= rating ? "#FFD700" : "#D3D3D3"}
          />
        );
      }
      return stars;
    };

    const handleAddComment = () => {
      console.log("Nuevo comentario:", newComment);
      setNewComment("");
      setIsCommentInputVisible(false);
    };

    const renderImageCarousel = (images) => {
      return (
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const slideWidth = event.nativeEvent.layoutMeasurement.width;
              const index = event.nativeEvent.contentOffset.x / slideWidth;
              setCurrentImageIndex(Math.round(index));
            }}
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
          <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
            {bottomSheetContents.map(
              (content) =>
                selectedPoint === content.id && (
                  <View key={content.id} style={styles.contentContainer}>
                    <Text style={styles.title}>{content.id}</Text>
                    {renderImageCarousel(content.images)}
                    <Text style={styles.description}>{content.description}</Text>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingText}>Calificación: </Text>
                      {renderStars(content.rating)}
                      <Text style={styles.ratingNumber}>({content.rating})</Text>
                    </View>
                    <View style={styles.recommendationsContainer}>
                      <Text style={styles.sectionTitle}>Recomendaciones:</Text>
                      {content.recommendations.map((rec, index) => (
                        <Text key={index} style={styles.recommendationText}>• {rec}</Text>
                      ))}
                    </View>
                    <View style={styles.commentsContainer}>
                      <Text style={styles.sectionTitle}>Comentarios:</Text>
                      {content.comments.map((comment, index) => (
                        <View key={index} style={styles.commentBox}>
                          <Text style={styles.commentUser}>{comment.user}</Text>
                          <Text style={styles.commentText}>{comment.text}</Text>
                        </View>
                      ))}
                    </View>
                    {isCommentInputVisible ? (
                      <View style={styles.commentInputContainer}>
                        <TextInput
                          style={styles.commentInput}
                          placeholder="Escribe tu comentario..."
                          value={newComment}
                          onChangeText={setNewComment}
                          multiline
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
                          <FontAwesomeIcon icon={faPaperPlane} size={16} color="#0066CC" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={styles.addCommentButton}
                        onPress={() => setIsCommentInputVisible(true)}
                      >
                        <FontAwesomeIcon icon={faComment} size={16} color="#0066CC" />
                        <Text style={styles.addCommentText}>Agregar comentario</Text>
                      </TouchableOpacity>
                    )}
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
    backgroundColor: 'white',
  },
  bottomSheetIndicator: {
    backgroundColor: '#0066CC',
    padding: 4,
    width: 50,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  bottomSheetContent: {
    padding: 16,
  },
  contentContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  carouselContainer: {
    width: width * 0.9,
    height: height * 0.25,
    marginBottom: 16,
  },
  carouselImage: {
    width: width * 0.9,
    height: height * 0.25,
    borderRadius: 8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'white',
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  ratingNumber: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  recommendationsContainer: {
    width: '100%',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  commentsContainer: {
    width: '100%',
    marginBottom: 16,
  },
  commentBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  addCommentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  addCommentText: {
    color: '#0066CC',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
    width: '100%',
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  sendButton: {
    marginLeft: 8,
  },
});

export default BottomSheetComponent;