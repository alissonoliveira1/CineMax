import React, { useCallback, useEffect, useRef, useState } from "react";
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
import Music from "../assets/icons/music-player.svg";
import User from "../assets/images/person-circle.svg";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        toValue: isVisible ? 0 : 600,
        duration: 600,
        useNativeDriver: true,
      }),

      Animated.timing(blurOpacity, {
        toValue: isVisible ? 1 : 0,
        duration: 600,
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
        toValue: 600,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        setShouldRender(false);
      });

      Animated.timing(blurOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [isMenuVisible]);

  if (!shouldRender) return null;

  const handleOutsidePress = () => {
    toggleMenu(false);
  };
const sairConta = async () => {
  signOut(auth).then(() => {
    
    router.push("/loginHome")
    toggleMenu(false);
  })
  await AsyncStorage.removeItem('valorButtonPerfil');
  
}

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <Animated.View>
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
          <View
            style={{
              width: width,
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
             
            }}
          >
            <View
              style={{
                width: 90,
                height: 10,
                borderRadius: 10,
                backgroundColor: "#585858",
              }}
            ></View>
          </View>
          <View style={styles.ContFilho}>
            <TouchableOpacity
              onPress={() => {toggleMenu(false), router.push("/perfil")}}
              style={styles.options}
            >
              <View style={styles.ViewIcon}>
                <Pencil color={"#e0e0e0"} width={"100%"} height={25} />
              </View>
              <Text style={styles.text}>Editar perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options}>
              <View style={styles.ViewIcon}>
                <Music color={"#e0e0e0"} width={"100%"} height={25} />
              </View>
              <Text style={styles.text}>Mudar para musica</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options}>
              <View style={styles.ViewIcon}>
                <Gear color={"#e0e0e0"} width={"100%"} height={25} />
              </View>
              <Text style={styles.text}>Configurações do aplicativo</Text>
            </TouchableOpacity>
           
            <TouchableOpacity style={styles.options}>
              <View style={styles.ViewIcon}>
                <Question color={"#e0e0e0"} width={"100%"} height={25} />
              </View>
              <Text style={styles.text}>Ajuda</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={sairConta}
              style={styles.options}
            >
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
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    backgroundColor: "#2c2c2c",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  text: {
    color: "#e0e0e0",
    fontSize: 17,
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
    width:width,
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
