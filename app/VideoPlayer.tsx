import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useGlobalSearchParams } from "expo-router";
import * as ScreenOrientation from 'expo-screen-orientation';
export default function VideoPlayer() {
  const params = useGlobalSearchParams();
  const { imdb_id, temp, ep } = params;
  console.log(imdb_id, temp, ep);

  const changeScreenOrientation = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  };

  // Restaurar a orientação padrão ao sair da tela
  const resetScreenOrientation = async () => {
    await ScreenOrientation.unlockAsync(); // Volta à orientação padrão do app
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
        source={{ uri: `https://superflixapi.dev/serie/${imdb_id}/${temp}/${ep}` }} // URL da página a ser carregada
        style={styles.webview}
        javaScriptEnabled={true} // Habilita JavaScript
        domStorageEnabled={true} // Habilita o armazenamento local
        startInLoadingState={true} // Mostra um indicador de carregamento enquanto a página está sendo carregada
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1, // Ocupa todo o espaço disponível
  },
});