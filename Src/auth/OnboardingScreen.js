import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Bienvenido a CUCEI Ubícate!',
    description: 'Descubre cómo navegar por el campus universitario con facilidad.',
    animation: require('../assets/animations/Student.json'),
    gradient: ['#4e54c8', '#8f94fb'],
  },
  {
    id: '2',
    title: 'Encuentra tu camino',
    description: 'Localiza aulas, módulos y servicios rápidamente.',
    animation: require('../assets/animations/Ubicacion.json'),
    gradient: ['#11998e', '#38ef7d'],
  },
  {
    id: '3',
    title: 'Mantente informado',
    description: 'Recibe notificaciones importantes y accede a toda la información del campus.',
    animation: require('../assets/animations/Camino.json'),
    gradient: ['#f953c6', '#b91d73'],
  },
];

const OnboardingItem = ({ item, index, scrollX }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
  });

  return (
    <Animated.View style={[styles.itemContainer, { opacity }]}>
      <LinearGradient
        colors={item.gradient}
        style={styles.gradientBackground}
      />
      <LottieView
        source={item.animation}
        autoPlay
        loop
        style={styles.lottieAnimation}
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </Animated.View>
  );
};

export const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef();
  const navigation = useNavigation();

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = async () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      try {
        await AsyncStorage.setItem('@onboarding_complete', 'true');
        navigation.replace('Login');
      } catch (err) {
        console.log('Error al guardar el estado de onboarding', err);
      }
    }
  };

  const skip = async () => {
    try {
      await AsyncStorage.setItem('@onboarding_complete', 'true');
      navigation.replace('Login');
    } catch (err) {
      console.log('Error al guardar el estado de onboarding', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        data={onboardingData}
        renderItem={({ item, index }) => (
          <OnboardingItem item={item} index={index} scrollX={scrollX} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        ref={flatListRef}
      />
      <View style={styles.bottomContainer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 20, 10],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                style={[styles.dot, { width: dotWidth, opacity }]}
                key={index.toString()}
              />
            );
          })}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={skip}>
            <Text style={styles.skipButtonText}>Saltar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={scrollTo}>
            <Text style={styles.nextButtonText}>
              {currentIndex === onboardingData.length - 1 ? 'Comenzar' : 'Siguiente'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  itemContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  lottieAnimation: {
    width: width * 0.8,
    height: width * 0.8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nextButtonText: {
    color: '#0b34b0',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;