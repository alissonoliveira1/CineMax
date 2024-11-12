import { FlatList, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import api from "@/app/services";

interface TMDB {
  name: string;
  id: number;
  poster_path: string;
}

const HomeSearch = () => {
  const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";
  const [movie, setMovie] = useState<TMDB[]>([]);

  useEffect(() => {
    const Dados = async () => {
      try {
        const response = await api.get("discover/tv", {
          params: {
            api_key: API_KEY,
            language: "pt-BR",
            page: 1,
          },
        });
        setMovie(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };
    Dados();
  }, []);

  const renderItem = ({ item }: { item: TMDB }) => {
    return (
      <View style={styles.destaqueResults} key={item.id}>
        <Image
          style={styles.imageDestaque}
          source={{
            uri: `https://image.tmdb.org/t/p/original${item.poster_path}`,
          }}
          cachePolicy={'memory'}// Utilizando cache mais eficiente
          contentFit="cover"
        />
      </View>
    );
  };

  return (
    <View style={{ paddingTop: 80, alignItems: "center" }}>
      <FlatList
        data={movie}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        initialNumToRender={6}
        numColumns={2}
        removeClippedSubviews={true} // Otimização de renderização
      />
    </View>
  );
};

export default HomeSearch;

const styles = StyleSheet.create({
  destaqueResults: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 5,
  },
  imageDestaque: {
    width: 160,
    height: 220,
    resizeMode: "cover",
    borderRadius: 5,
  },
});
