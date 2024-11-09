
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    VirtualizedList,
  } from "react-native";
  import { useRouter } from "expo-router";
  import React, { useContext } from "react";
  import TMDBImage from "./TMDBImage";
  import { AppContext } from "./Apimages";
  const { width } = Dimensions.get("window");

export default function ListConteudo(){
    const {
        movies,
        movieAcaoAventura,
        movieTerror,
        filmesAlta,
      } = useContext(AppContext);
      const router = useRouter();
      interface TVShow {
        genre_ids: number[];
        title: string;
        poster_path: string;
        id: string;
        backdrop_path: string;
        name: string;
        movie:any;
      }
      const renderItem = ({ item }: { item: TVShow }) => (
        <View style={styles.imageContainer} key={item.id}>
        <TouchableOpacity
          onPress={() => router.push(`/infoFilmes?id=${item.id}`)}
        >
          <TMDBImage
            uri={`https://image.tmdb.org/t/p/original/${item.poster_path}`}
          />
        </TouchableOpacity>
      </View>
    )
      const getItem = (data:any, index:any) => data[index];
      const getItemCount = (data:any) => data.length;
      
      
      
return(
 <View>
     <View style={styles.containerCapa}>
    <Text style={styles.text}>Filmes em Alta</Text>
   <VirtualizedList
  data={filmesAlta}
  initialNumToRender={4}
  renderItem={renderItem}
  keyExtractor={(item) => item.id.toString()}
  getItem={getItem}
  getItemCount={getItemCount}
  horizontal={true}
   />
  </View>
   <View style={styles.containerCapa}>
   <Text style={styles.text}>Filmes de ação e Aventura</Text>
   <VirtualizedList
  data={movieAcaoAventura}
  initialNumToRender={4}
  renderItem={renderItem}
  keyExtractor={(item) => item.id.toString()}
  getItem={getItem}
  getItemCount={getItemCount}
  horizontal={true}
   />
 </View>
 <View style={styles.containerCapa}>
          <Text style={styles.text}>Destaque do dia</Text>
          <VirtualizedList
  data={movies}
  initialNumToRender={4}
  renderItem={renderItem}
  keyExtractor={(item) => item.id.toString()}
  getItem={getItem}
  getItemCount={getItemCount}
  horizontal={true}
   />
        </View>
 <View style={styles.containerCapa}>
          <Text style={styles.text}>Filmes de terror</Text>
          <VirtualizedList
  data={movieTerror}
  initialNumToRender={4}
  renderItem={renderItem}
  keyExtractor={(item) => item.id.toString()}
  getItem={getItem}
  getItemCount={getItemCount}
  horizontal={true}
   />
        </View>
 </View>
)
}

const styles = StyleSheet.create({
    shadow: {
     
      borderRadius: 15, // Ajuste o raio da borda para suavizar os cantos
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgb(5, 7, 32)", // fundo para corresponder ao seu tema
    },
  
    container2: {
      flex: 1,
      backgroundColor: "rgb(5, 7, 32)",
    },
    horizontalScroll: {
      marginTop: 10,
    },
    imageContainer: {
      position: "relative",
      marginLeft: 10,
      marginRight: 3,
      display: "flex",
    },
   
    image2: {
      overflow: 'hidden',
      justifyContent: "flex-end",
      width: width * 0.9,
      height: 350,
      borderRadius: 10,
      borderStyle: "solid",
      borderColor: "rgb(197, 197, 197)",
      borderWidth: 1,
      zIndex: 1,
      resizeMode: "cover",
      elevation: 10,
    },
    link: {
      flex: 1,
    },
    text: {
      color: "white",
      marginTop: 10,
      marginBottom: 5,
      marginLeft: 10,
      fontWeight: "bold",
      fontSize: 20,
    },
    containerCapa: {
      marginBottom: 10,
    },
    opcoesSerieFilme: {
      flexDirection:'row',
      zIndex:100,
      justifyContent:'space-evenly',
      marginTop:90
    },
    textoFilmesSeries: {
     color:'#ffffff',
     fontWeight:'bold',
      fontSize:14
    },
    viewFilmesSeries:{
     borderBottomWidth:1,
     borderColor:'#ffffff', 
     
     paddingBottom:5
    },
  });