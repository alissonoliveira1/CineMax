import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useCallback } from "react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Shadow } from "react-native-shadow-2";
import axios from "axios";
import api from "../services";

const { width } = Dimensions.get("window");
const aspectRadio = width * 0.9;
const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";
const currentDate = new Date().toISOString().split("T")[0];

type MediaType = "movie" | "tv";

interface Logo {
  file_path: string;
  iso_639_1: string;
}

const getLogoByPriority = (
  logos: Logo[],
  idiomasPrioridade: string[]
): string | null => {
  return (
    logos.find((logo) => idiomasPrioridade.includes(logo.iso_639_1))
      ?.file_path || null
  );
};

interface MovieImage {
  file_path: string;
  iso_639_1: string;
}

const fetchMovieImages = async (
  movieId: number,
  type: MediaType
): Promise<MovieImage[]> => {
  try {
    const endpoint =
      type === "movie" ? `movie/${movieId}/images` : `tv/${movieId}/images`;
    const { data } = await api.get(endpoint, { params: { api_key: API_KEY } });
    return data.logos;
  } catch {
    return [];
  }
};

interface MediaResult {
  id: number;
  genre_ids: number[];
  backdrop_path: string;
  name?: string;
  title?: string;
}

const fetchMedia = async (
  type: MediaType,
  genreId: number
): Promise<MediaResult[]> => {
  try {
    const { data } = await api.get(`discover/${type}`, {
      params: {
        api_key: API_KEY,
        language: "pt-BR",
        with_genres: genreId,
        page: 1,
        first_air_date_lte: currentDate,
      },
    });
    return data.results.slice(0, 10);
  } catch {
    return [];
  }
};

interface ImageDestaqueProps {
  type: MediaType;
}

const ImageDestaque = React.memo(({ type }: ImageDestaqueProps) => {
  const router = useRouter();
 
  const [destaque, setDestaque] = useState<
    (MediaResult & { logoPath: string }) | null
  >(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [coresBackground, setCoresBackground] = useState(["9, 14, 82"]);
  const [generos, setGeneros] = useState<{ id: number; name: string }[]>([]);
  const shimmerAnim = new Animated.Value(0);


  Animated.loop(
    Animated.timing(shimmerAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    })
  ).start();

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, Dimensions.get("window").width],
  });
  const loadGeneros = useCallback(async () => {
    try {
      const { data } = await api.get("genre/tv/list", {
        params: { api_key: API_KEY, language: "pt-BR" },
      });
      setGeneros(data.genres);
    } catch (error) {
      console.error("Erro ao carregar gêneros:", error);
    }
  }, []);

  const getMoviesWithLogos = useCallback(async () => {
    const moviesWithLogos: Array<MediaResult & { logoPath: string }> = [];
    const fetchMovies = generos.map(async (genero) => {
      const movies = await fetchMedia(type, genero.id);
      const filteredMovies = await Promise.all(
        movies.map(async (movie) => {
          if (movie.genre_ids?.length > 0 && movie.backdrop_path) {
            const logos = await fetchMovieImages(movie.id, type);

            const logoPath = getLogoByPriority(logos, [
              "pt-Br",
              "pt",
              "en-US",
              "en",
            ]);
            if (logoPath) {
              return { ...movie, logoPath };
            }
          }
          return null;
        })
      );
      moviesWithLogos.push(
        ...filteredMovies.filter(
          (movie): movie is MediaResult & { logoPath: string } => movie !== null
        )
      );
    });

    await Promise.all(fetchMovies);
    return moviesWithLogos;
  }, [generos, type]);

  useEffect(() => {
    loadGeneros();
  }, [loadGeneros]);

  useEffect(() => {
    const loadDestaque = async () => {
      if (generos.length === 0) return;

      try {
        const filmesComLogoEGênero = await getMoviesWithLogos();
        if (filmesComLogoEGênero.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * filmesComLogoEGênero.length
          );
          const destaqueSelecionado = filmesComLogoEGênero[randomIndex];
          setDestaque(destaqueSelecionado);
          setLogoUrl(
            `https://image.tmdb.org/t/p/w500${destaqueSelecionado.logoPath}`
          );

          const imageUrl = `https://image.tmdb.org/t/p/w500${destaqueSelecionado.backdrop_path}`;
          const { data } = await axios.get(
            `https://colorstrac.onrender.com/get-colors?imageUrl=${imageUrl}`
          );
          setCoresBackground(data.dominantColor);
        }
      } catch (error) {
        console.error("Erro ao buscar destaque:", error);
      } finally {
    
      }
    };

    loadDestaque();
  }, [getMoviesWithLogos]);

  const getGenreNames = useCallback(
    (genreIds: number[]): string =>
      genreIds
        .map((id) => generos.find((genre) => genre.id === id)?.name)
        .filter(Boolean)
        .join(" ° "),
    [generos]
  );

  return (
    <View style={styles.container}>
      {!destaque && (
        <View style={styles.shimmerContainer}>
          <View style={styles.image2}>
            <Animated.View
              style={[
                styles.shimmerGradient,
                {
                  transform: [{ translateX }],
                },
              ]}
            >
              <Shadow offset={[0, 0]} startColor={`#2e2e2e`} distance={100}>
                <LinearGradient
                  colors={["#2e2e2e", "#2e2e2e", "#2e2e2e"]}
                  style={styles.gradient}
                />
              </Shadow>
            </Animated.View>
          </View>
        </View>
      )}
      {destaque && (
        <View style={styles.imageContainer2}>
          <Shadow
            offset={[0, 0]}
            startColor={`rgb(${coresBackground})`}
            distance={350}
          >
            <View style={styles.container4}>
              <Image
                style={styles.image3}
                source={{
                  uri: `https://image.tmdb.org/t/p/original/${destaque.backdrop_path}`,
                }}
                cachePolicy={"disk"}
                priority={'high'}
              />

              <View style={{ width: width * 0.9 }}>
                <Shadow
                  offset={[0, 170]}
                  startColor={`rgb(${coresBackground}.534)`}
                  distance={140}
                  paintInside
                >
                  <View style={styles.containerButtonPrincipal}>
                    <View style={styles.vwImg}>
                      {logoUrl ? (
                        <View style={{ alignItems: "center" }}>
                          <Image
                            source={{ uri: logoUrl }}
                            cachePolicy="memory"
                            style={styles.imgLogo}
                          />
                          <Text
                            style={{
                              color: "#ececec",
                              fontSize: 12.5,
                              fontWeight: "500",
                              marginBottom: 5,
                            }}
                          >
                            {getGenreNames(destaque.genre_ids.slice(0, 3))}
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.text}>{destaque.name}</Text>
                      )}
                    </View>
                    <View style={styles.containerbutton2}>
                      <View style={styles.buttoninfo}>
                        <Text style={styles.buttontext2}>Assistir</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => router.push(destaque.name ? `/info?id=${destaque.id}` : `/infoFilmes?id=${destaque.id}`)}
                      >
                        <View style={styles.buttoninfo2}>
                          <Text style={styles.buttontext}>Informações</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Shadow>
              </View>
            </View>
          </Shadow>
        </View>
      )}
    </View>
  );
});

