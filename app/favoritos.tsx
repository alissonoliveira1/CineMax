import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { db } from "@/firebaseConfig"; 
import { getDocs, collection } from "firebase/firestore";
import Menu from "@/components/menu";
import Lixeira from "../assets/images/trash3-fill.svg";
import { delFav } from "@/components/DelFav";

interface Movie {
  nome: string;
  sobre: string;
  poster: string;
  backdrop: string;
  categoria: string;
  id: string;
}

const width = Dimensions.get("window").width;

const Shimmer = () => {
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={styles.shimmerItem}>
      <Animated.View
        style={[
          styles.shimmerOverlay,
          { transform: [{ translateX: shimmerTranslate }] },
        ]}
      >
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.4)",
            "rgba(255,255,255,0)",
          ]}
          style={styles.shimmerGradient}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </Animated.View>
    </View>
  );
};

const Favoritos = () => {
  const userId = "R2IqDjgdrERzRKkV8gDUhX5nQp62";
  const [testdados, settestdados] = useState<Movie[]>([]);
  const [filteredData, setFilteredData] = useState<Movie[]>([]);
  const [opcao, setOpcao] = useState<"todos" | "filmes" | "series">("todos");
  const [menuVisible, setMenuVisible] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

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

  useEffect(() => {
    const getUsers = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "cineData", userId, "favoritos")
        );
        let movies: Movie[] = [];
        querySnapshot.forEach((doc) => {
          const movie = {
            nome: doc.get("nome"),
            sobre: doc.get("sobre"),
            poster: doc.get("poster"),
            backdrop: doc.get("backdrop"),
            id: doc.id,
            categoria: doc.get("categoria"), 
          };
          movies.push(movie);
        });
        settestdados(movies);
        setFilteredData(movies); 
      } catch (error) {
        console.error("Erro ao buscar dados: ", error);
      }
    };
    getUsers();
  }, []);

  const filterByOption = (option: "todos" | "filmes" | "series") => {
    setOpcao(option);
    if (option === "todos") {
      setFilteredData(testdados);
    } else {
      setFilteredData(testdados.filter((item) => item.categoria === option));
    }
  };

  const renderShimmer = () => <Shimmer />;

  const renderMovies = ({ item }: { item: Movie }) => (
    <View style={styles.containeRender} key={item.id}>
      <Image
        style={styles.image}
        source={{ uri: `https://image.tmdb.org/t/p/w300/${item.backdrop}` }}
      />
      <Text style={styles.textRender}>{item.nome}</Text>
      <TouchableOpacity
        onPress={() => removeFav(item.id)}
        style={{
          width: "20%",
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <Lixeira width={20} height={20} color={"#a09f9f"} />
      </TouchableOpacity>
    </View>
  );

  const removeFav = (movieId: string) => {
    delFav(movieId);
    settestdados((prevState: any) =>
      prevState.filter((movie: any) => movie.id !== movieId)
    );
    setFilteredData((prevState: any) =>
      prevState.filter((movie: any) => movie.id !== movieId)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.options}>
        <TouchableOpacity
          style={[
            styles.toqueOptions,
            opcao === "todos" ? { backgroundColor: "#333" } : {},
          ]}
          onPress={() => filterByOption("todos")}
        >
          <Text style={styles.textOptions}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toqueOptions,
            opcao === "filmes" ? { backgroundColor: "#333" } : {},
          ]}
          onPress={() => filterByOption("filmes")}
        >
          <Text style={styles.textOptions}>Filmes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toqueOptions,
            opcao === "series" ? { backgroundColor: "#333" } : {},
          ]}
          onPress={() => filterByOption("series")}
        >
          <Text style={styles.textOptions}>Séries</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        onScroll={scrollRoda}
        data={filteredData.length > 0 ? filteredData : Array(8).fill(null)}
        renderItem={filteredData.length > 0 ? renderMovies : renderShimmer}
        keyExtractor={(item, index) => (item ? item.id : index.toString())}
        contentContainerStyle={styles.container2}
        initialNumToRender={8}
        showsVerticalScrollIndicator={false}
      />
      <Menu page={"favoritos"} isVisible={menuVisible} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  options: {
    width: width,
    marginTop: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 10,
  },
  textOptions: { color: "white", fontSize: 15 },
  toqueOptions: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 30,

    width: 70,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "rgb(10, 17, 4)",
  },
  container2: {
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  containeRender: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 2,
    paddingBottom: 10,
  },
  textRender: {
    flex: 1,
    color: "#cfcfcf",
    fontSize: 15,
    fontWeight: "bold",
  },
  image: {
    width: 140,
    height: 80,
    borderRadius: 4,
    marginRight: 10,
  },
  shimmerItem: {
    height: 85,
    width: "100%",
    backgroundColor: "#1c1c1c",
    marginBottom: 10,
    borderRadius: 4,
    overflow: "hidden",
  },
  shimmerOverlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  shimmerGradient: {
    height: "100%",
    width: "30%",
  },
});

export default Favoritos;
