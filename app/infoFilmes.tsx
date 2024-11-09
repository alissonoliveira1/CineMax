import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
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
  const [ano, setAno] = useState<number | null>(null);
  const [dados, setDados] = useState<{
    release_date?: number;
    name?: string;
    overview?: string;
    poster_path?: string;
    backdrop_path?: string;
    genres?: [{ id: number; name: string }];
    first_air_date?: number;
  }>({});
  console.log(dados)
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
        console.log(idsExternos.data.imdb_id);

        const logos = logoResponse.data.logos.filter(
          (logo: any) => logo.iso_639_1 === "pt" || logo.iso_639_1 === "pt-BR" || logo.iso_639_1 === "en" || logo.iso_639_1 === "en-US"
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
      <View style={styles.containerLogo}>
      <Shadow
                style={{ zIndex: 1 }}
                offset={[0, 0]}
                startColor="#010318"
                distance={40}
              >

<View style={styles.VwLogo}>
                  {logoUrl !== null ? (
                    <Image source={{ uri: logoUrl }} style={styles.logo} />
                  ) : (
                    <Text style={styles.text}>{dados.name}</Text>
                  )}
                </View>
              </Shadow>
      </View>
      <View>
        <Text style={styles.textTemps}>{ano ? ano : 'Data não disponível'}</Text>
      </View>
      <View style={styles.ViewOverVW}>
              <Text style={styles.textOverVW}>{dados.overview ? dados.overview.split('.')[0] + '.' : ''}</Text>
            </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: "rgb(5, 7, 32)",
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
    height: 80,
    alignItems: "center",
  },
  VwLogo: {
    width: width,
    height: 0,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  logo: {
    width: "100%",
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
    width: width * 0.98,
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
});
export default infoFilmes;
