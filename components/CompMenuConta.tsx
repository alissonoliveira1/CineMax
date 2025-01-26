import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { BlurView } from "expo-blur";
import { useMenu } from "@/context/MenuContext";
import Pencil from "../assets/images/pencil-fill.svg";
import Gear from "../assets/images/gear-wide.svg";
import Arrow from "../assets/images/box-arrow-right.svg";
import Question from "../assets/images/question-circle.svg";
import User from "../assets/images/person-circle.svg";
import { useRouter } from "expo-router";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const MenuConta = () => {
  const { isMenuVisible, toggleMenu } = useMenu(); 
  const translateY = useRef(new Animated.Value(100)).current; 
  const blurOpacity = useRef(new Animated.Value(0)).current; 
  const [shouldRender, setShouldRender] = useState(isMenuVisible);
  const router = useRouter();
 
  const animateMenu = (isVisible: boolean) => {
    Animated.parallel([
    
      Animated.timing(translateY, {
        toValue: isVisible ? 0 : 100, 
        duration: 300,
        useNativeDriver: true,
      }),

      
      Animated.timing(blurOpacity, {
        toValue: isVisible ? 1 : 0,
        duration: 300,
        useNativeDriver: true, 
      }),
    ]).start();
  };

  useEffect(() => {
    if (isMenuVisible) {
      setShouldRender(true); 
      animateMenu(true); 
    } else {
 
      Animated.timing(translateY, {
        toValue: 100, 
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShouldRender(false);
      });
      
      Animated.timing(blurOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isMenuVisible]); 

  if (!shouldRender) return null; 

  const handleOutsidePress = () => {
    
    toggleMenu(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
    
        <Animated.View
          style={[
            styles.blurContainer,
            {
              opacity: blurOpacity,
            },
          ]}
        >
          <BlurView
            intensity={10} 
            style={styles.blurContainer}
            experimentalBlurMethod="dimezisBlurView"
          />
        </Animated.View>

      
        <Animated.View
          style={[
            styles.container2,
            {
              transform: [{ translateY: translateY }],
            },
          ]}
        >
          <View style={styles.ContFilho}>
            <TouchableOpacity style={styles.options}>
              <View style={styles.ViewIcon}>
                <Pencil color={"#ffffff"} width={"100%"} height={25} />
              </View>
              <Text style={styles.text}>Editar perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options}>
              <View style={styles.ViewIcon}>
                <Gear color={"#ffffff"} width={"100%"} height={25} />
              </View>
              <Text style={styles.text}>Configurações do aplicativo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options}>
              <View style={styles.ViewIcon}>
                <User color={"#ffffff"} width={"100%"} height={25} />
              </View>
              <Text style={styles.text}>Conta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options}>
              <View style={styles.ViewIcon}>
                <Question color={"#ffffff"} width={"100%"} height={25} />
              </View>
              <Text style={styles.text}>Ajuda</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => signOut(auth).then(() => router.push('/loginHome'))} style={styles.options}>
              <View style={styles.ViewIcon}>
                <Arrow color={"#ffffff"} width={"120%"} height={25} />
              </View>
              <Text style={styles.text}>Sair</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MenuConta;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    justifyContent: "flex-end",
    position: "absolute",
    height: height,
    width: width,
    zIndex: 50,
  },
  blurContainer: {
    width: width,
    flex: 1,
    position: "absolute",
    height: "100%",
    alignItems: "center",
    zIndex: 50,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  container2: {
    width: width,
    height: 320,
    zIndex: 60,
    borderTopEndRadius: 35,
    borderTopStartRadius: 35,
    backgroundColor: "#2c2c2c",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  text: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  ContFilho: {
    width: "90%",
    height: 300,
    justifyContent: "flex-start",
    gap: 20,
    alignItems: "flex-start",
    marginTop: 20,
  },
  options: {
    flexDirection: "row",
  },
  ViewIcon: {
    width: 30,
    height: 30,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginRight: 10,
  },
});
