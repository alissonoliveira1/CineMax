import { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import Plus from "@/assets/images/plus-lg.svg";
import Camera from "@/assets/icons/camera-reels.svg";
import Music from "@/assets/icons/music-player.svg";
import Pencil from "@/assets/images/pencil-fill.svg";
import Start from "@/assets/images/star-fill.svg";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
export const MenuBalao = () => {
  const [menuVisible, setMenuVisible] = useState(true);
  const animation1 = useRef(new Animated.Value(0)).current;
  const animation2 = useRef(new Animated.Value(0)).current;
  const animation3 = useRef(new Animated.Value(0)).current;
  const animation4 = useRef(new Animated.Value(0)).current;
  const animation5 = useRef(new Animated.Value(0)).current;
  const handleAnimation = () => {
    Animated.parallel([
      Animated.timing(animation5, {
        toValue: menuVisible ? 1 : 0,
        duration: 1000,
        useNativeDriver: false,
      }),

      Animated.timing(animation1, {
        toValue: menuVisible ? -70 : 0,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.timing(animation2, {
        toValue: menuVisible ? -140 : 0,
        duration: 700,
        useNativeDriver: false,
      }),
      Animated.timing(animation3, {
        toValue: menuVisible ? -210 : 0,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(animation4, {
        toValue: menuVisible ? -280 : 0,
        duration: 900,
        useNativeDriver: false,
      }),
    ]).start(() => setMenuVisible(!menuVisible));
  };

  const rotateInterpolation = animation5.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "315deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <Animated.View
          style={[styles.opcoes, { transform: [{ translateY: animation4 }] }]}
        >
          <Start width={25} height={25} color={"white"} />
        </Animated.View>
        <Animated.View
          style={[styles.opcoes, { transform: [{ translateY: animation3 }] }]}
        >
          
          <Pencil width={25} height={25} color={"white"} />
        </Animated.View>
        <Animated.View
          style={[styles.opcoes, { transform: [{ translateY: animation2 }] }]}
        >
          <Music width={25} height={25} color={"white"} />
        </Animated.View>
        <Animated.View
          style={[styles.opcoes, { transform: [{ translateY: animation1 }] }]}
        >
          <Camera width={25} height={25} color={"white"} />
        </Animated.View>
        <TouchableOpacity
          onPress={handleAnimation}
          style={[styles.opcoes, { zIndex: 20 }]}
        >
          <Animated.View
            style={{ transform: [{ rotate: rotateInterpolation }] }}
          >
            <Plus width={40} height={40} color={"white"} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: width * 0.2,
    height: height - 200,

    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  container2: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.2,
    height: height - 200,

    paddingBottom: 80,
    gap: 10,
  },
  opcoes: {
    width: 55,
    height: 55,
    position: "absolute",
    bottom: 80,
    zIndex: 10,
    borderRadius: 35,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
});
