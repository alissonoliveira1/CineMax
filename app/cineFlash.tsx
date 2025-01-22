
import { View, Animated, StyleSheet,Dimensions } from "react-native";
import { useState, useRef } from "react";

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

});
