import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  TextInput,
} from "react-native";
import { useRegister } from "@/hooks/hookRegister";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import Exit from "../assets/icons/exit.svg";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginHome = () => {
  const { setConta } = useRegister();
  const router = useRouter();
  const [StateDots, setStateDots] = useState("0");
  const flatListRef = useRef<FlatList>(null);
  const translety = useRef(new Animated.Value(0)).current;
  const [isUp, setIsUp] = useState(false);
  const teclado = useRef<TextInput>(null);
  const [changeText, setChangeText] = useState("");
  const [active, setactive] = useState(false);
  const [validaremail, setValidarEmail] = useState<null | boolean>(null);
  const [numError, setNumError] = useState<number | null>(null);

  const inicioAnima = () => {
    Animated.timing(translety, {
      toValue: isUp ? 0 : -height,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      if (!isUp) {
        teclado.current?.focus();
      } else {
        teclado.current?.blur();
      }
      setIsUp(!isUp);
    });
  };

  const renderError = () => {
    switch (numError) {
      case 1: {
        return (
          <View>
            <Text style={styles.msgError}>O email é obrigatorio</Text>
          </View>
        );
      }
      case 2: {
        return (
          <View>
            <Text style={styles.msgError}>
              O endereço de email deve ter entre 5 e 50 caracteres
            </Text>
          </View>
        );
      }
      case 3: {
        return (
          <View>
            <Text style={styles.msgError}>insira um email valido</Text>
          </View>
        );
      }
      default:
        return null;
    }
  };

  const data = [
    {
      id: "1",
      image: "https://i.ibb.co/YXZPSHR/background-estilo-netflix-1.png",
      text: "Filmes, series e muito mais, sem limite",
      subtitle: "Assista onde quiser. Aproveite muito o app.",
    },
    {
      id: "2",
      image: "https://i.ibb.co/1qvBmgq/Design-sem-nome-5.png",
      text: "Assista onde quiser",
      subtitle: "Assista no celular, tablet, laptop ou tv.",
    },
    {
      id: "3",
      image: "https://i.ibb.co/4Kgw9SN/2.png",
      text: "Um streaming diferente",
      subtitle: "Filmes e series totalmente de graça. ",
    },
    {
      id: "4",
      image: "https://i.ibb.co/23FDdYs/3.png",
      text: "A Diversão Nunca Acaba!",
      subtitle: "Com uma vasta seleção de filmes e séries, para familia. ",
    },
  ];

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && Array.isArray(viewableItems)) {
      const visibleItem = viewableItems[0];
      if (visibleItem) {
        setStateDots(visibleItem.item.id);
        console.log("ID visível:", visibleItem.item.id);
      }
    }
  }).current;

  const handleDotPress = (id: string) => {
    setStateDots(id);
    const index = data.findIndex((item) => item.id === id);
    if (flatListRef.current && index !== -1) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  const colorLine = (text: string) => {
    setChangeText(text);
    
    if (!active) return;
 
    if (text === "") {
      setNumError(1);
      setValidarEmail(false);
    } else if (text.length <= 3) {
      setNumError(2);
      setValidarEmail(false);
    } else if (!emailRegex.test(text)) {
      setNumError(3);
      setValidarEmail(false);
    } else {
      setNumError(null);
      setValidarEmail(true);
      
    }
  };
  const pressRegister = () => {
    if (emailRegex.test(changeText)) {
      setConta({ nome: "", email: changeText, perfil: "" });
      router.push(`/register`);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.containerHeader}>
        <View style={styles.logoImg}>
          <Image
            style={styles.logoImg}
            source={require("../assets/images/CineMax.png")}
          />
        </View>
        <TouchableOpacity
          style={styles.buttonLogin}
          onPress={() => router.push(`/search`)}
        >
          <Text style={styles.textLogin}>Entrar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.viewTitle}>
              <Text style={styles.title}>{item.text}</Text>
            </View>
            <View style={styles.viewSubtitle}>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.containerButton}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 15,
            width: width,
            height: 30,
          }}
        >
          {data.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.dots,
                StateDots === item.id
                  ? { backgroundColor: "#ff6347" }
                  : { backgroundColor: "#9b9b9b" },
              ]}
              onPress={() => handleDotPress(item.id)}
            ></TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={inicioAnima} style={styles.button}>
          <Text style={styles.textButton}>Vamos lá</Text>
        </TouchableOpacity>
      </View>
      <Animated.View
        style={[
          styles.containerRegister,
          {
            transform: [{ translateY: translety }],
          },
        ]}
      >
        <View
          style={{
            width: width,
            height: 70,
            justifyContent: "center",
            alignItems: "flex-end",
            marginTop: 15,
            paddingRight: 25,
          }}
        >
          <TouchableOpacity onPress={inicioAnima}>
            <Exit width={32} height={32} color={"black"} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: width,
            height: 300,
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "700",
                width: width - 60,
                textAlign: "left",
              }}
            >
              Tudo pronto para assistir?
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                width: width - 60,
                textAlign: "left",
              }}
            >
              Informe um email para criar ou acessar sua conta
            </Text>
          </View>
          <View>
            <View
              style={[
                styles.containerInput,
                validaremail === null
                  ? { borderColor: "#a7a7a7" }
                  : validaremail === true
                  ? { borderColor: "green" }
                  : { borderColor: "red" },
              ]}
            >
              <Text style={{ fontSize: 12, color: "#747474" }}>Email</Text>
              <TextInput
                ref={teclado}
                value={changeText}
                onChangeText={colorLine}
                style={styles.input}
                placeholderTextColor={"#a7a7a7"}
                inputMode="email"
                keyboardType="email-address"
              />
            </View>
            {renderError()}
            <View style={styles.containerbuttonVL}>
              <TouchableOpacity
                onPress={() => setactive(true)}
                onPressIn={() => pressRegister()}
                style={styles.buttonVamosLa}
              >
                <Text style={styles.buttonVamosLaText}>VAMOS LÁ</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity style={styles.buttonGoogle}>
                <Image
                  style={styles.imgGoogle}
                  source={require("../assets/images/google.png")}
                />
                <Text
                  style={{ color: "#6d6d6d", fontSize: 17, fontWeight: "bold" }}
                >
                  Entrar com o google
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  imgGoogle: {
    width: 30,
    height: 30,
    objectFit: "contain",
  },
  buttonGoogle: {
    borderWidth: 1,
    borderColor: "#a7a7a7",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: width - 60,
    height: 50,
    gap: 15,
  },
  containerRegister: {
    position: "absolute",
    top: height,
    left: 0,
    right: 0,
    zIndex: 150,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    width: width,
    height: height,
    backgroundColor: "#ffffff",
  },
  containerInput: {
    padding: 7,
    borderColor: "#a7a7a7",
    position: "relative",
    borderRadius: 5,

    borderWidth: 1,
    width: width - 60,
    height: 60,
  },
  input: {
    width: width - 100,
    height: "100%",
    fontSize: 16,
    top: 23,
    left: 7,
    position: "absolute",
    padding: 0,
    textAlignVertical: "top",
  },
  msgError: {
    color: "red",
    fontSize: 12,
  },
  inputErro: {
    borderColor: "red",
  },
  buttonVamosLa: {
    width: width - 60,
    height: 50,
    backgroundColor: "#00ceb2",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonVamosLaText: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "500",
  },
  containerbuttonVL: {
    marginTop: 20,
  },
  containerHeader: {
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    paddingTop: 20,
    paddingRight: 10,
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 150,
    width: width,
    height: 70,
  },
  buttonLogin: {
    width: width * 0.3,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#00ceb2",
  },
  textLogin: {
    fontSize: 19,
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  containerButton: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 150,
    width: width,
    height: 150,
  },
  textButton: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    width: width - 30,
    height: 50,
    backgroundColor: "#00ceb2",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  slide: {
    alignItems: "center",
    paddingTop: 60,
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 10,
  },
  image: {
    position: "absolute",
    flex: 1,
    bottom: 0,
    width: width,
    height: height,
  },
  logoImg: {
    width: 150,
    height: 50,
    objectFit: "contain",
  },
  title: {
    width: width - 90,

    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold",
    color: "#ffffff",
  },
  viewTitle: {
    width: width,
    height: 150,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  viewSubtitle: {},
  subtitle: {
    width: width - 110,
    marginTop: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
    color: "#cacaca",
  },
  dots: {
    width: 11,
    height: 11,
    borderRadius: 5,
  },
});

export default LoginHome;
