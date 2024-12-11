import { View,FlatList,StyleSheet,TouchableOpacity} from "react-native";
import { useEffect, useState } from "react";
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
  

const ListSemelhantes = ({id, ids}:any) => {
    const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";
const [filmesemelhantes, setFilmesemelhantes] = useState([]);
    const router = useRouter();
 
useEffect(()=>{
    const getFilmesemelhantes = async () => {
        const response = await api.get(`/movie/${id}/similar`,{
            params:{
                api_key:API_KEY,
                language:'pt-Br',
                page:1}
        });
        setFilmesemelhantes(response.data.results);
    }
    getFilmesemelhantes();
},[])
useEffect(()=>{
    const getFilmesemelhantes = async () => {
        const response = await api.get(`/tv/${ids}/similar`,{
            params:{
                api_key:API_KEY,
                language:'pt-BR',
                page:1}
        });
        setFilmesemelhantes(response.data.results);
    }
    getFilmesemelhantes();
},[])
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
    return(
        <FlatList
        data={filmesemelhantes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        initialNumToRender={4}
        maxToRenderPerBatch={10}
        windowSize={10}
        showsHorizontalScrollIndicator={false}
      />
    )
}
export default ListSemelhantes;
const styles = StyleSheet.create({
    imageContainer: {
        position: "relative",
        marginLeft: 10,
        marginRight: 3,
        paddingBottom: 10,
        display: "flex",
      },

})