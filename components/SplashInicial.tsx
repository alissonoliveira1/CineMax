import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useUser } from "@/hooks/hookUser";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function SplashCineMax() {
  const router = useRouter();
  const { user, dadosUser } = useUser();
  const textOpacity = useSharedValue(0);
  const vignetteOpacity = useSharedValue(0);
  const vignetteScale = useSharedValue(1);

  

  useEffect(() => {
    // Sequência de animações
    textOpacity.value = withSequence(
      withTiming(1.3, { duration: 1000, easing: Easing.out(Easing.exp) }), // Aparece
      withDelay(1000, withTiming(0, { duration: 1000 })) // Desaparece
    );

    vignetteOpacity.value = withDelay(
      2000, // Tempo para a vinheta aparecer
      withTiming(1, { duration: 500, easing: Easing.ease })
    );

    vignetteScale.value = withDelay(
      2000,
      withTiming(10, { duration: 1200, easing: Easing.inOut(Easing.ease) }) // Expande a vinheta
    );
  }, []);

  useEffect(() => {
    // Navegação após carregamento do estado do usuário
    const timer = setTimeout(() => {
      
    }, 3200); // Espera o tempo necessário para as animações terminarem

    return () => clearTimeout(timer); // Evita vazamentos de memória
  }, [ dadosUser, router]);

  // Estilos animados
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ scale: textOpacity.value }],
  }));

  const vignetteStyle = useAnimatedStyle(() => ({
    opacity: vignetteOpacity.value,
    transform: [{ scale: vignetteScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Nome CineMax */}
      <Animated.Image
        source={require("@/assets/images/CineMaxTrans.png")}
        style={[styles.text, textStyle]}
        resizeMode="contain" // Garante que a imagem mantenha proporção
      />

      {/* Vinheta */}
      <Animated.View style={[styles.vignette, vignetteStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a1104", // Fundo da tela principal
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    width: 250,
    height: 250,
    backgroundColor: "transparent", // Garante fundo transparente
    position: "absolute",
    zIndex: 10,
  },
  vignette: {
    position: "absolute",
    width: width - 200,
    height: height - 450,
    borderRadius: 9999,
    backgroundColor: "#fff",
    zIndex: 5,
  },
});
