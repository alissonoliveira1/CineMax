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
  page:any
}

const Menu: React.FC<MenuProps> = ({ isVisible, page }) => {
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
        onPress={() => router.push("/")}
     
        style={styles.optMenu}
      >
        <Home
          width={21}
          height={21}
          color={page === "home" ? "white" : "#a7a7a7"}
        />
        <Text style={styles.optText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/favoritos")}
      
        style={styles.optMenu}
      >
        <Favoritos
          color={page === "favoritos" ? "white" : "#a7a7a7"}
          width={21}
          height={21}
        />
        <Text style={styles.optText}>Favoritos</Text>
      </TouchableOpacity>
      <TouchableOpacity
   
        style={styles.optMenu}
      >
        <Conta
          color={page === "conta" ? "white" : "#a7a7a7"}
          width={21}
          height={21}
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
    alignItems: "flex-start",
    justifyContent: "space-around",
    backgroundColor: "#000000b9",
    paddingTop: 7,
    paddingBottom: 5,
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
