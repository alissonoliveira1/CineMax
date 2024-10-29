import { useRouter } from "expo-router";
 import { 
  View,
    StyleSheet,
    Animated,
    ViewStyle,
    TouchableOpacity,
    Image
     } from "react-native";
     import SearchIcon from '../assets/images/search.svg'; 
     interface HeaderProps {
      scrollY: Animated.Value;
    }
 
    const Header: React.FC<HeaderProps> = ({ scrollY }) => {
    const router = useRouter();
      
      const headerBackgroundColor = scrollY.interpolate({
        inputRange: [0, 70],
        outputRange: ['transparent', '#050720bc'], 
        extrapolate: 'clamp',
      });

    const containerHeader: Animated.WithAnimatedObject<ViewStyle> = {
        alignItems: 'center', 
        flexDirection: 'row',
        paddingLeft:10,
        paddingTop:20,
        paddingRight:10,
        justifyContent: 'space-between',
        backgroundColor: headerBackgroundColor, 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      
        
        zIndex: 150,
        width: '100%',
        height: 70,
        };

    return(
 
       <Animated.View style={containerHeader}>
        <View style={styles.logoImg} ><Image style={styles.logoImg} source={require('../assets/images/logoMobile.png')}/></View>
        <TouchableOpacity  onPress={() => router.push(`/search`)}><SearchIcon  color={'white'} width={24} height={24} /></TouchableOpacity>
      </Animated.View>
  
    )
 }
 const styles = StyleSheet.create({
  search:{
  width: 30,
  height: 30,
  },
  logoImg:{
    width: 50,
    height: 50,
  }
 })
    export default Header;