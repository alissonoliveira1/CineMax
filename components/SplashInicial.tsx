import { useCallback, useEffect, useState } from "react";
import { View, Image, Dimensions } from "react-native";
import * as SplashScreen from "expo-splash-screen";
const { width } = Dimensions.get("window");

export default function AplashInicial() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        
        await new Promise((resolve) => setTimeout(resolve, 5000)); 
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: "#003174",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
      onLayout={onLayoutRootView}
    >
      <Image style={{width:width}} resizeMode="contain" source={require("../assets/images/splash_logo.png")} />
    </View>
  );
}
