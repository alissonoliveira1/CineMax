import React, { useEffect, useState } from "react";
import { useGlobalSearchParams } from "expo-router";
import api from "./services";
import { Shadow } from 'react-native-shadow-2';

import { useRouter } from "expo-router";
import {
  Text,
  View,
  Image,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Info() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const params = useGlobalSearchParams();
  const { id } = params;
  const [seasons, setSeasons] = useState<any>([]);
  const [titleTemp, setTitleTemp] = useState<string | null>(
    seasons.length > 0 ? seasons[0].name : null
  );
  const [epsode, setEpisodes] = useState<any>(null);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [ano, setAno] = useState<number | null>(null);
  const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";

  const [dados, setDados] = useState<{
    name?: string;
    overview?: string;
    poster_path?: string;
    backdrop_path?: string;
    genres?: [{ id: number; name: string }];
    seasons?: [{ season_number: number; name: string }];
    number_of_seasons?: number;
    first_air_date?: number;
  }>({});
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dadosResponse, logoResponse] = await Promise.all([
          api.get(`tv/${id}`, {
            params: { api_key: API_KEY, language: "pt-BR" },
          }),
          api.get(`tv/${id}/images`, { params: { api_key: API_KEY } }),
        ]);

        setDados(dadosResponse.data);
        
        const validSeasons = dadosResponse.data.seasons?.filter(
          (season: any) => season.name !== "Especiais"
        );
        setSeasons(validSeasons);

        const logos = logoResponse.data.logos.filter(
          (logo: any) => logo.iso_639_1 === "pt" || logo.iso_639_1 === "pt-BR"
        );
        if (logos.length > 0) {
          setLogoUrl(
            `https://image.tmdb.org/t/p/original${logos[0].file_path}`
          );
        }

        if (validSeasons?.length > 0) {
          setTitleTemp(validSeasons[0].name);
          setSelectedSeason(validSeasons[0].season_number);
        }
        const date = new Date(dadosResponse.data.first_air_date);
        setAno(date.getFullYear());
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (selectedSeason === null) return;

    const fetchEpisodes = async () => {
      try {
        const response = await api.get(`tv/${id}/season/${selectedSeason}`, {
          params: { api_key: API_KEY, language: "pt-BR" },
        });
        setEpisodes(response.data.episodes);
      } catch (error) {
        console.error("Erro ao buscar episódios:", error);
      }
    };
    fetchEpisodes();
  }, [id, selectedSeason]);

  const handleSeasonSelect = (season_number: number, name: string) => {
    setIsPressed(true);
    setSelectedSeason(season_number);
    setTitleTemp(name);
    setIsPressed(!isPressed);
  };
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center",backgroundColor: "#010318", }}>
        <Text style={{ color: "white" }}>Carregando...</Text>
      </View>
    );
  }
  const renderEps = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => router.push(`/info`)} style={{alignItems:'center'}}>
      <View style={styles.containerEpsAll}>
        <View style={styles.viewCapaEps}>
       
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${item.still_path}`,
            }}
            style={styles.imageCapaEps}
          />
          
          <View>
            <Text style={styles.nameEpsAll}>
              {item.episode_number}. {item.name}
            </Text>
            <Text style={styles.timeEpsAll}>{item.runtime}m</Text>
          </View>
        </View>
        <View>
          <Text style={styles.sobreEpsAll}>{item.overview}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSeason = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleSeasonSelect(item.season_number, item.name)}
    >
      <View style={styles.temps}>
        <Text style={styles.tempname}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
    <FlatList
      data={epsode}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderEps}
      ListEmptyComponent={<Text>Nenhuma temporada encontrada.</Text>}
      ListHeaderComponent={
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${dados.poster_path}`,
            }}
            style={styles.image}
          />
          
          <View style={styles.containerLogo}>
            <Shadow style={{zIndex:1}} offset={[ 0, 0]} startColor="#010318" distance={40} > 
            <View style={styles.VwLogo}>
              {logoUrl !== null ? (
                <Image source={{ uri: logoUrl }} style={styles.logo} />
              ) : (
                <Text style={styles.text}>{dados.name}</Text>
              )}
            </View>
           </Shadow>
          </View>
          
          <View style={styles.info}>
            <Text style={styles.textTemps}>
              {dados.number_of_seasons} temporadas {ano}
            </Text>
          </View>
          <View style={styles.ViewOverVW}>
            <Text style={styles.textOverVW}>{dados.overview}</Text>
          </View>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => setIsPressed(!isPressed)}
          >
            <View style={styles.button}>
              <Text style={styles.textButton}>{titleTemp}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.textoEps}>
            <Text style={styles.textEps}>Episodios</Text>
          </View>
        
        </View>
      }
      scrollEnabled={true}
      nestedScrollEnabled={true}
    />
  

    {isPressed && (
      <View style={styles.containerTemp3}>
        <FlatList
          data={seasons}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSeason}
          ListEmptyComponent={<Text>Nenhuma temporada encontrada.</Text>}
          scrollEnabled={true}
        />
      </View>
    )}
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#010318",
  },
  scrollContainer: {
    flex: 1,
  },
  containerTemp3: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.911)",
    zIndex: 100,
  },
  button: {
    marginTop: 5,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.98,
    height: 50,
    backgroundColor: "rgb(27, 40, 48)",
    borderRadius: 8,
  },
  textButton: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
  logo: {
    width: '100%',
    height: 100,
    resizeMode: "contain",
  },
  containerLogo: {
    flex: 1,
    position: "relative",
    top: 0,
    width: width,
    alignItems: "center",
  },
  VwLogo: {
    width: width ,
    height: 0,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  text: {
    top: 50,
    fontWeight: "bold",
    fontSize: 30,
    height: 100,
    color: "#ffffff",
  },
  image: {
    width: width,
    height: 350,
    resizeMode: "cover",
    
    
  },
  info: {
    marginTop: 50,
    width: width * 1,
    alignItems: "flex-start",
    marginLeft: 10,
  },
  textTemps: {
    fontSize: 15,
    color: "#ffffff",
  },
  ViewOverVW: {
    width: width * 0.98,
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  textOverVW: {
    color: "#e4e4e4",
    fontSize: 16,
    
  },
  textoEps: {
    width: width,
    paddingHorizontal: 10,
  },
  textEps: {
    marginLeft: 10,
    marginBottom:10,
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 5,
    color: "#ffffff",
  },
  viewCapaEps: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 5,
  },
  imageCapaEps: {
    width: 130,
    height: 80,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  nameEpsAll: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    width: 175,
  },
  timeEpsAll: {
    color: "#949494",
    fontSize: 12,
  },
  sobreEpsAll: {
    color: "#e4e4e4",
    fontSize: 13,
    marginTop: 5,
  },
  temps: {
    padding: 10,

    borderRadius: 8,
    marginVertical: 5,
    width: width * 0.95,
    alignItems: "center",
  },
  tempname: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  containerEpsAll: {
    backgroundColor: "rgb(27, 40, 48)",
    width: width * 0.98,
    padding: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 10,
    borderRadius: 8,
   
  },
  epsVw: {

   width: '100%' ,
    alignItems: "center",
    justifyContent: "center",
  },  
});
