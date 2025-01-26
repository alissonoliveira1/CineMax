import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Image } from "expo-image";
import Translate from "@/assets/icons/translate.svg";
import ChatRight from "@/assets/icons/chat-right-text.svg";
import Exclamation from "@/assets/icons/exclamation-octagon.svg";
import Chevron from "@/assets/icons/chevron-right.svg";
import Pencil from "@/assets/images/pencil-fill.svg";
import Trash from "@/assets/icons/trash3.svg";
import Exit from "@/assets/icons/exit.svg";
import { useRegister } from "@/hooks/hookRegister";
import { useUser } from "@/hooks/hookUser";
import EsclamationCircle from "@/assets/icons/exclamation-circle.svg";
const { width } = Dimensions.get("window");
const height = Dimensions.get("window").height;
const ITEM_SIZE = width * 0.5;
const SPACING = (width - ITEM_SIZE) / 2;

const Perfil = () => {
  const [avatars, setAvatars] = useState<{ url: string; name: string }[]>([]);
  const [blueLock, setblueLock] = useState<{ url: string; name: string }[]>([]);
  const [marvel, setMarvel] = useState<{ url: string; name: string }[]>([]);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string >('https://i.ibb.co/pXcqy1M/Inserir-um-t-tulo.png');
  const { setConta, conta } = useRegister();
  const { user } = useUser();
  const [name, setName] = useState<string>(user?.displayName || "");
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [subiu, setSubiu] = useState(false);
  const altura = height - 70;

  const perfilIcons = () => {
    Animated.timing(scrollY, {
      toValue: subiu ? 0 : -altura,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      if (subiu) {
        setConta((prevState) => ({
          ...prevState,
          perfil: currentAvatarUrl ,
        }));
      }
      setSubiu(!subiu);
    });
  };

  const getAvatars = useCallback(async () => {
    try {
      const docRef = doc(db, "cineUser", "avatar");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.blueLock && Array.isArray(data.blueLock)) {
          setAvatars(data.icons);
          setblueLock(data.blueLock);
          setMarvel(data.marvel);
        } else {
          console.log("No icons array found in the document!");
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching avatars:", error);
    }
  }, []);
  useEffect(() => {
    getAvatars();
  }, [getAvatars]);

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      const visibleItem = viewableItems[0];
      if (visibleItem && visibleItem.item.url !== currentAvatarUrl) {
        setCurrentAvatarUrl(visibleItem.item.url);
      }
    }
  }).current;

  const renderItem = ({ item, index }: any) => {
    const inputRange = [
      (index - 1) * ITEM_SIZE,
      index * ITEM_SIZE,
      (index + 1) * ITEM_SIZE,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: "clamp",
    });

    return (
      <View style={{ width: ITEM_SIZE, alignItems: "center" }}>
        <Animated.Image
          source={{ uri: item.url }}
          style={[
            styles.image,
            {
              transform: [{ scale }],
            },
          ]}
        />
      </View>
    );
  };
  const setandoNome = (e: any) => {
    setName(e);
  };
  const focosname = () => {
    if (name === "") return;

    setConta((prevState) => ({ ...prevState, nome: name }));
  };
  useFocusEffect(
    useCallback(() => {
      setSubiu(false);
    }, [])
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={perfilIcons} style={styles.containerImgSelect}>
        <Image
          style={styles.imgSelect}
          source={{
            uri:
              user?.photoURL === ""
                ? currentAvatarUrl
                : user?.photoURL || currentAvatarUrl,
          }}
        />
        <View style={styles.containerIconPencel}>
          <Pencil color={"black"} width={19} height={19} />
        </View>
      </TouchableOpacity>
      <View
        style={{
          width: width - 100,
          height: 60,
          position: "relative",
        }}
      >
        <TextInput
          inputMode="text"
          value={name}
          onChangeText={setandoNome}
          onBlur={focosname}
          placeholderTextColor={"#cecece"}
          placeholder="Nome do perfil"
          style={{
            width: width - 100,
            height: 60,
            backgroundColor: "#222222ff",
            color: "white",
            fontSize: 16,
            paddingLeft: 10,
            borderRadius: 8,
          }}
        />
        {name === "" && (
          <>
          <View
          style={{
            width: 40,
            height: 60,
            position: "absolute",
            right: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <EsclamationCircle width={20} height={20} color={"red"} />
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 5,
            right: 25,
            borderBottomColor: "red",
            width: 10,
            height: 10,
            borderLeftWidth: 5,
            borderRightWidth: 5,
            borderBottomWidth: 8,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
          }}
        ></View>
        <View
          style={{
            zIndex: 100,
            position: "absolute",
            width: 130,
            height: 30,
            top: 54,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <View style={{
            width: 130,
            height: 30,
            position: "relative",
            paddingTop: 5,
            justifyContent: "center",
            alignItems: "center",
            }}>
            <View style={{ 
              width: 130,
              height:5,
              backgroundColor:'red',
              position: "absolute",
              top: 0,
              
              }}></View>
          <Text
            style={{
              color: "black",
              fontSize: 13,
             
           
             
            }}
          >
            informe um Nome.
          </Text>
          </View>
        </View>
          </>
        )}
      </View>

      <View style={styles.containerOpcoesPerfil}>
        <TouchableOpacity style={styles.opcoesPerfil}>
          <View
            style={{
              width: 50,
              height: 70,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Exclamation width={22} height={22} color={"#ffffff"} />
          </View>
          <View style={{ width: width - 130 }}>
            <Text style={styles.titleOpcoesPerfil}>
              Restrições de visialização
            </Text>
            <Text style={styles.textOpcoesPerfil}></Text>
          </View>
          <View
            style={{
              width: 60,
              height: 70,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Chevron width={18} height={18} color={"#ffffff"} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.opcoesPerfil}>
          <View
            style={{
              width: 50,
              height: 70,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Translate width={22} height={22} color={"#ffffff"} />
          </View>
          <View style={{ width: width - 130 }}>
            <Text style={styles.titleOpcoesPerfil}>idioma de exibição</Text>
            <Text style={styles.textOpcoesPerfil}>
              altere o idioma de exibição e texto que voce vê no CineMax no App
              ou site
            </Text>
          </View>
          <View
            style={{
              width: 60,
              height: 70,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Chevron width={18} height={18} color={"#ffffff"} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.opcoesPerfil}>
          <View
            style={{
              width: 50,
              height: 70,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ChatRight width={22} height={22} color={"#ffffff"} />
          </View>
          <View style={{ width: width - 130 }}>
            <Text style={styles.titleOpcoesPerfil}>
              idiomas de áudio e legendas
            </Text>
            <Text style={styles.textOpcoesPerfil}>
              configurações de idioma de áudio e legendas para assistir seus
              filmes e series
            </Text>
          </View>
          <View
            style={{
              width: 60,
              height: 70,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Chevron width={18} height={18} color={"#ffffff"} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.opcoesPerfil}>
          <View
            style={{
              width: 50,
              height: 70,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Trash width={22} height={22} color={"#ffffff"} />
          </View>
          <View style={{ width: width - 130 }}>
            <Text style={styles.titleOpcoesPerfil}>Deletar conta</Text>
            <Text style={styles.textOpcoesPerfil}>
              deletar conta do CineMax todos seus dados serão apagados
            </Text>
          </View>
          <View
            style={{
              width: 60,
              height: 70,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Chevron width={18} height={18} color={"#ffffff"} />
          </View>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[styles.containerMenu, { transform: [{ translateY: scrollY }] }]}
      >
        <View
          style={{
            marginTop: 15,
            marginBottom: 25,
            flexDirection: "row",
            alignItems: "center",
            width: width,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: 200,
              height: 70,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 20,
            }}
          >
            <Text
              style={{ color: "#d6d6d6ff", fontSize: 25, fontWeight: "bold" }}
            >
              Escolha um icone
            </Text>
          </View>
          <View
            style={{
              width: 70,
              height: 70,
              justifyContent: "center",
              alignItems: "center",

              paddingRight: 25,
            }}
          >
            <TouchableOpacity onPress={perfilIcons}>
              <Exit width={32} height={32} color={"#d6d6d6ff"} />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text style={styles.textIconsSelect}>Animes</Text>
          <Animated.FlatList
            data={avatars}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_SIZE}
            decelerationRate="fast"
            bounces={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={{
              paddingHorizontal: SPACING,
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        </View>
        <View style={{ flex: 1, marginTop: 20 }}>
          <Text style={styles.textIconsSelect}>Blue lock</Text>
          <Animated.FlatList
            data={blueLock}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_SIZE}
            decelerationRate="fast"
            bounces={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={{
              paddingHorizontal: SPACING,
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        </View>
        <View style={{ flex: 1, marginTop: 20, marginBottom: 10 }}>
          <Text style={styles.textIconsSelect}>Marvel</Text>
          <Animated.FlatList
            data={marvel}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_SIZE}
            decelerationRate="fast"
            bounces={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={{
              paddingHorizontal: SPACING,
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: "#0a1104",
    alignItems: "center",
  },
  containerImgSelect: {
    width: 120,
    height: 120,
    position: "relative",
    borderRadius: 100,
    marginBottom: 30,
  },
  containerIconPencel: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 100,
  },
  containerMenu: {
    backgroundColor: "#162907",
    position: "absolute",
    top: height,
    flex: 1,
    zIndex: 100,
    width: width,
    height: height - 80,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  containerOpcoesPerfil: {
    width: width - 30,
    marginTop: 20,
    marginBottom: 20,
    gap: 10,
  },
  opcoesPerfil: {
    width: width - 30,
    justifyContent: "center",
    alignItems: "center",
    height: 70,
    backgroundColor: "#142209",
    fontSize: 17,

    borderRadius: 8,
    flexDirection: "row",
  },
  titleOpcoesPerfil: {
    color: "#dddddd",
    fontSize: 16,
    fontWeight: "bold",
  },
  textOpcoesPerfil: {
    color: "#adadad",
    fontSize: 12,
    fontWeight: "600",
  },

  image: {
    width: ITEM_SIZE * 0.5,
    height: ITEM_SIZE * 0.5,
    borderRadius: ITEM_SIZE * 0.4,
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
  selectedAvatarText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  imgSelect: {
    width: 120,
    height: 120,
    borderRadius: 100,
    marginBottom: 20,
  },
  textIconsSelect: {
    marginLeft: 20,
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default Perfil;
