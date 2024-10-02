import React, { useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';

interface TMDBImageProps {
  uri: string;
}

const TMDBImage: React.FC<TMDBImageProps> = ({ uri }) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.placeholder}>
          {/* Você pode personalizar este indicador ou usar outra View como placeholder */}
          <ActivityIndicator  size="large" color="#5c5c5c" />
        </View>
      )}
     <Image
        source={{ uri }}
        style={styles.image}
        onLoadEnd={() => setLoading(false)}  // A imagem terminou de carregar
        onError={() => setLoading(false)}    // Em caso de erro ao carregar a imagem
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 100,   // Defina o tamanho conforme sua necessidade
    height: 150, 
    borderRadius: 5, // Defina o tamanho conforme sua necessidade
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    resizeMode: 'cover',
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#02082c',
    borderRadius: 5,
  },
});

export default React.memo(TMDBImage);