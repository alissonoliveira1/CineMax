import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useUser } from "@/hooks/hookUser";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");
export default function Index() {  
  const { dadosUser } = useUser();
  const router = useRouter();
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
     

      const timer = setTimeout(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!user) {
            router.replace("/loginHome",);
          }  else {
            console.log("Usuário autenticadobabaca:", user.uid);
        
            AsyncStorage.setItem('UserID', JSON.stringify(user.uid)); 
            router.replace("/perfilHome");
          }
        });
        return () => unsubscribe();
      }, 3200); // Espera o tempo necessário para as animações terminarem
  
      return () => clearTimeout(timer); // Evita vazamentos de memória
    }, [ dadosUser, router]);
  
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
  



