import {
  View,
  StyleSheet,
  Image,
  Dimensions
} from "react-native";
const width = Dimensions.get("window").width;
import Step1 from "@/components/step";
import Step2 from "@/components/step2";
const register = () => {
 
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={styles.containerHeader}>
        <View style={styles.logoImg}>
          <Image
            style={styles.logoImg}
            source={require("../assets/images/CineMax.png")}
          />
        </View>
      </View>

      <Step2/>
    </View>
  );
};
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
 
});
export default register;
