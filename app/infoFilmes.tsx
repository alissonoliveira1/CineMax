import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState, useContext } from "react";
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

const { width } = Dimensions.get("window");
function infoFilmes() {
  const params = useGlobalSearchParams();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";
  const { id } = params;
  const [coresBackground, setCoresBackground] = useState<string[]>([
    "5, 7, 32",
  ]);
  const [ano, setAno] = useState<number | null>(null);
  const [dados, setDados] = useState<{
    release_date?: number;
    name?: string;
    overview?: string;
    poster_path?: string;
    backdrop_path?: string;
    production_companies?: [{ name: string; logo_path?: string }];
    genres?: [{ id: number; name: string }];
    first_air_date?: number;
    runtime?: number;
    logo_path?: string;
  }>({});

  console.log(dados.poster_path);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dadosResponse, logoResponse, idsExternos] = await Promise.all([
          api.get(`movie/${id}`, {
            params: { api_key: API_KEY, language: "pt-BR" },
          }),
          api.get(`movie/${id}/images`, { params: { api_key: API_KEY } }),

          api.get(`movie/${id}/external_ids`, {
            params: { api_key: API_KEY, language: "pt-BR" },
          }),
        ]);

        setDados(dadosResponse.data);

        const logos = logoResponse.data.logos.filter(
          (logo: any) =>
            logo.iso_639_1 === "pt-BR" ||
            logo.iso_639_1 === "en" ||
            logo.iso_639_1 === "en-US"
        );
        if (logos.length > 0) {
          setLogoUrl(
            `https://image.tmdb.org/t/p/original${logos[0].file_path}`
          );
        }
        const date = new Date(dadosResponse.data.release_date);
        setAno(date.getFullYear());
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const imageUrl = `https://image.tmdb.org/t/p/w500${dados.poster_path}`;
      const colorResponse = await axios.get(
        `https://colorstrac.onrender.com/get-colors?imageUrl=${imageUrl}`
      );
      setCoresBackground(colorResponse.data.dominantColor);
    };
    fetchData();
  }, [dados]);
  function formatRuntime() {
    if (dados.runtime !== undefined) {
      const hours = Math.floor(dados.runtime / 60);
      const mins = dados.runtime % 60;
      return `${hours}h${mins.toString().padStart(2, "0")}min`;
    }
    return "Runtime not available";
  }
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
        >
     
        </Shadow>
  
      <View style={styles.containerInfos}>
      <View style={styles.VwLogo}>
            {logoUrl !== null ? (
              <Image source={{ uri: logoUrl }} style={styles.logo} />
            ) : (
              <Text style={styles.text}>{dados.name}</Text>
            )}
          </View>
        <View style={styles.infosFilmes}>
            <Text style={styles.textInfos}>{formatRuntime()}</Text>

            <Text style={styles.textInfos}>
            {ano ? ano : "Data não disponível"}
          </Text>
          
          {dados.production_companies && dados.production_companies[0]?.logo_path ? (
              <Image style={styles.logoProdutora} source={{uri: `https://image.tmdb.org/t/p/original${dados.production_companies[0].logo_path}`}}/>
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
    width: width ,
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
    marginBottom:15,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  logo: {
    width: '95%',
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
    bottom:50,
  },
  infosFilmes: {
    width: width * 0.90,
    flexDirection: "row",
    gap: 10,
    marginLeft: 5,
    marginTop: 10,
    alignItems: "center",
  },
  buttonPlay: {
    width: width * 0.90,
    height: 40,
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    
  },
  textButton:{
   color: "black",
    fontSize: 20,
    fontWeight: "bold",

  },
  containerButton:{
  justifyContent: "center",
  alignItems: "center",
  marginBottom:20,
  },
  logoProdutora: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 5,
  },
  textInfos:{
    color: "#ffffff",
    fontSize: 13,
  }
});
export default infoFilmes;