export default ImageDestaque;

const styles = StyleSheet.create({
  shimmerContainer: {
    top: 0,
    backgroundColor: "transparent",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  shimmerGradient: {
    position: "absolute",
    width: 100,
    height: "100%",
  },
  gradient: {
    flex: 1,
  },
  container: {
    backgroundColor: "transparent",
    marginTop: 70,
  },
  imageContainer2: {
    top: 0,
    backgroundColor: "transparent",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },

  image3: {
    width: width * 0.9,
    height: 400,
    borderRadius: 10,
   
    position: "absolute",
  },
  container4: {
    transform: [{ translateY: -40 }],
    width: width * 0.9,
    height: 400,
    justifyContent: "flex-end",
    position: "relative",
    overflow: "hidden",
    elevation: 10,
    zIndex: 1,
    borderColor: "rgb(141, 141, 141)",
    borderWidth: 1,
    borderRadius: 10,
  },

  trailer: {
    flex: 1,
  },
  containervideo: {
    width: width * 0.9,
    height: 400,
    aspectRatio: aspectRadio / 400,
    overflow: "hidden",
    borderRadius: 10,
    borderColor: "rgb(141, 141, 141)",
    borderWidth: 1,
  },
  containerButtonPrincipal: {
    justifyContent: "flex-end",
    alignItems: "center",
    width: width * 0.9,
    height: 180,
    zIndex: 50,
    borderRadius: 8,
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
  containerbutton2: {
    width: width * 0.9,
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
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
  placeholder: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  image2: {
    overflow: "hidden",
    justifyContent: "flex-end",
    width: width * 0.9,
    height: 400,
    backgroundColor: "#1d1e27",
    borderRadius: 10,
    borderColor: "rgb(141, 141, 141)",
    borderWidth: 1,
    zIndex: 1,
    elevation: 10,
    transform: [{ translateY: -40 }],
 
  },
});
