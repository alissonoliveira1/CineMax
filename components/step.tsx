import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useRegister } from "@/hooks/hookRegister";
import { useFocusEffect } from "expo-router";
import { useState, useRef, useCallback } from "react";
import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
const width = Dimensions.get("window").width;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Step1 = () => {
  const { conta, setPassos } = useRegister();
  const teclado = useRef<TextInput>(null);
  const [changeText, setChangeText] = useState<{ email: string }>({
    email: conta?.email || "",
  });
  const [changeText2, setChangeText2] = useState<string>("");
  const [active, setactive] = useState(false);
  const [validaremail, setValidarEmail] = useState<null | boolean>(null);
  const [numError, setNumError] = useState<number | null>(null);
  useFocusEffect(
    useCallback(() => {
      setPassos(1);
    }, [])
  )
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
  const colorLine = (text: string) => {
    setChangeText({ email: text });
  
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
  const pressRegister = async () => {
    if (!changeText.email || !emailRegex.test(changeText.email)) {
      setValidarEmail(false);
      setNumError(3);
      return;
    }
  
    try {
      await createUserWithEmailAndPassword(auth, changeText.email, changeText2);
      setPassos(2);
    } catch (error) {
      console.log("Algo deu errado ao se registrar", error);
     
    }
  };
    return(
<View
        style={{
          flex: 1,
          marginTop: 50,
          alignItems: "flex-start",
          justifyContent: "flex-start",
          width: width - 60,
          height: 500,
        }}
      >
        <View>
          <Text style={{ fontSize: 23, color: "#292929", fontWeight: "bold" }}>
            Filmes, series e muito mais sem limites
          </Text>
        </View>

        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 18, color: "#292929", marginTop: 10 }}>
            Com sua conta, voce pode Assistir a series e filmes exclusivos no
            aplicativo movel e em todos os seus aparelhos
          </Text>
        </View>

        <View style={{ marginBottom: 10, gap: 10 }}>
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
              value={changeText.email ? changeText.email : ""}
              onChangeText={colorLine}
              style={styles.input}
              placeholderTextColor={"#a7a7a7"}
              inputMode="email"
              keyboardType="email-address"
            />
          </View>
          {renderError()}

          <View style={styles.containerInput}>
            <Text style={{ fontSize: 12, color: "#747474" }}>Senha</Text>
            <TextInput
              style={styles.input}
              onChangeText={setChangeText2}
              value={changeText2 ?? ""}
              inputMode="text"
              secureTextEntry={true}
              keyboardType="default"
            />
          </View>
        </View>

        <View style={styles.containerbuttonVL}>
          <TouchableOpacity
            onPress={() => setactive(true)}
            onPressIn={() => pressRegister()}
            style={styles.buttonVamosLa}
          >
            <Text style={styles.buttonVamosLaText}>VAMOS LÁ</Text>
          </TouchableOpacity>
        </View>
      </View>
   
    )
}
const styles = StyleSheet.create({
  containerHeader: {
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 5,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 150,
    width: width,
    height: 40,
  },
  logoImg: {
    width: 150,
    height: 50,
    objectFit: "contain",
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
  containerbuttonVL: {
    marginTop: 20,
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
});

export default Step1;