import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState, memo } from "react";
import { useRouter } from "expo-router";
import api from "@/services";
import TMDBImage from "./TMDBImage";

interface TVShow {
  genre_ids: number[];
  title: string;
  poster_path: string;
  id: string;
  backdrop_path: string;
  name: string;
  movie?: any;
}

// Cache em memória para armazenar filmes semelhantes
const cache: Record<string, TVShow[]> = {};

const ListSemelhantes = memo(({ id, ids }: any) => {
  const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";
  const [filmesemelhantes, setFilmesemelhantes] = useState<TVShow[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFilmesSemelhantes = async (type: "movie" | "tv", itemId: string) => {
      const cacheKey = `${type}-${itemId}`;
      if (cache[cacheKey]) {
        // Se os dados estiverem no cache, use-os
        setFilmesemelhantes(cache[cacheKey]);
        return;
      }

      try {
        const endpoint = `/${type}/${itemId}/similar`;
        const response = await api.get(endpoint, {
          params: {
            api_key: API_KEY,
            language: "pt-BR",
            page: 1,
          },
        });

        // Armazene os resultados no cache
        cache[cacheKey] = response.data.results;
        setFilmesemelhantes(response.data.results);
      } catch (error) {
        console.error("Erro ao buscar filmes semelhantes:", error);
      }
    };

    // Verifique se o ID do filme ou série está definido
    if (id) {
      fetchFilmesSemelhantes("movie", id);
    } else if (ids) {
      fetchFilmesSemelhantes("tv", ids);
    }
  }, [id, ids]);

  const renderItem = ({ item }: { item: TVShow }) => (
    <View style={styles.imageContainer} key={item.id}>
      <TouchableOpacity
        onPress={() =>
          item.name
            ? router.push(`/info?id=${item.id}`)
            : router.push(`/infoFilmes?id=${item.id}`)
        }
      >
        <TMDBImage uri={`https://image.tmdb.org/t/p/w300/${item.poster_path}`} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ justifyContent: "center", width: "100%", alignItems: "center" }}>
      <FlatList
        data={filmesemelhantes.slice(0, 12)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={4}
        style={{ backgroundColor: "rgb(10, 17, 4)" }}
      />
    </View>
  );
});

export default ListSemelhantes;

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    marginLeft: 10,
    marginRight: 3,
    marginTop: 10,
    paddingBottom: 10,
    display: "flex",
  },
  images: {
    width: 150,
    height: 220,
    borderRadius: 5,
  },
});
