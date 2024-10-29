import React, { useContext  } from "react";

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
  ListRenderItem,
  Animated,
} from "react-native";


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
  
 
  const router = useRouter();


  const scrollY = new Animated.Value(0);
  
  const {
    logoUrl,
    coresBackground,
    movies,
    movieAcaoAventura,
    movieTerror,
    destaque,
    filmesAlta,
  } = useContext(AppContext);
console.log(logoUrl);
  const scrollRoda = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );
  console.log('Logo URL:', logoUrl);
  console.log('Cores Background:', coresBackground);
  console.log('Movies:', movies);
  console.log('Ação e Aventura Movies:', movieAcaoAventura);
  console.log('Terror Movies:', movieTerror);
  console.log('Destaque:', destaque);
  console.log('Filmes em Alta:', filmesAlta);

  interface RenderCapasProps {
    item: TVShow;
    onPress: () => void;
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



  return (
    <SafeAreaView style={styles.container2}>
      <Header scrollY={scrollY} />
      <ScrollView onScroll={scrollRoda}>
        <View style={styles.container}>
          {destaque && destaque.map((movie) => (
            <View style={styles.imageContainer2} key={movie.id}>
              <Shadow
                offset={[0, 0]}
                startColor={`rgb(${coresBackground})`}
                distance={350}
              >
                <Image
                  style={styles.image2}
                  source={{
                    uri: `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`,
                  }}
                />
              </Shadow>
              <View style={styles.containerButtonPrincipal}>
                <View style={styles.vwImg}>
                  {logoUrl !== null ? (
                    <Image source={{ uri: logoUrl }} style={styles.imgLogo} />
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
              </View>
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
            {filmesAlta && filmesAlta.map((movie) => (
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
            {movies && movies.map((movie) => (
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
            {movieAcaoAventura && movieAcaoAventura.map((movie) => (
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
            {movieTerror && movieTerror.map((movie) => (
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
    width: width * 0.9,
    height: 350,
    borderRadius: 8,
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
    position: "absolute",
    justifyContent: "flex-end",
    bottom: 0,
    alignItems: "center",
    width: width * 0.9,
    height: 350,
    zIndex: 50,

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
  containerCapa: {
    marginBottom: 10,
  },
});