import React, { useContext } from "react";
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import TMDBImage from "./TMDBImage";
import { AppContext } from "./Apimages";

const { width } = Dimensions.get("window");

export default function ListConteudo() {
  const { movies, movieAcaoAventura, movieTerror, filmesAlta } = useContext(AppContext);
  const router = useRouter();

  interface TVShow {
    genre_ids: number[];
    title: string;
    poster_path: string;
    id: string;
    backdrop_path: string;
    name: string;
    movie?: any;
  }

  const renderItem = ({ item }: { item: TVShow }) => (
    <View style={styles.imageContainer} key={item.id}>
      <TouchableOpacity onPress={() => router.push(`/infoFilmes?id=${item.id}`)}>
        <TMDBImage uri={`https://image.tmdb.org/t/p/w300/${item.poster_path}`} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <View style={styles.containerCapa}>
        <Text style={styles.text}>Filmes em Alta</Text>
        <FlatList
          data={filmesAlta}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          initialNumToRender={4}
          maxToRenderPerBatch={10}
          windowSize={10}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.containerCapa}>
        <Text style={styles.text}>Filmes de ação e Aventura</Text>
        <FlatList
          data={movieAcaoAventura}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          initialNumToRender={4}
          maxToRenderPerBatch={10}
          windowSize={10}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.containerCapa}>
        <Text style={styles.text}>Destaque do dia</Text>
        <FlatList
          data={movies}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          initialNumToRender={4}
          maxToRenderPerBatch={10}
          windowSize={10}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.containerCapa}>
        <Text style={styles.text}>Filmes de terror</Text>
        <FlatList
          data={movieTerror}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          initialNumToRender={4}
          maxToRenderPerBatch={10}
          windowSize={10}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerCapa: {
    marginBottom: 10,
  },
  text: {
    color: "white",
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
  imageContainer: {
    position: "relative",
    marginLeft: 10,
    marginRight: 3,
    display: "flex",
  },
});
