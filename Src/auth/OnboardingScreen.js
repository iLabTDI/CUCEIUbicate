import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const onboardingData = [
    {
        id: '1',
        title: 'Bienvenido a CUCEI Ubícate!',
        description: 'Descubre cómo navegar por el campus universitario con facilidad.',
        animation: require('../assets/animations/Student.json'),
    },
    {
        id: '2',
        title: 'Encuentra tu camino',
        description: 'Localiza aulas, módulos y servicios rápidamente.',
        animation: require('../assets/animations/Ubicacion.json'),
    },
    {
        id: '3',
        title: 'Mantente informado',
        description: 'Recibe notificaciones importantes y accede a toda la información del campus.',
        animation: require('../assets/animations/Camino.json'),
    },
];

// Componente que renderiza cada elemento del onboarding
const OnboardingItem = ({ item, index, scrollX }) => {
  // Define el rango de entrada para la animación
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  
  // Estilo animado para el elemento de onboarding
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      interpolate.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      interpolate.CLAMP
    );
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.itemContainer, animatedStyle]}>
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

// Componente que renderiza los puntos (indicadores) del onboarding
const Paginator = ({ data, scrollX }) => {
  return (
    <View style={styles.paginatorContainer}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        
        // Estilo animado para los puntos de paginación
        const animatedDotStyle = useAnimatedStyle(() => {
          const width = interpolate(
            scrollX.value,
            inputRange,
            [10, 20, 10],
            interpolate.CLAMP
          );
          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.3, 1, 0.3],
            interpolate.CLAMP
          );
          return { width, opacity };
        });

        return (
          <Animated.View
            key={`dot-${i}`}
            style={[styles.dot, animatedDotStyle]}
          />
        );
      })}
    </View>
  );
};

// Pantalla principal del onboarding
export const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // Índice del slide actual
  const scrollX = useSharedValue(0); // Valor compartido para el desplazamiento horizontal
  const flatListRef = useRef(); // Referencia al FlatList
  const navigation = useNavigation(); // Hook de navegación

  // Manejador de scroll utilizando Reanimated 2
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // Manejador para el cambio de elementos visibles en el FlatList
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  // Configuración para determinar qué elementos son visibles
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // Función para manejar el botón de 'Siguiente' o 'Comenzar'
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
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={flatListRef}
      />
      <Paginator data={onboardingData} scrollX={scrollX} />
      <TouchableOpacity style={styles.nextButton} onPress={scrollTo}>
        <Text style={styles.nextButtonText}>
          {currentIndex === onboardingData.length - 1 ? 'Comenzar' : 'Siguiente'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  itemContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lottieAnimation: {
    width: width * 0.9,
    height: width * 0.9,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    color: '#666666',
  },
  paginatorContainer: {
    flexDirection: 'row',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0b34b0',
    marginHorizontal: 8,
  },
  nextButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#0b34b0',
    padding: 15,
    borderRadius: 30,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;