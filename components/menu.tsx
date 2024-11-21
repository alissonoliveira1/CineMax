import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
const width = Dimensions.get("window").width;
import Home from "../assets//images/house-door-fill.svg";
import Favoritos from "../assets//images/star-fill.svg";
import Conta from "../assets//images/person-circle.svg";
interface MenuProps {
  isVisible: boolean;
}

const Menu: React.FC<MenuProps> = ({ isVisible }) => {
  const [barra, setBarra] = useState("home");
  const router = useRouter();
  const translateY = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? 0 : 100,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: translateY }],
        },
      ]}
    >
      <TouchableOpacity
        onPressIn={() => router.push("/")}
        onPress={() => setBarra("home")}
        style={styles.optMenu}
      >
        <Home
          width={23}
          height={23}
          color={barra === "home" ? "white" : "#a7a7a7"}
        />
        <Text style={styles.optText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPressIn={() => router.push("/favoritos")}
        onPress={() => setBarra("favoritos")}
        style={styles.optMenu}
      >
        <Favoritos
          color={barra === "favoritos" ? "white" : "#a7a7a7"}
          width={23}
          height={23}
        />
        <Text style={styles.optText}>Favoritos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setBarra("conta")}
        style={styles.optMenu}
      >
        <Conta
          color={barra === "conta" ? "white" : "#a7a7a7"}
          width={23}
          height={23}
        />
        <Text style={styles.optText}>Conta</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#000000b9",
    padding: 10,
    zIndex: 40,
    bottom: 0,
    position: "absolute",
  },
  optMenu: {
    alignItems: "center",
    justifyContent: "center",
  },
  optText: {
    color: "white",
    marginTop: 4,
    fontSize: 10,
  },
});
