import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import Check from "@/assets/images/check2-circle.svg";
import { useRegister } from "@/hooks/hookRegister";
const width = Dimensions.get("window").width;
const Step2 = () => {
  const { conta } = useRegister();
  return (
    <View
      style={{
        alignItems: "flex-start",
        justifyContent: "flex-start",
        marginTop: 90,
        flex: 1,
        width: width - 60
      }}
    >
      <View
        style={{ width:width - 60, alignItems: "center", justifyContent: "center", marginBottom: 20 }}
      >
        <Check width={70} height={70} color="#00ceb2" />
      </View>
      <View style={{ width:width - 60 }}>
        <Text style={{textAlign:"center", fontSize: 30, fontWeight: "bold" }}>
          Sua conta foi criada!
        </Text>
      </View>
      <View >
        <Text style={{ fontSize: 20, marginTop: 20 }}>
            Foi enviado um email para <Text style={{fontWeight:'bold'}}>{conta} </Text>com um link para ativar sua conta.
        </Text>
      </View>
      <View style={{marginTop: 40}}>
        <TouchableOpacity style={{width:width - 60, backgroundColor:"#00ceb2", height:50, justifyContent:"center", alignItems:"center",}}>
        <Text style={{fontSize:23, color:"#ffffff", fontWeight:"bold", textAlign:"center"}}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Step2;
