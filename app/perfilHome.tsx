import { Image } from "expo-image";
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";
import { useUser } from "@/hooks/hookUser";
import { useRouter } from "expo-router";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const PerfisHome = () => {
    const {dadosUser} = useUser();
    const router = useRouter();
    return (
        <View style={styles.container}>
        <TouchableOpacity style={{alignItems:'center'}} onPress={() => router.replace("/home")}>
        <View ><Image style={styles.image} source={{uri:dadosUser.photoURL}}/></View>
        <Text style={styles.text}>{dadosUser.displayName}</Text>
        </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: "#0a1104",
    },
    image:{
     width: width - 200,
     height: height - 480,
     borderRadius: 100
    },
    text:{
        fontWeight:'bold',
        fontSize: 20,
        color:'#ffffff',
    }
})
export default PerfisHome;