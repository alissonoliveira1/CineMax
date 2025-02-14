import { getDoc, doc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Animated,
  Alert,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { db } from "@/firebaseConfig";
const { width } = Dimensions.get("window");
const ITEM_SIZE = width * 0.5;
import { useRegister } from "@/hooks/hookRegister";
import { Image } from "expo-image";
interface IconsLoadProps {
  dados: string;
}
interface Avatar {
  url: string;
}
export const IconsLoad: React.FC<IconsLoadProps> = ({ dados }) => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const boderRadius = new Animated.Value(0);
  const [iconSelected, setIconSelected] = useState<string>("");
  const { setConta } = useRegister();
  const getAvatars = useCallback(async () => {
    try {
      const docRef = doc(db, "cineUser", "avatar");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data[dados]) {
          // Acessando dinamicamente com base em 'dados'
          setAvatars(data[dados]);
        } else {
          console.log(`Nenhum ícone encontrado para a chave: ${dados}`);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar avatares:", error);
      Alert.alert("Erro", "Houve um erro ao buscar os dados.");
    }
  }, [dados]);
  useEffect(() => {
    getAvatars();
  }, [getAvatars]);
  Animated.timing(boderRadius, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true,
  }).start();
  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => selectIcon(item.url)}
        style={[
          styles.touthImg,
          { borderWidth: iconSelected === item.url ? 3 : 0 },
        ]}
      >
        <Image source={{ uri: item.url }} style={styles.image} />
      </TouchableOpacity>
    );
  };

  const selectIcon = (e: any) => {
    setIconSelected(e);
    setConta((prevState) => ({ ...prevState, perfil: e }));
  };
  return (
    <View style={{ flex: 1, marginTop: 20, marginBottom: 10 }}>
      <Animated.FlatList
        data={avatars}
        keyExtractor={(item) => item.url}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        bounces={false}
        style={{ flexGrow: 0 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: ITEM_SIZE * 0.5,
    height: ITEM_SIZE * 0.5,
    borderRadius: ITEM_SIZE * 0.4,
  },
  touthImg: {
    alignItems: "center",
    marginRight: 20,

    borderRadius: ITEM_SIZE * 0.4,

    borderColor: "#0096aa",
  },
});
