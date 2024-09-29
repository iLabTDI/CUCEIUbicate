import React, { useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';

export const ImageWithLoadingIndicator = ({ source, style }) => {
  const [loading, setLoading] = useState(true); // Estado para controlar la carga

  return (
    <View style={style}>
      {loading && (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
      )}
      <Image
        source={source}
        style={[style, loading && { display: 'none' }]} // Oculta la imagen mientras se carga
        onLoad={() => setLoading(false)} // Actualiza el estado cuando la imagen ha cargado
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12, 
    marginTop: -12,  
    // backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});


