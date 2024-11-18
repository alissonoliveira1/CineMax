import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Shadow } from "react-native-shadow-2";
import api from "../app/services";

const { width } = Dimensions.get("window");
const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";
const currentDate = new Date().toISOString().split("T")[0];

// Definir os tipos para movie e tv
type MediaType = "movie" | "tv";

// Função para obter o logo baseado nas preferências de idioma
const getLogoByPriority = (logos: any[], idiomasPrioridade: string[]) => {
  return logos.find((logo) => idiomasPrioridade.includes(logo.iso_639_1))?.file_path || null;
};

// Função para buscar imagens de filmes
const fetchMovieImages = async (movieId: string, type: MediaType) => {
  try {
    const endpoint = type === "movie" ? `movie/${movieId}/images` : `tv/${movieId}/images`;
    const { data } = await api.get(endpoint, {
      params: { api_key: API_KEY },
    });
    return data.logos;
  } catch (error) {
    console.error(`Erro ao buscar imagens para o ${type} com ID: ${movieId}`, error);
    return [];
  }
};

// Função para buscar filmes ou séries
const fetchMedia = async (type: MediaType, genreId: number) => {
  try {
    const response = await api.get(`discover/${type}`, {
      params: {
        api_key: API_KEY,
        language: "pt-BR",
        with_genres: genreId,
        page: 1,
        first_air_date_lte: currentDate,
      },
    });
    return response.data.results.slice(0, 10); // Pegando apenas os 10 primeiros
  } catch (error) {
    console.error(`Erro ao buscar ${type === "movie" ? "filmes" : "séries"} do gênero ${genreId}`, error);
    return [];
  }
};

const ImageDestaque: React.FC<{ type: MediaType }> = ({ type }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [destaque, setDestaque] = useState<any>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [coresBackground, setCoresBackground] = useState<string[]>(["9, 14, 82"]);
  const [generos, setGeneros] = useState<any[]>([]);

  useEffect(() => {
    const getGeneros = async () => {
      try {
        const response = await api.get("genre/tv/list", {
          params: { api_key: API_KEY, language: "pt-BR" },
        });
        setGeneros(response.data.genres);
      } catch (error) {
        console.error("Erro ao buscar os gêneros:", error);
      }
    };

    getGeneros();
  }, []);

  useEffect(() => {
    const getInitialData = async () => {
      try {
        const idiomasPrioridade = ["pt-BR", "pt", "en-US", "en"];
        const filmesComLogoEGênero = await getMoviesWithLogos(generos, type);

        if (filmesComLogoEGênero.length > 0) {
          // Escolher aleatoriamente um dos 10 primeiros filmes
          const randomIndex = Math.floor(Math.random() * filmesComLogoEGênero.length);
          const destaqueSelecionado = filmesComLogoEGênero[randomIndex];
          setDestaque(destaqueSelecionado);
          setLogoUrl(`https://image.tmdb.org/t/p/original${destaqueSelecionado.logoPath}`);

          // Cor do fundo baseada no backdrop
          const imageUrl = `https://image.tmdb.org/t/p/original${destaqueSelecionado.backdrop_path}`;
          const colorResponse = await axios.get(`https://colorstrac.onrender.com/get-colors?imageUrl=${imageUrl}`);
          setCoresBackground(colorResponse.data.dominantColor);
        }
      } catch (error) {
        console.error("Erro ao buscar dados de filmes:", error);
      }
    };

    getInitialData();
  }, [generos, type]);

  const getMoviesWithLogos = async (generos: any[], type: MediaType) => {
    const moviesWithLogos = [];
  
    for (const genero of generos) {
      const movies = await fetchMedia(type, genero.id);
      for (const movie of movies) {
        if (movie.genre_ids?.length > 0 && movie.backdrop_path) {
          const logos = await fetchMovieImages(movie.id, type); // Passa o tipo para a função
          const logoPath = getLogoByPriority(logos, ["pt-BR", "pt", "en-US", "en"]);
          if (logoPath) {
            moviesWithLogos.push({ ...movie, logoPath });
          }
        }
      }
    }
  
    return moviesWithLogos;
  };

  const getGenreNames = (genreIds: number[]) => {
    return genreIds
      .map((id) => generos.find((genre) => genre.id === id)?.name)
      .filter((name) => name)
      .join(" ° ");
  };

  return (
    <View style={styles.container}>
      {destaque && (
        <View style={styles.imageContainer2}>
          <Shadow
            offset={[0, 0]}
            startColor={`rgb(${coresBackground})`}
            distance={350}
          >
            <ImageBackground
              resizeMode="cover"
              style={styles.image2}
              onLoadEnd={() => setLoading(false)}
              onError={() => setError(true)}
              source={{
                uri: `https://image.tmdb.org/t/p/original/${destaque.backdrop_path}`,
                cache: "reload",
              }}
            >
              {(loading || error) && (
                <View style={styles.placeholder}>
                  <ActivityIndicator size="large" color="#5c5c5c" />
                </View>
              )}
              <View style={{ width: width * 0.9 }}>
                <Shadow
                  offset={[0, 170]}
                  startColor={`rgb(${coresBackground}.534)`}
                  distance={140}
                  paintInside
                >
                  <View style={styles.containerButtonPrincipal}>
                    <View style={styles.vwImg}>
                      {logoUrl !== null ? (
                        <View style={{ alignItems: "center" }}>
                          <Image
                            source={{ uri: logoUrl }}
                            cachePolicy={"memory"}
                            style={styles.imgLogo}
                          />
                          <Text style={{ color: "#ececec", fontSize: 12.5, fontWeight: "500", marginBottom: 5 }}>
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
                      <TouchableOpacity onPress={() => router.push(`/info?id=${destaque.id}`)}>
                        <View style={styles.buttoninfo2}>
                          <Text style={styles.buttontext}>Informações</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Shadow>
              </View>
            </ImageBackground>
          </Shadow>
        </View>
      )}
    </View>
  );
};

export default ImageDestaque;

const styles = StyleSheet.create({
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
  image2: {
    overflow: "hidden",
    justifyContent: "flex-end",
    width: width * 0.9,
    height: 400,
    borderRadius: 10,
    borderColor: "rgb(197, 197, 197)",
    borderWidth: 1,
    zIndex: 1,
    elevation: 10,
    transform: [{ translateY: -50 }],
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
});
