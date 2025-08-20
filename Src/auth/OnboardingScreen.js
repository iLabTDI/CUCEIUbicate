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
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

const onboardingData = [
  {
    id: '1',
    title: 'Bienvenido a CUCEI Ubícate!',
    description: 'Descubre cómo navegar por el campus universitario con facilidad y encontrar todo lo que necesitas.',
    animation: require('../assets/animations/Student.json'),
  },
  {
    id: '2',
    title: 'Encuentra tu camino',
    description: 'Localiza aulas, módulos y servicios rápidamente con nuestro sistema de navegación inteligente.',
    animation: require('../assets/animations/Ubicacion.json'),
  },
  {
    id: '3',
    title: 'Mantente informado',
    description: 'Recibe notificaciones importantes y accede a toda la información del campus en tiempo real.',
    animation: require('../assets/animations/Camino.json'),
  },
];

const OnboardingItem = ({ item, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: index * 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: index * 200,
        easing: Easing.out(Easing.back(1.7)),
        useNativeDriver: true,
      }),
    ]).start();

    // Animación flotante continua
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const floatingTransform = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <Animated.View 
      style={[
        styles.itemContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Animated.View 
        style={[
          styles.animationContainer,
          {
            transform: [{ translateY: floatingTransform }],
          },
        ]}
      >
        <LottieView
          source={item.animation}
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
      </Animated.View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </Animated.View>
  );
};

export const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const [bgAnim] = useState(new Animated.Value(0));
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animación del fondo
    Animated.loop(
      Animated.timing(bgAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const scrollTo = async () => {
    animateButton();
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      try {
        await AsyncStorage.setItem('@onboarding_completed', 'true');
        navigation.replace('Login');
      } catch (err) {
        console.log('Error al guardar el estado de onboarding', err);
      }
    }
  };

  const skip = async () => {
    try {
      await AsyncStorage.setItem('@onboarding_completed', 'true');
      navigation.replace('Login');
    } catch (err) {
      console.log('Error al guardar el estado de onboarding', err);
    }
  };

  // Gradiente animado de fondo
  const bgColor = bgAnim.interpolate({
    inputRange: [0, 0.3, 0.6, 1],
    outputRange: ["#e8f2ff", "#f0f6ff", "#e3e9fa", "#f4f8ff"],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Fondo animado con gradiente dinámico */}
      <Animated.View style={[styles.animatedBg, { backgroundColor: bgColor }]} />
      
      <Animated.FlatList
        data={onboardingData}
        renderItem={({ item, index }) => <OnboardingItem item={item} index={index} />}
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
        <TouchableOpacity style={styles.skipButton} onPress={skip} activeOpacity={0.7}>
          <Text style={styles.skipButtonText}>Saltar</Text>
        </TouchableOpacity>
        
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [12, 30, 12],
              extrapolate: 'clamp',
            });
            
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });
            
            return (
              <Animated.View
                style={[
                  styles.dot,
                  { width: dotWidth, opacity },
                  index === currentIndex && styles.dotActive,
                ]}
                key={index.toString()}
              />
            );
          })}
        </View>
        
        <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
          <TouchableOpacity style={styles.nextButton} onPress={scrollTo} activeOpacity={0.85}>
            <View style={styles.nextButtonGradient}>
              <Text style={styles.nextButtonText}>
                {currentIndex === onboardingData.length - 1 ? 'Comenzar' : 'Siguiente'}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Fondo animado
  animatedBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  
  // Container principal
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  
  // Item container con animaciones mejoradas
  itemContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  
  // Contenedor de animación flotante más grande y centrado
  animationContainer: {
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: (width * 0.85) / 2,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 80,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 1,
    borderColor: "rgba(208, 216, 246, 0.3)",
    alignSelf: 'center',
  },
  
  lottieAnimation: {
    width: width * 0.75,
    height: width * 0.75,
  },
  
  // Contenedor de texto con glassmorphism
  textContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 24,
    padding: isTablet ? 32 : 24,
    marginHorizontal: 20,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 80,
    borderWidth: 1,
    borderColor: "rgba(208, 216, 246, 0.4)",
    backdropFilter: "blur(10px)",
  },
  
  title: {
    fontSize: isTablet ? 32 : 26,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
    color: '#0b34b0',
    letterSpacing: 1.2,
    textShadowColor: "rgba(11, 52, 176, 0.15)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  
  description: {
    fontSize: isTablet ? 18 : 16,
    textAlign: 'center',
    color: '#64748b',
    lineHeight: isTablet ? 28 : 24,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  
  // Bottom container mejorado
  bottomContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0b34b0',
    marginHorizontal: 6,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  
  dotActive: {
    backgroundColor: '#0b34b0',
    shadowOpacity: 0.5,
  },
  
  // Botón siguiente con gradiente
  nextButton: {
    borderRadius: 16,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  
  nextButtonGradient: {
    backgroundColor: "#0b34b0",
    paddingVertical: isTablet ? 16 : 14,
    paddingHorizontal: isTablet ? 32 : 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  
  // Botón saltar mejorado
  skipButton: {
    paddingVertical: isTablet ? 16 : 14,
    paddingHorizontal: isTablet ? 24 : 20,
    borderRadius: 16,
    backgroundColor: "rgba(11, 52, 176, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(11, 52, 176, 0.2)",
  },
  
  skipButtonText: {
    color: '#0b34b0',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default OnboardingScreen;