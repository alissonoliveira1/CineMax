import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import FavSvg from "../assets/images/star-fill.svg";
import TrlSvg from "../assets/images/film.svg";
import CompSvg from "../assets/images/share-fill.svg";
import {
  ImageBackground,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import ListSemelhantes from "@/components/ListSemelhantes";
import { Shadow } from "react-native-shadow-2";
import api from "../services";
import { addFav } from "@/components/AddFav";
type AgeRating =
  | "L"
  | "10"
  | "12"
  | "14"
  | "16"
  | "18"
  | "Classificação indisponível";

interface MovieData {
  title: string;
  release_date?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  production_companies?: { name: string; logo_path?: string }[];
  genres?: { id: number; name: string }[];
  first_air_date?: string;
  runtime?: number;
  logo_path?: string;
  id?: number;
}

const { width } = Dimensions.get("window");
const fixedWidth = Dimensions.get("window").width * 0.7;
const aspectRatio = 1 / 3;

function InfoFilmes() {  
  const params = useGlobalSearchParams();
  const { id } = params;
  const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ano, setAno] = useState<number | null>(null);
  const [classificacaoImagem, setClassificacaoImagem] = useState<any>(null);
  const [dados, setDados] = useState<MovieData>({
    title: "",
    release_date: undefined,
    name: "",
    overview: "",
    poster_path: "",
    backdrop_path: "",
    production_companies: undefined,
    genres: undefined,
    first_air_date: undefined,
    runtime: undefined,
    logo_path: undefined,
  });

 
  const fetchData = useCallback(async () => {
    try {
      const [dadosResponse, logoResponse] = await Promise.all([
        api.get(`movie/${id}`, {
          params: { api_key: API_KEY, language: "pt-Br" },
        }),
        api.get(`movie/${id}/images`, { params: { api_key: API_KEY } }),
      ]);

      setDados(dadosResponse.data);

      const logos = logoResponse.data.logos.filter(
        (logo: any) =>
          logo.iso_639_1 === "pt-Br" ||
          logo.iso_639_1 === "en" ||
          logo.iso_639_1 === "en-US"
      );
      if (logos.length > 0) {
        setLogoUrl(`https://image.tmdb.org/t/p/original${logos[0].file_path}`);
      }

      const date = new Date(dadosResponse.data.release_date ?? "");
      setAno(date.getFullYear());
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatRuntime = useCallback(() => {
    if (dados.runtime !== undefined) {
      const hours = Math.floor(dados.runtime / 60);
      const mins = dados.runtime % 60;
      return `${hours}h${mins.toString().padStart(2, "0")}min`;
    }
    return "sem duração";
  }, [dados.runtime]);

  const ageRatingImages: Record<AgeRating, any> = {
    L: require("../assets/images/L.png"),
    "10": require("../assets/images/NR10.png"),
    "12": require("../assets/images/NR12.png"),
    "14": require("../assets/images/NR14.png"),
    "16": require("../assets/images/NR16.png"),
    "18": require("../assets/images/NR18.png"),
    "Classificação indisponível": null,
  };

  const fetchClassificacao = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${dados.id}/release_dates`,
        {
          params: { api_key: API_KEY },
        }
      );

      const releaseDates = response.data.results.find(
        (country: any) => country.iso_3166_1 === "BR"
      );

      if (releaseDates) {
        const certification = releaseDates.release_dates.find(
          (release: any) => release.certification
        )?.certification;

        if (certification) {
          const image =
            ageRatingImages[certification as AgeRating] ||
            ageRatingImages["Classificação indisponível"];
          setClassificacaoImagem(image);
        } else {
          setClassificacaoImagem(ageRatingImages["Classificação indisponível"]);
        }
      } else {
        setClassificacaoImagem(ageRatingImages["Classificação indisponível"]);
      }
    } catch (error) {
      console.error("Erro ao buscar a classificação:", error);
      setClassificacaoImagem(ageRatingImages["Classificação indisponível"]);
    }
  }, [dados.id]);

  useEffect(() => {
    if (dados.id) fetchClassificacao();
  }, [dados.id, fetchClassificacao]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "rgb(3, 4, 7)" }}>
        <ActivityIndicator size="large" color="#5c5c5c" />
      </View>
    );
  }
function handleAddFav(){
  const movie = {
    nome: dados.title,
    categoria: "filmes",
    sobre: dados.overview,
    poster: dados.poster_path,
    backdrop: dados.backdrop_path,
    id: id
  };
  addFav(movie);
}
console.log(dados)
  return (
    <View style={styles.container1}>
      <ImageBackground
        source={{
          uri: `https://image.tmdb.org/t/p/w500${dados.poster_path}`,
        }}
        style={styles.image}
      >
        <View style={styles.overlay} />
      </ImageBackground>
      <FlatList
        data={[{ key: "content" }]}
        style={{ height: "100%", zIndex: 5 }}
        renderItem={() => (
          <View style={{ paddingTop: 300 }}>
            <Shadow
              style={{ zIndex: 16 }}
              offset={[0, 150]}
              startColor={`rgb(3, 4, 7)`}
              distance={150}
              safeRender
              paintInside={true}
            >
              <View style={{ width: width }}></View>
            </Shadow>
            <View style={styles.containerInfos}>
              <View style={styles.VwLogo}>
                {logoUrl ? (
                  <Image
                    source={{ uri: logoUrl }}
                    style={{
                      width: fixedWidth,
                      height: fixedWidth * aspectRatio,
                      resizeMode: "contain",
                    }}
                  />
                ) : (
                  <Text style={styles.text}>{dados.name}</Text>
                )}
              </View>
              <View style={styles.infosFilmes}>
                {classificacaoImagem && (
                  <Image
                    source={classificacaoImagem}
                    style={styles.classEtaria}
                  />
                )}
                <Text style={styles.textInfos}>{formatRuntime()}</Text>
                <Text style={styles.textInfos}>
                  {ano || "Data não disponível"}
                </Text>

                {dados.production_companies &&
                dados.production_companies[0]?.logo_path ? (
                  <View style={styles.viewProdutora}>
                    <Image
                    style={styles.logoProdutora}
                    source={{
                      uri: `https://image.tmdb.org/t/p/original${dados.production_companies[0].logo_path}`,
                    }}
                  />
                  </View>
                ) : (
                  <Text style={styles.textInfos}>
                    {dados.production_companies
                      ? dados.production_companies[0].name
                      : "Nome não disponível"}
                  </Text>
                )}
              </View>
              <View style={{ backgroundColor: "rgb(3, 4, 7)" }}>
                <View style={styles.containerButton}>
                  <TouchableOpacity style={styles.buttonPlay}>
                    <Text style={styles.textButton}>Assistir</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.opcoesGerais}>
                  <TouchableOpacity onPress={handleAddFav} style={styles.alinharOpcoes}>
                    <FavSvg width={20} height={20} color={"white"} />
                    <Text style={styles.textOpcoesGerais}>salvar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.alinharOpcoes}>
                    <TrlSvg width={20} height={20} color={"white"} />
                    <Text style={styles.textOpcoesGerais}>trailer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.alinharOpcoes}>
                    <CompSvg width={20} height={20} color={"white"} />
                    <Text style={styles.textOpcoesGerais}>compartilhar</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.ViewOverVW}>
                  <Text style={styles.textOverVW}>
                    {dados.overview ? dados.overview.split(".")[0] + "." : ""}
                  </Text>
                </View>
                <View>
                  <Text style={styles.textSemelhantes}>Filmes Semelhantes</Text>
                  <ListSemelhantes id={dados.id} />
                </View>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.key}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: "rgb(3, 4, 7)",
    zIndex: 0,
  },
  scroll: {
    flex: 1,
    height: "100%",
    zIndex: 1,
  },
  image: {
    width: width,
    height: 450,
    position: "absolute",
    resizeMode: "cover",
    paddingTop: 300,
    zIndex: -1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },

  VwLogo: {
    width: width,
    height: fixedWidth * aspectRatio,
    marginBottom: 0,
    marginLeft: 20,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  text: {
    top: 0,
    fontWeight: "bold",
    fontSize: 30,
    height: 100,
    color: "#ffffff",
  },
  ViewOverVW: {
    width: width * 0.90,
    marginTop: 0,
    marginLeft: 20,
    marginRight:20,
    
    zIndex: 0,
  },
  textOverVW: {
    color: "#e4e4e4",
    fontSize: 15,
  },
  textTemps: {
    fontSize: 15,
    color: "#ffffff",
  },
  containerInfos: {
    width: width,
    justifyContent: "flex-start",
  },
  infosFilmes: {
    width: width * 0.9,
    flexDirection: "row",
    gap: 10,
    marginLeft: 20,
    marginTop:20,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonPlay: {
    width: width * 0.9,
    height: 40,
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  textButton: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  containerButton: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    zIndex: 0,
  },
  viewProdutora:{
    padding:1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    backgroundColor: "#dfdfdf",
  },
  logoProdutora: {
    width: 50,
    height: 20,
    resizeMode: "contain",
    borderRadius: 2,
    backgroundColor: "#dfdfdf",
    padding:10,
  },
  textInfos: {
    color: "#ffffff",
    fontSize: 13,
  },
  classEtaria: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  opcoesGerais: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    zIndex: 0,
  },
  textOpcoesGerais: {
    color: "white",
    fontSize: 12,
    marginTop: 8,
    zIndex: 0,
  },
  alinharOpcoes: {
    width: 80,

    alignItems: "center",
  },
  textSemelhantes:{
    color: "white",
    fontSize: 20,
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 10,
  },
});
export default InfoFilmes;
