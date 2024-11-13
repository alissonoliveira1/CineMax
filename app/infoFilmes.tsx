import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  ImageBackground,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { Shadow } from "react-native-shadow-2";
import api from "./services";

type AgeRating =  "L" | "10" | "12" | "14" | "16" | "18" | "Classificação indisponível";

// Tipo para uma data de lançamento em um país específico
interface ReleaseDate {
  certification: AgeRating;
}

// Tipo para o resultado de classificação por país
interface CountryRelease {
  iso_3166_1: string; // Código do país, ex: "BR", "US"
  release_dates: ReleaseDate[];
}

// Tipo do objeto `movie`
interface Movie {
  title: string;
  release_dates?: {
    results: CountryRelease[];
  };
}

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

interface AgeRatingResult {
  rating: AgeRating;
  image: string | null;
}

const { width } = Dimensions.get("window");

function InfoFilmes() {
  const params = useGlobalSearchParams();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ano, setAno] = useState<number | null>(null);
  const [classificacao, setClassificacao] = useState<string | null>(null);
  const [classificacaoImagem, setClassificacaoImagem] = useState<any>(null);
  const [dados, setDados] = useState<MovieData>({
    title: "",
    release_date: undefined,
    name: undefined,
    overview: undefined,
    poster_path: undefined,
    backdrop_path: undefined,
    production_companies: undefined,
    genres: undefined,
    first_air_date: undefined,
    runtime: undefined,
    logo_path: undefined,
  });
  const [coresBackground, setCoresBackground] = useState<string[]>(["5, 7, 32"]);

  const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";
  const { id } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dadosResponse, logoResponse] = await Promise.all([
          api.get(`movie/${id}`, {
            params: { api_key: API_KEY, language: "pt-BR" },
          }),
          api.get(`movie/${id}/images`, { params: { api_key: API_KEY } }),
        ]);

        setDados(dadosResponse.data);

        const logos = logoResponse.data.logos.filter(
          (logo: any) => logo.iso_639_1 === "pt-BR" || logo.iso_639_1 === "en" || logo.iso_639_1 === "en-US"
        );
        if (logos.length > 0) {
          setLogoUrl(`https://image.tmdb.org/t/p/original${logos[0].file_path}`);
        }

        const date = new Date(dadosResponse.data.release_date ?? "");
        setAno(date.getFullYear());
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchBackgroundColors = async () => {
      if (dados.poster_path) {
        const imageUrl = `https://image.tmdb.org/t/p/w500${dados.poster_path}`;
        try {
          const colorResponse = await axios.get(
            `https://colorstrac.onrender.com/get-colors?imageUrl=${imageUrl}`
          );
          setCoresBackground(colorResponse.data.dominantColor);
        } catch (error) {
          console.error("Erro ao buscar cores de fundo:", error);
        }
      }
    };
    fetchBackgroundColors();
  }, [dados]);

  function formatRuntime() {
    if (dados.runtime !== undefined) {
      const hours = Math.floor(dados.runtime / 60);
      const mins = dados.runtime % 60;
      return `${hours}h${mins.toString().padStart(2, "0")}min`;
    }
    return "sem duração";
  }

  const ageRatingImages: Record<AgeRating, any> = {
    "L": require("../assets/images/L.png"),
    "10": require("../assets/images/NR10.png"),
    "12": require("../assets/images/NR12.png"),
    "14": require("../assets/images/NR14.png"),
    "16": require("../assets/images/NR16.png"),
    "18": require("../assets/images/NR18.png"),
    "Classificação indisponível": null,
  };
 
  useEffect(() => {
    const fetchClassificacao = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${dados.id}/release_dates`,
          {
            params: { api_key: API_KEY },
          }
        );

        const releaseDates = response.data.results.find(
          (country:any) => country.iso_3166_1 === "BR" // busca classificação para o Brasil
        );

        if (releaseDates) {
          const certification = releaseDates.release_dates.find(
            (release:any) => release.certification
          )?.certification;

          if (certification) {
            setClassificacao(certification);

            // Verifica a imagem correspondente à classificação
            const image = ageRatingImages[certification as AgeRating] || ageRatingImages["Classificação indisponível"];
            setClassificacaoImagem(image);
          } else {
            setClassificacao("Classificação indisponível");
            setClassificacaoImagem(ageRatingImages["Classificação indisponível"]);
          }
        } else {
          setClassificacao("Classificação indisponível");
          setClassificacaoImagem(ageRatingImages["Classificação indisponível"]);
        }
      } catch (error) {
        console.error("Erro ao buscar a classificação:", error);
        setClassificacao("Classificação indisponível");
        setClassificacaoImagem(ageRatingImages["Classificação indisponível"]);
      }
    };

    fetchClassificacao();
  }, [dados.id]);
  console.log( )
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

      <Shadow
        style={{ zIndex: 1 }}
        offset={[0, 0]}
        startColor={`rgb(${coresBackground})`}
        distance={70}
      ></Shadow>

      <View style={styles.containerInfos}>
        <View style={styles.VwLogo}>
          {logoUrl !== null ? (
            <Image source={{ uri: logoUrl }} style={styles.logo} />
          ) : (
            <Text style={styles.text}>{dados.name}</Text>
          )}
        </View>
        <View style={styles.infosFilmes}>
        {classificacaoImagem ? (
          <Image
          source={classificacaoImagem}
            style={styles.classEtaria}
          />
        ) : null}
          <Text style={styles.textInfos}>{formatRuntime()}</Text>

          <Text style={styles.textInfos}>
            {ano ? ano : "Data não disponível"}
          </Text>

          {dados.production_companies &&
          dados.production_companies[0]?.logo_path ? (
            <Image
              style={styles.logoProdutora}
              source={{
                uri: `https://image.tmdb.org/t/p/original${dados.production_companies[0].logo_path}`,
              }}
            />
          ) : (
            <Text style={styles.textInfos}>
              {dados.production_companies
                ? dados.production_companies[0].name
                : "Nome não disponível"}
            </Text>
          )}
        </View>
        <View style={styles.containerButton}>
          <TouchableOpacity style={styles.buttonPlay}>
            <Text style={styles.textButton}>Assistir</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity>
            <Text>salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>trailer</Text>
          </TouchableOpacity>
          <TouchableOpacity><Text>compartilhar</Text></TouchableOpacity>
        </View>
        <View style={styles.ViewOverVW}>
          <Text style={styles.textOverVW}>
            {dados.overview ? dados.overview.split(".")[0] + "." : ""}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: "rgb(3, 4, 7)",
  },
  image: {
    width: width,
    height: 350,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  containerLogo: {
    position: "relative",
    top: 0,
    width: width,
    height: 100,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  VwLogo: {
    width: width,
    height: 100,
    marginBottom: 15,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  logo: {
    width: "95%",
    height: 100,
    resizeMode: "contain",
  },
  text: {
    top: 0,
    fontWeight: "bold",
    fontSize: 30,
    height: 100,
    color: "#ffffff",
  },
  ViewOverVW: {
    width: width * 0.94,
    marginTop: 0,
    marginBottom: 0,
    marginHorizontal: 5,
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
    paddingLeft: 10,
    paddingRight: 10,
    position: "relative",
    bottom: 50,
  },
  infosFilmes: {
    width: width * 0.9,
    flexDirection: "row",
    gap: 10,
    marginLeft: 5,
    marginTop: 10,
    alignItems: "center",
  },
  buttonPlay: {
    width: width * 0.9,
    height: 40,
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
  },
  logoProdutora: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 5,
  },
  textInfos: {
    color: "#ffffff",
    fontSize: 13,
  },
  classEtaria:{
    width: 20,
    height: 20,
    resizeMode: "contain",
  }
});
export default InfoFilmes;
