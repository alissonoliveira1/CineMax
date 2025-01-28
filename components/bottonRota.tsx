import React, { useState, useEffect } from "react";
import { Alert, Button, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@/hooks/hookUser";

const HeaderWithButton = () => {
  const router = useRouter();
  const { dadosUser } = useUser();
  const [showButton, setShowButton] = useState(true);



  const handleButtonPress = () => {
    console.log("Botão pressionado!");
    if (!dadosUser.displayName || !dadosUser.photoURL) {
      Alert.alert(
        "Perfil Incompleto",
        "Por favor, complete seu perfil adicionando um nome e uma foto.",
        [{ text: "OK" }]
      
      );
      console.log(dadosUser.displayName,dadosUser.photoURL,"Perfil incompleto, exibindo alerta...");
  
    } else {
      // Alterar o estado para esconder o botão antes de redirecionar
      setShowButton(true);
      router.push("/"); 
      console.log("Botão pressionado, redirecionando...");
    }
  };

  // Redireciona após ocultar o botão


  return showButton ? (
    <TouchableOpacity  onPress={handleButtonPress} style={{backgroundColor:'#0c2b15', width:70, height:60,borderRadius:8, justifyContent:'center', alignItems:'center'}} ><Text style={{color:'white', fontWeight:'bold', }} >Feito</Text></TouchableOpacity>
  ) : null;
};

export default HeaderWithButton;
