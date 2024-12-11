import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { db } from "../../CineMax/firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import Menu from "@/components/menu";
import Lixeira from "../assets/images/trash3-fill.svg";
import { delFav } from "@/components/DelFav";
interface Movie {
  nome: string;
  sobre: string;
  poster: string;
  backdrop: string;
  id: string;
}
const width = Dimensions.get("window").width;
const Favoritos = () => {
  const userId = "R2IqDjgdrERzRKkV8gDUhX5nQp62";
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const [testdados, settestdados] = useState<any[]>([]);
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
          };
          movies.push(movie);
        });
        settestdados(movies);
      } catch (error) {
        console.error("Erro ao buscar dados: ", error);
      }
    };
    getUsers();
  }, []);
  function removeFav(movieId: string) {
    delFav(movieId);
    settestdados((prevState: Movie[]) =>
      prevState.filter((movie) => movie.id !== movieId)
    );
  }
  const renderMovies = ({ item }: { item: Movie }) => (
    <View style={styles.containeRender} key={item.nome}>
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
        <Lixeira width={20} height={20} color={"white"} />
      </TouchableOpacity>
    </View>
  );
  console.log(testdados);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container2}>
        <View style={styles.options}>
          <TouchableOpacity
          style={styles.toqueOptions}>

            <Text style={styles.textOptions}>Filmes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toqueOptions}>
            <Text style={styles.textOptions}>Series</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          onScroll={scrollRoda}
          data={testdados}
          renderItem={renderMovies}
          keyExtractor={(item) => item.nome}
          horizontal={false}
          initialNumToRender={4}
          maxToRenderPerBatch={10}
          windowSize={10}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <Menu isVisible={menuVisible} />
    </SafeAreaView>
  );
};

export default Favoritos;
const styles = StyleSheet.create({
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
  options: {
    width: width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 10,
  },
  containeRender: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",

    padding: 10,
  },
  textRender: {
    width: 120,
    color: "white",
    fontSize: 15,
  },
  image: {
    width: 140,
    height: 85,
    borderRadius: 4,
    marginRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#02082c",
  },
  container2: {
    width: width,
    flexDirection: "column",
    height: "100%",
    paddingTop: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#02082c",
  },
});
