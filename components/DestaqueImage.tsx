import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Image } from "expo-image";
interface TMDBImageProps {
  uri: string;
}

const DestaqueImage: React.FC<TMDBImageProps> = ({ uri }) => {
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
        source={{ uri: uri }}
        cachePolicy={'memory'}
        priority={'high'}
        contentFit="cover"
        onLoad={() => setLoading(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 150,
    height: 270,
    borderRadius: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#02082c",
    borderRadius: 5,
  },
});

export default React.memo(DestaqueImage);
