import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useGlobalSearchParams } from "expo-router";
import * as ScreenOrientation from 'expo-screen-orientation';

export default function VideoPlayer() {
  const params = useGlobalSearchParams();
  const { imdb_id, temp, ep } = params;
  console.log(imdb_id, temp, ep);

  // Função para bloquear qualquer URL (incluindo a inicial)
  const handleShouldStartLoadWithRequest = (request: any) => {
    console.log('Tentando carregar URL:', request.url);

    // Bloqueia todas as URLs, incluindo a URL original
    return false;
  };

  const changeScreenOrientation = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  };

  const resetScreenOrientation = async () => {
    await ScreenOrientation.unlockAsync();
  };

  useEffect(() => {
    changeScreenOrientation();

    return () => {
      resetScreenOrientation();
    };
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: `https://superflixapi.dev/serie/${imdb_id}/${temp}/${ep}` }}
        style={styles.webview}
        javaScriptEnabled={true}  // Habilita JavaScript para funcionalidades
        domStorageEnabled={true}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}  // Bloqueia qualquer navegação
        startInLoadingState={true}  // Exibe a tela de carregamento até carregar
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
