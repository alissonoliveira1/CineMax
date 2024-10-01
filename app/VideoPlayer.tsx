import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Video } from 'expo-av';

export default function VideoPlayer() {
  return (
    <View style={styles.container}>
      <Video
        source={{ uri: 'https://superflixapi.dev/serie/84958/1/1#noEpList' }} // Substitua pela URL do seu vídeo
        rate={1.0}
        volume={1.0}
        isMuted={false}
      
        shouldPlay
        style={styles.video}
        useNativeControls
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 300,
  },
});