import { View,FlatList,StyleSheet,TouchableOpacity} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import api from "@/services";
import TMDBImage from "./TMDBImage";
import { Image } from 'expo-image';
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
            <TMDBImage uri={`https://image.tmdb.org/t/p/w300/${item.poster_path}`}/>
          </TouchableOpacity>
        </View>
      );
    return(
      <View style={{justifyContent: "center",width:'100%', alignItems: "center",}}>
          <FlatList
        data={filmesemelhantes.slice(0, 12)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={4}
        style={{backgroundColor: "rgb(10, 17, 4)"}}
      
      />
      </View>
    )
}
export default ListSemelhantes;
const styles = StyleSheet.create({
    imageContainer: {
        position: "relative",
        marginLeft: 10,
        marginRight: 3,
        marginTop: 20,
        paddingBottom: 10,
        display: "flex",
        
       
      },
      images:{
        width: 150,
        height: 220,
        borderRadius: 5,
      },

})