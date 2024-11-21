
import { View, FlatList,TouchableOpacity,StyleSheet} from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import api from "../app/services";
interface ListDestaqueProps {

}

interface TVShow {
    genre_ids: number[];
    title: string;
    poster_path: string;
    id: string;
    backdrop_path: string;
    name: string;
    movie?: any;
  }
import DestaqueImage from "./DestaqueImage";

const ListDestaque: React.FC<{ type: ListDestaqueProps }> = ({type}) =>{
    const router = useRouter();
    const [items, setItems] = useState<TVShow[]>([]);
    const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";
    useEffect(() => {
        const fetchItems = async () => {
          try {
            const response = await api.get(`discover/${type}`, {
              params: {
                api_key: API_KEY,
                language: "pt-BR",
                page: 1,
              },
            });
            setItems(response.data.results);
          } catch (error) {
            console.error("Erro ao buscar items:", error);
          }
        };
        fetchItems();
    }, [ type]);
    const renderItemDestaque = ({ item }: { item: TVShow }) => (
        <View style={styles.imageContainer} key={item.id}>
          <TouchableOpacity onPress={() =>
            item.name
              ? router.push(`/info?id=${item.id}`)
              : router.push(`/infoFilmes?id=${item.id}`)
          }>
            <DestaqueImage uri={`https://image.tmdb.org/t/p/w300/${item.poster_path}`} />
          </TouchableOpacity>
        </View>
      );
    return(
<View>
<FlatList
          data={items}
          renderItem={renderItemDestaque}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          initialNumToRender={4}
          maxToRenderPerBatch={10}
          windowSize={10}
          showsHorizontalScrollIndicator={false}
        />
</View>
    )
}
export default ListDestaque;
const styles = StyleSheet.create({
    imageContainer: {
        position: "relative",
        marginLeft: 10,
        marginRight: 3,
        display: "flex",
      },
})