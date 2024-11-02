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
        <ActivityIndicator size="large" color="#5c5c5c" />
      </View>
    )}
    <Image
    style={styles.image}
    source={{
      uri: uri,
      cache: "reload"
    }}
    onLoad={() => setLoading(false)}
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
    width: '100%' ,  
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