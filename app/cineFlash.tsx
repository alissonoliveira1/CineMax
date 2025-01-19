import Menu from "@/components/menu";
import { View, Text, Animated, StyleSheet, SafeAreaView,Dimensions } from "react-native";
import { useRef, useState, useEffect } from "react";
import api from "@/services";
import { Image } from "expo-image";
import YoutubePlayer from "react-native-youtube-iframe";
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const CineFlash = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const [menuVisible, setMenuVisible] = useState(true);
  const [filme, setFilme] = useState([])
  const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";
  
  










  const scrollRoda = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;

        if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
          setMenuVisible(false);
        } else if (currentScrollY < lastScrollY.current) {
          setMenuVisible(true);
        }

        lastScrollY.current = currentScrollY;
      },
    }
  );
  return (
  <View style={styles.container}>
    <Image source={require("../assets/images/backFlash.jpeg")} style={styles.image}/>
      <YoutubePlayer
      
      webViewStyle={{ zIndex: 2,}}
    height={300} // Ajusta à altura total da tela
    width={screenWidth} // Ajusta à largura total da tela
    videoId={"iee2TATGMyI"}
    play={true}
    forceAndroidAutoplay={true}
    initialPlayerParams={{
      controls: false,
      modestbranding: true,
      rel: false,
    
  
    }}
   
  />
  </View>
  );
};

export default CineFlash;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(95, 199, 3)",
    flex: 1,
  },
  image:{
    position: "absolute",
    flex: 1,
    zIndex: 1,
    top: 0,
    width: screenWidth,
    height: screenHeight,
  }
});
