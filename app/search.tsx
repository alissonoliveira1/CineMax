import { useState, useContext } from "react";
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { AppContext } from "@/components/Apimages";
import api from "./services";
const { width } = Dimensions.get("window");

interface TVShow {
  type: string;
  name: string;
  id: number;
  title: string;
  backdrop_path: string;
  season_number: number;
}

function Search() {
  const { movies } = useContext(AppContext);
  const [seasonData, setSeasonData] = useState<Record<number, any>>({});
  const [search, setSearch] = useState("");
  const [movies2, setMovies] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";
  const searchMovies = async () => {
    setLoading(true);
    try {
      const [responseMovie, responseFilme] = await Promise.all([
        api.get(`search/movie`, {
          params: { api_key: API_KEY, query: search, language: "pt-BR" },
        }),
        api.get(`search/tv`, {
          params: { api_key: API_KEY, query: search, language: "pt-BR" },
        }),
      ]);
      const allResults = [
        ...responseMovie.data.results.map((movie: TVShow) => ({
          ...movie,
          type: "movie",
        })),
        ...responseFilme.data.results.map((tvShow: TVShow) => ({
          ...tvShow,
          type: "tv",
        })),
      ];
      await Promise.all(
        responseFilme.data.results.map(async (tvShow: any) => {
          const seasonsResponse = await api.get(
            `tv/${tvShow.id}?api_key=${API_KEY}`
          );
          setSeasonData((prev) => ({
            ...prev,
            [tvShow.id]: seasonsResponse.data.seasons.slice(0, 1),
          }));
        })
      );
      setMovies(allResults);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewInput}>
        <TextInput
          placeholderTextColor={"#a7a7a7"}
          placeholder="Encontre filmes e series"
          style={styles.inputText}
          value={search}
          onChange={searchMovies}
          onChangeText={(text) => setSearch(text)}
        />
      </View>

      {search.length > 0 ? (
        <ScrollView>
          <View style={styles.containerResults}>
            {movies2.map((movie) => (
              <View style={styles.results} key={movie.id}>
                <Image
                  style={styles.image}
                  source={{
                    uri: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
                    cache: "reload",
                  }}
                />
                <View>
                  <Text style={styles.textResults}>
                    {movie.title || movie.name}
                  </Text>
                  <Text style={styles.textResults}>
                    {movie.type === "tv" && seasonData[movie.id] && (
                      <Text>
                        {seasonData[movie.id].map((season: any) => (
                          <Text key={season.id}>
                            <Text>Temporada {season.season_number}</Text>
                          </Text>
                        ))}
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.containerScroll}>
          {movies.map((movie) => (
            <View style={styles.destaqueResults} key={movie.id}>
              <Image
                style={styles.imageDestaque}
                source={{
                  uri: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
                  cache: "reload",
                }}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(5, 7, 32)",
    flexDirection: "column",
  },
  containerScroll: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 2,
    paddingTop: 80,
  },
  viewInput: {
    position: "absolute",
    top: 0,
    flex: 1,
    zIndex: 20,
    width: width,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(5, 7, 32)",
  },
  inputText: {
    backgroundColor: "rgb(38, 39, 56)",
    color: "white",
    width: width - 40,
    padding: 10,
    fontSize: 18,
    borderRadius: 5,
  },
  image: {
    width: 120,
    height: 70,
    marginRight: 10,
  },
  textResults: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  containerResults: {
    zIndex: 10,
    width: width,
    marginTop: 80,
    padding: 10,
  },
  results: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  imageDestaque: {
    width: 160,
    height: 220,
    resizeMode: "cover",
    borderRadius: 5,
  },
  destaqueResults: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Distribui os itens uniformemente
    padding: 5,
  },
});
export default Search;
