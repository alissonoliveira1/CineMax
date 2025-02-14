import React, { useState, useEffect } from "react";
import { Alert, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@/hooks/hookUser";
import AsyncStorage from '@react-native-async-storage/async-storage';

const HeaderWithButton = () => {
  const router = useRouter();
  const { dadosUser } = useUser();
  const [showButton, setShowButton] = useState(true);
  console.log(showButton);

  useEffect(() => {
    const getButtonValue = async () => {
      const valorButtonPerfil = await AsyncStorage.getItem('valorButtonPerfil');
      
      if (valorButtonPerfil) {
        setShowButton(JSON.parse(valorButtonPerfil));
      }
    };
    getButtonValue();
  }, []);

  const handleButtonPress = async () => {
    console.log("Botão pressionado!");

    // Verifica se o perfil está completo
    if (!dadosUser.displayName || !dadosUser.photoURL) {
      Alert.alert(
        "Perfil Incompleto",
        "Por favor, complete seu perfil adicionando um nome e uma foto.",
        [{ text: "OK" }]
      );
      console.log(dadosUser.displayName, dadosUser.photoURL, "Perfil incompleto, exibindo alerta...");
    } else {
      // Esconde o botão
      setShowButton(false);
      
      // Salva o estado no AsyncStorage antes de redirecionar
      await AsyncStorage.setItem('valorButtonPerfil', JSON.stringify(false));
      
      // Redireciona após a mudança de estado
      router.push("/perfilHome");
      console.log("Botão pressionado, redirecionando...");
    }
  };

  return showButton ? (
    <TouchableOpacity
      onPress={handleButtonPress}
      style={{
        backgroundColor: '#0c2b15',
        width: 70,
        height: 60,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Feito</Text>
    </TouchableOpacity>
  ) : null;
};

export default HeaderWithButton;
