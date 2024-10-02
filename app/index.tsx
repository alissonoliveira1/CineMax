import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Shadow } from "react-native-shadow-2";
import TMDBImage from "@/components/TMDBImage";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from "react-native";
import api from "./services";
const { width } = Dimensions.get("window");

interface TVShow {
  title: string;
  poster_path: string;
  id: string;
  backdrop_path: string;
  results: TVShow[];
  name: string;
}

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<TVShow[]>([]);
  const [movieAcaoAventura, setMovieAcaoAventura] = useState<TVShow[]>([]);
  const [movieTerror, setMovieTerror] = useState<TVShow[]>([]);
  const router = useRouter();
  const [destaque, setDestaque] = useState<TVShow[]>([]);

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  console.log(logoUrl)
  const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";

  useEffect(() => {
    const getMovies = async () => {
      try {
        const [
          desenhoResponse,
          acaoeAvenResponse,
          terrorResponse,
          destaqueResponse,
        ] = await Promise.all([
          api.get("discover/tv", {
            params: {
              api_key: API_KEY,
              language: "pt-BR",
              with_genres: 16,
            },
          }),
          
          api.get("discover/tv", {
            params: {
              api_key: API_KEY,
              language: "pt-BR",
              with_genres: 10759,
            },
          }),
          api.get("discover/tv", {
            params: {
              api_key: API_KEY,
              language: "pt-BR",
              with_genres: 10765,
            },
          }),
        

          api.get("discover/tv", {
            params: {
              api_key: API_KEY,
              language: "pt-BR",
              with_genres: 16,
            },
          }),
        ]);

        
        setMovies(desenhoResponse.data.results);
        setMovieAcaoAventura(acaoeAvenResponse.data.results);
        setMovieTerror(terrorResponse.data.results);
        setDestaque(destaqueResponse.data.results.slice(0, 1));
        setLoading(false);
   
      } catch (error) {
        console.error(error);
      }
    };

    getMovies();
  }, [API_KEY,api]);
  useEffect(() => {
    const fetchData = async () => {
      if (destaque.length > 0) {
        try {
          const dadosResponse = await api.get(`tv/${destaque[0]?.id}/images`, {
            params: { api_key: API_KEY },
          });
  
          const logos = dadosResponse.data.logos.filter(
            (logo: any) => logo.iso_639_1 === "pt" || logo.iso_639_1 === "pt-BR"
          );
          if (logos.length > 0) {
            setLogoUrl(
              `https://image.tmdb.org/t/p/original${logos[0].file_path}`
            );
          }
         // Marque como carregado
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, [destaque,api]);
  interface RenderCapasProps {
    item: TVShow;
    onPress: () => void; // função para o evento de clique
  }

  const RenderCapas: React.FC<RenderCapasProps> = React.memo(
    ({ item, onPress }) => (
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={onPress}>
          <TMDBImage
            uri={`https://image.tmdb.org/t/p/original/${item.poster_path}`}
          />
        </TouchableOpacity>
      </View>
    )
  );

  const renderItem: ListRenderItem<TVShow> = ({ item }) => (
   
    <RenderCapas
      item={item}
      onPress={() => router.push(`/info?id=${item.id}`)}
    />
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#010318",
        }}
      >
        <Text style={{ color: "white" }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container2}>
      <ScrollView>
        <View style={styles.container}>
          {destaque.map((movie) => (
            <View style={styles.imageContainer2} key={movie.id}>
              <Shadow offset={[0, 0]} startColor="#0d1857" distance={100}>
                <Image
                 
                  style={styles.image2}
                  source={{
                    uri: `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`,
                  }}
                />
              </Shadow>
              <View style={styles.containerButtonPrincipal}>
                <View>
                  <View style={styles.vwImg}>
                    {logoUrl !== null ? (
                      <Image source={{ uri: logoUrl }} style={styles.imgLogo} />
                    ) : (
                      <Text style={styles.text}>{movie.name}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.containerbutton2}>
                  <View style={styles.buttoninfo}>
                    <Text style={styles.buttontext2}>Assistir</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => router.push(`/info?id=${movie.id}`)}
                  >
                    <View style={styles.buttoninfo2}>
                      <Text style={styles.buttontext}>Informações</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.containerCapa}>
          <Text style={styles.text}>Destaques</Text>

          <FlatList
            data={movies}
            renderItem={renderItem}
            initialNumToRender={6}
            maxToRenderPerBatch={2}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.containerCapa}>
          <Text style={styles.text}>Filmes de ação e Aventura</Text>

          <FlatList
            data={movieAcaoAventura}
            renderItem={renderItem}
            initialNumToRender={6}
            maxToRenderPerBatch={5}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.containerCapa}>
          <Text style={styles.text}>Filmes de terror</Text>

          <FlatList
            data={movieTerror}
            renderItem={renderItem}
            initialNumToRender={6}
            maxToRenderPerBatch={2}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:"transparent",
    marginTop: 30,
    
  },
  container2: {
    flex: 1,
    backgroundColor: "#010318",
  },
  horizontalScroll: {
    marginTop: 10,
  },
  imageContainer: {
    position: "relative",
    marginLeft: 10,
    marginRight: 3,
  },
  image: {
    width: width * 0.3,
    height: 150,
    borderRadius: 8,
  },
  imageContainer2: {
    top: 0,
   backgroundColor:'transparent',
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  image2: {
    width: width * 0.9,
    height: 350,
    borderRadius: 8,
    borderStyle: "solid",
    borderColor: "rgb(197, 197, 197)",
    borderWidth: 1,
    zIndex: 1,
    resizeMode: "cover",
    elevation:10,
  },
  link: {
    flex: 1,
  },
  text: {
    color: "white",
    marginTop: 10,
    marginBottom:5,
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 18,
  },
  containerButtonPrincipal: {
    position: "absolute",
    justifyContent: "flex-end",
    bottom: 0,
    alignItems: "center",
    width: width * 0.9,
    height: 350,
    zIndex: 100,
 
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.171)",
  },
  containerbutton2: {
    width: width * 0.9,
    justifyContent: "space-evenly",
    flexDirection: "row",
  
  },
  buttoninfo: {
    width: width * 0.4,
    height: 40,
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  buttoninfo2: {
    width: width * 0.4,
    height: 40,
    backgroundColor: "rgba(75, 75, 75, 0.753)",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  buttontext: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  buttontext2: {
    color: "black",
    fontSize: 17,
    fontWeight: "bold",
  },
  vwImg: {
    width: width * 0.9,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  imgLogo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
  },
  containerCapa:{
    marginBottom:20,
  },
});
