import React, { useEffect, useState } from "react";
import api from "../services/index";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
  } from "react-native";
  import TMDBImage from "./TMDBImage";
import { useRouter } from "expo-router";
interface CategoryListProps {
  genreId: number;
  type: "movie" | "tv";
}

interface TVShow {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
}

const CategoryList: React.FC<CategoryListProps> = ({ genreId, type }) => {
  const [items, setItems] = useState<TVShow[]>([]);
  const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";
  const router = useRouter();
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get(`discover/${type}`, {
          params: {
            api_key: API_KEY,
            language: "pt-BR",
            with_genres: genreId,
            page: 1,
          },
        });
        setItems(response.data.results);
      } catch (error) {
        console.error("Erro ao buscar items:", error);
      }
    };

    fetchItems();
  }, [genreId, type]);
  const renderItem = ({ item }: { item: TVShow }) => (
    <View style={styles.imageContainer} key={item.id}>
      <TouchableOpacity onPress={() =>
        item.name
          ? router.push(`/info?id=${item.id}`)
          : router.push(`/infoFilmes?id=${item.id}`)
      }>
        <TMDBImage uri={`https://image.tmdb.org/t/p/w300/${item.poster_path}`} />
      </TouchableOpacity>
    </View>
  );
  return (
    <View>
      <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          initialNumToRender={4}
          maxToRenderPerBatch={10}
          windowSize={10}
          showsHorizontalScrollIndicator={false}
        />
    </View>
  );
};
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
export default CategoryList;
