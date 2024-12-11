import React, { useEffect, useState, useCallback, useRef } from "react";
import { useGlobalSearchParams } from "expo-router";
import api from "../services";
import axios from "axios";
import FavSvg from "../assets/images/star-fill.svg";
import TrlSvg from "../assets/images/film.svg";
import CompSvg from "../assets/images/share-fill.svg";
import ListSemelhantes from "@/components/ListSemelhantes";
import { Shadow } from "react-native-shadow-2";
import { useRouter } from "expo-router";
import Menu from "@/components/menu";
import { addFav } from "@/components/AddFav";
import {
  Text,
  View,
  Image,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Animated,
} from "react-native";

const fixedWidth = Dimensions.get("window").width * 0.7;
const aspectRatio = 1 / 3;
const { width } = Dimensions.get("window");
type AgeRating =
  | "L"
  | "10"
  | "12"
  | "14"
  | "16"
  | "18"
  | "Classificação indisponível";

const Info = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const params = useGlobalSearchParams();
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0); // Armazena o último valor do scroll
  const [menuVisible, setMenuVisible] = useState(true);
  const { id } = params;
  const [seasons, setSeasons] = useState<any>([]);
  const [titleTemp, setTitleTemp] = useState<string | null>(
    seasons.length > 0 ? seasons[0].name : null );
  const [classificacaoImagem, setClassificacaoImagem] = useState<any>(null);
  const [epsode, setEpisodes] = useState<any>(null);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [ano, setAno] = useState<number | null>(null);
  const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";
  const [selectedOption, setSelectedOption] = useState<
    "episodios" | "seriesSemelhantes"
  >("episodios");
  const [dados, setDados] = useState<{
    name?: string;
    overview?: string;
    poster_path?: string;
    backdrop_path?: string;
    genres?: [{ id: number; name: string }];
    seasons?: [{ season_number: number; name: string }];
    number_of_seasons?: number;
    first_air_date?: number;
    id?: number;
  }>({});
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dadosResponse, logoResponse, idsExternos] = await Promise.all([
          api.get(`tv/${id}`, {
            params: { api_key: API_KEY, language: "pt-BR" },
          }),
          api.get(`tv/${id}/images`, { params: { api_key: API_KEY } }),

          api.get(`tv/${id}/external_ids`, {
            params: { api_key: API_KEY, language: "pt-BR" },
          }),
        ]);

        setDados(dadosResponse.data);
        console.log(idsExternos.data.imdb_id);
        const validSeasons = dadosResponse.data.seasons?.filter(
          (season: any) => season.name !== "Especiais"
        );
        setSeasons(validSeasons);

        const logos = logoResponse.data.logos.filter(
          (logo: any) =>
            logo.iso_639_1 === "pt-BR" ||
            logo.iso_639_1 === "en-US" ||
            logo.iso_639_1 === "en" ||
            logo.iso_639_1 === "pt"
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
        `https://api.themoviedb.org/3/tv/${dados.id}/content_ratings`,
        {
          params: { api_key: API_KEY },
        }
      );

      const ratingData = response.data.results.find(
        (country: any) => country.iso_3166_1 === "BR"
      );

      if (ratingData && ratingData.rating) {
        const image =
          ageRatingImages[ratingData.rating as AgeRating] ||
          ageRatingImages["Classificação indisponível"];
        setClassificacaoImagem(image);
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
  console.log(classificacaoImagem);
  useEffect(() => {
    if (dados.id) fetchClassificacao();
  }, [dados.id, fetchClassificacao]);

  useEffect(() => {
    if (selectedSeason === null) return;
    const controller = new AbortController();
  
    const fetchEpisodes = async () => {
      try {
        const response = await api.get(`tv/${id}/season/${selectedSeason}`, {
          params: { api_key: API_KEY, language: "pt-BR" },
          signal: controller.signal,
        });
        const availableEpisodes = response.data.episodes.filter(
          (episode:any) => new Date(episode.air_date) <= new Date()
        );
        setEpisodes(availableEpisodes);
      } catch (error) {
        if ((error as any).name !== "AbortError") {
          console.error("Erro ao buscar episódios:", error);
        }
      }
    };
  
    fetchEpisodes();
    return () => controller.abort();
  }, [id, selectedSeason]);

  const handleSeasonSelect = (season_number: number, name: string) => {
    setIsPressed(true);
    setSelectedSeason(season_number);
    setTitleTemp(name);
    setIsPressed(!isPressed);
  };
  const scrollRoda = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;

    
        if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
          setMenuVisible(false); 
        } else if (currentScrollY < lastScrollY.current) {
          setMenuVisible(true); 
        }

        lastScrollY.current = currentScrollY; 
      },
    }
  );
  function handleAddFav(){
    const movie = {
      nome: dados.name,
      categoria: "series",
      sobre: dados.overview,
      poster: dados.poster_path,
      backdrop: dados.backdrop_path,
      id: id
    };
    addFav(movie);
  }
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#010318",
        }}
      >
        <Text style={{ color: "white" }}>Carregando...</Text>
      </View>
    );
  }
  const renderEps = ({ item }: { item: any }) => (
    <TouchableOpacity

    onPress={() =>
        router.push(
          `/VideoPlayer?imdb_id=${id}&temp=${item.season_number}&ep=${item.episode_number}`
        )
      }
      style={{ alignItems: "center",backgroundColor: "rgb(3, 4, 7)"  }}
    >
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
          <Text style={styles.sobreEpsAll}>
            {item.overview ? item.overview.split(".")[0] + "." : ""}
          </Text>
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
      <View>
        <ImageBackground
          source={{
            uri: `https://image.tmdb.org/t/p/w500${dados.poster_path}`,
          }}
          style={styles.image}
        >
          <View style={styles.overlay} />
        </ImageBackground>
        <FlatList
        onScroll={scrollRoda}
        data={selectedOption === "episodios" ? epsode || [] : []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEps}
          style={{ height: "100%", zIndex: 5, }}
          ListEmptyComponent={<Text>Nenhum episódio encontrado.</Text>}
          ListHeaderComponent={
            <View style={{ paddingTop: 300 }}>
              <Shadow
              style={{ zIndex: 16 }}
              offset={[0, 125]}
              startColor={`rgb(3, 4, 7)`}
              distance={180}
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
            

                <View style={styles.info}>
                  {classificacaoImagem && (
                    <Image
                      source={classificacaoImagem}
                      style={styles.classEtaria}
                    />
                  )}
                  <Text style={styles.textTemps}>
                    {dados.number_of_seasons} temporadas
                  </Text>
                  <Text style={styles.textTemps}>{ano}</Text>
                </View>
                <View style={{backgroundColor: "rgb(3, 4, 7)" }}>
                <View style={styles.ViewOverVW}>
                  <Text style={styles.textOverVW}>
                    {dados.overview ? dados.overview.split(".")[0] + "." : ""}
                  </Text>
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
                <TouchableOpacity
                  style={{ alignItems: "center" }}
                  onPress={() => setIsPressed(!isPressed)}
                >
                  <View style={styles.button}>
                    <Text style={styles.textButton}>{titleTemp}</Text>
                  </View>
                </TouchableOpacity>

                {/* Botões de alternância */}
                <View style={styles.textoEps}>
                  <TouchableOpacity
                    onPress={() => setSelectedOption("episodios")}
                  >
                    <Text style={styles.textEps}>Episódios</Text>
                    {selectedOption === "episodios" && (
                      <View style={styles.highlightBar} />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelectedOption("seriesSemelhantes")}
                  >
                    <Text style={styles.textEps}>Séries Semelhantes</Text>
                    {selectedOption === "seriesSemelhantes" && (
                      <View style={styles.highlightBar} />
                    )}
                  </TouchableOpacity>
                </View>
              </View></View>
            </View>
          }
          scrollEnabled={!isPressed} // Desativa rolagem ao exibir temporadas em tela cheia
          nestedScrollEnabled={true}
          ListFooterComponent={
            // Renderiza conteúdo conforme a opção selecionada
            <View>
              {selectedOption === "seriesSemelhantes" && !isPressed && (
                <ListSemelhantes ids={dados.id} />
              )}
            </View>
          }
        />

        {/* Tela cheia para as temporadas */}
        {isPressed && (
          <View style={styles.fullscreenOverlay}>
            <FlatList
              data={seasons} // Lista das temporadas
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderSeason}
              ListEmptyComponent={<Text>Nenhuma temporada encontrada.</Text>}
            />
          </View>
        )}
      </View>
      <Menu page={''} isVisible={menuVisible}/>
    </SafeAreaView>
  );
};
export default React.memo(Info);
const styles = StyleSheet.create({
  containerInfos: {
    width: width,
    justifyContent: "flex-start",
  },
  classEtaria: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  fullscreenOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
    zIndex:80
  },

  container: {
    flex: 1,
    backgroundColor: "#010318",
  },
  scrollContainer: {
    flex: 1,
  },
  containerTemp3: {
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    paddingTop: 60,
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
    width: fixedWidth,
    height: fixedWidth * aspectRatio,
    resizeMode: "contain",
  
  },

  VwLogo: {
    width: width,
    height: fixedWidth * aspectRatio,
    marginBottom: 0,
    marginLeft: 5,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
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
  info: {
    marginTop: 20,
    width: width * 1,
    alignItems: "center",
    marginLeft: 20,
    flexDirection: "row",
    gap: 10,
  },
  textTemps: {
    fontSize: 15,
    color: "#ffffff",
  },
  ViewOverVW: {
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 20,
    width: width * 0.92,
  },
  textOverVW: {
    color: "#e4e4e4",
    fontSize: 15,
   
    
  },
  textoEps: {
    width: width,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  textEps: {
    marginLeft: 10,
    marginBottom: 10,
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
    backgroundColor: "rgb(3, 4, 7)"
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
    width: width * 0.98,
    padding: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "rgb(3, 4, 7)"
  },
  epsVw: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(3, 4, 7)"
  },
  highlightBar: {
    marginTop: 5,
    height: 3,
    width: "100%",
    backgroundColor: "#007AFF", // Cor da barra de destaque
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
});
