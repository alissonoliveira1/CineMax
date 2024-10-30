import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Shadow } from "react-native-shadow-2";
import TMDBImage from "@/components/TMDBImage";
import Header from "@/components/header";
import DestaqueImage from "@/components/DestaqueImage";
import { AppContext } from "@/components/Apimages";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  ImageBackground,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Index() {
  const {
    genres,
    logoUrl,
    coresBackground,
    movies,
    movieAcaoAventura,
    movieTerror,
    destaque,
    filmesAlta,
  } = useContext(AppContext);

  const getGenreNames = (genreIds: number[]) => {
    return genreIds
      .map((id) => genres.find((genre) => genre.id === id)?.name) // Busca o nome do gênero
      .filter((name) => name) // Filtra nomes indefinidos
      .join(" ° "); // Junta os nomes em uma string
  };

  const router = useRouter();
  const scrollY = new Animated.Value(0);
  const scrollRoda = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setLoading(false);
    };

    loadData();
  }, []);
  console.log(destaque);
  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  return (
    <SafeAreaView style={styles.container2}>
      <Header scrollY={scrollY} />
      <ScrollView onScroll={scrollRoda}>
        <View style={styles.container}>
          {destaque &&
            destaque.map((movie) => (
              <View style={styles.imageContainer2} key={movie.id}>
                <Shadow
                  offset={[0, 0]}
                  startColor={`rgb(${coresBackground})`}
                  distance={350}
                >
                  <ImageBackground
                    key={movie.id}
                    style={styles.image2}
                    source={{
                      uri: `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`,
                    }}
                  >
                    <View style={{width: width * 0.9,backfaceVisibility:'hidden'}}>
                    <Shadow
                  offset={[0, 170]}
                  startColor={ `rgb(${coresBackground}.534)`}
                  distance={140}
                  paintInside
                  >
                    <View style={styles.containerButtonPrincipal}>
                      <View style={styles.vwImg}>
                        {logoUrl !== null ? (
                          <View style={{ alignItems: "center", justifyContent:'space-evenly' }}>
                            <Image
                              source={{ uri: logoUrl }}
                              style={styles.imgLogo}
                            />
                            <Text
                              style={{ color: "#ececec", fontSize:12.5,fontWeight: "500",marginBottom:5 }}
                            >
                              {" "}
                              {getGenreNames(movie.genre_ids.slice(0, 3))}
                            </Text>
                          </View>
                        ) : (
                          <Text style={styles.text}>{movie.name}</Text>
                        )}
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
                    </View></Shadow>
                 </View>
                  </ImageBackground>
                </Shadow>
              </View>
            ))}
        </View>

        <View style={styles.containerCapa}>
          <Text style={styles.text}>Filmes em Alta</Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={150}
          >
            {filmesAlta &&
              filmesAlta.map((movie) => (
                <View style={styles.imageContainer} key={movie.id}>
                  <TouchableOpacity
                    onPress={() => router.push(`/info?id=${movie.id}`)}
                  >
                    <TMDBImage
                      uri={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                    />
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
        </View>
        <View style={styles.containerCapa}>
          <Text style={styles.text}>Destaque do dia</Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={150}
          >
            {movies &&
              movies.map((movie) => (
                <View style={styles.imageContainer} key={movie.id}>
                  <TouchableOpacity
                    onPress={() => router.push(`/info?id=${movie.id}`)}
                  >
                    <DestaqueImage
                      uri={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                    />
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
        </View>

        <View style={styles.containerCapa}>
          <Text style={styles.text}>Filmes de ação e Aventura</Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={150}
          >
            {movieAcaoAventura &&
              movieAcaoAventura.map((movie) => (
                <View style={styles.imageContainer} key={movie.id}>
                  <TouchableOpacity
                    onPress={() => router.push(`/info?id=${movie.id}`)}
                  >
                    <TMDBImage
                      uri={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                    />
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
        </View>

        <View style={styles.containerCapa}>
          <Text style={styles.text}>Filmes de terror</Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={150}
          >
            {movieTerror &&
              movieTerror.map((movie) => (
                <View style={styles.imageContainer} key={movie.id}>
                  <TouchableOpacity
                    onPress={() => router.push(`/info?id=${movie.id}`)}
                  >
                    <TMDBImage
                      uri={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                    />
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
  container: {
    backgroundColor: "transparent",
    marginTop: 90,
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
  image: {
    width: width * 0.3,
    height: 80,
    borderRadius: 8,
  },
  imageContainer2: {
    
    top: 0,
    backgroundColor: "transparent",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
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
  containerButtonPrincipal: {
 
    justifyContent: "flex-end",
    
    
    alignItems: "center",
    width: width * 0.9,
    height: 180,
    zIndex: 50,

    borderRadius: 8,
 
  },
  containerbutton2: {
    width: width * 0.9,
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  buttoninfo: {
    width: width * 0.39,
    height: 36,
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  buttoninfo2: {
    width: width * 0.39,
    height: 36,
    backgroundColor: "rgba(75, 75, 75, 0.63)",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  buttontext: {
    color: "white",
    fontSize: 16.5,
    fontWeight: "bold",
  },
  buttontext2: {
    color: "black",
    fontSize: 16.5,
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
    height: 90,
    resizeMode: "contain",
  },
  containerCapa: {
    marginBottom: 10,
  },
});
