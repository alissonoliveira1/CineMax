import { View, Text, StyleSheet,ScrollView,Animated } from "react-native";
import { useRef,useState } from "react";
import Menu from "@/components/menu";
const Favoritos = () =>{
    const scrollY = useRef(new Animated.Value(0)).current;
    const lastScrollY = useRef(0); 
    const [menuVisible, setMenuVisible] = useState(true);
    const scrollRoda = Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      {
        useNativeDriver: false,
        listener: (event: any) => {
          const currentScrollY = event.nativeEvent.contentOffset.y;
          if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
            setMenuVisible(false); 
          } else if (currentScrollY < lastScrollY.current) {
            setMenuVisible(true); 
          }
          lastScrollY.current = currentScrollY; 
        },
      }
    );

    return(
       <ScrollView onScroll={scrollRoda}>
         <View style={styles.container}>
            <Text style={{color:'white'}}>Favoritos</Text>
            <Menu isVisible={menuVisible}/>
        </View>
       </ScrollView>
    )
}

export default Favoritos;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#02082c",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#02082c",
    },
})