import { useState,memo } from "react";
import { useRouter } from "expo-router";
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  VirtualizedList
} from "react-native";
import api from "./services";
import HomeSearch from "@/components/HomeSearch";
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
  const router = useRouter();
  const [seasonData, setSeasonData] = useState<Record<number, any>>({});
  const [search, setSearch] = useState("");
  const currentDate = new Date().toISOString().split('T')[0];
  const [movies2, setMovies] = useState<TVShow[]>([]);
  

  const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";
  const searchMovies = async () => {
   
    try {
      const responseMovie = await api.get(`search/multi`, {
          params: { api_key: API_KEY, query: search, language: "pt-BR"},
        })
        const filteredResults = responseMovie.data.results.filter((item:any) => {
          const releaseDate = item.release_date || item.first_air_date
          return item.backdrop_path && releaseDate && releaseDate <= currentDate;
        });
     setMovies(filteredResults);
      await Promise.all(
        responseMovie.data.results.map(async (tvShow: any) => {
          if(tvShow.media_type === 'tv'){ 
            const seasonsResponse = await api.get(
              `tv/${tvShow.id}?api_key=${API_KEY}`
            );
            setSeasonData((prev) => ({
              ...prev,
              [tvShow.id]: seasonsResponse.data.seasons.slice(0, 1),
            }));
          }
        
        })
      );
      
    } catch (error) {
      console.log(error)
    }
   
  };
  const renderItem = ({item}: {item: TVShow}) => (
    <TouchableOpacity onPress={()=> item.type === 'tv'? router.push(`/info?id=${item.id}`) : router.push(`/infoFilmes?id=${item.id}`)}  key={item.id}>
    <View style={styles.results} >
    <Image
      style={styles.image}
      source={{
        uri: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
        cache: "reload",
      }}
    />
    <View>
      <Text style={styles.textResults}>
        {item.title || item.name}
      </Text>
      <Text style={styles.textResults}>
        {item.type === "tv" && seasonData[item.id] && (
          <Text>
            {seasonData[item.id].map((season: any) => (
              <Text key={season.id}>
                <Text>Temporada {season.season_number}</Text>
              </Text>
            ))}
          </Text>
        )}
      </Text>
    </View>
  </View>
  </TouchableOpacity>
  )
console.log(movies2)
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
        <VirtualizedList
          data={movies2}
          initialNumToRender={4}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          getItem={(data, index) => data[index]}
          getItemCount={(data) => data.length}
          horizontal={false}
        />
      ) : (
        <HomeSearch/>
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
    width: '70%',
  
    marginTop: 80,
    padding: 10,
  },
  results: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});
export default memo(Search);
