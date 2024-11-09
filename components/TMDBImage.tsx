import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
interface TMDBImageProps {
  uri: string;
}

const TMDBImage: React.FC<TMDBImageProps> = ({ uri }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <View style={styles.container}>
      {(loading || error) && (
        <View style={styles.placeholder}>
          <ActivityIndicator size="large" color="#5c5c5c" />
        </View>
      )}
      <Image
        key={uri} // Força a re-renderização da imagem ao mudar o URI
        style={styles.image}
        source={{ uri}}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        contentFit='cover' // Define o modo de redimensionamento
        cachePolicy={'memory'} // Define o modo de redimensionamento
       
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 100,
    height: 150,
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
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
