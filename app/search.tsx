import { useState } from "react";
import { View,  TouchableOpacity,Text,TextInput } from "react-native";

function Search() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<{ id: number; title: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";
  const searchMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search}`
      );
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  return (
    <View>
      <TextInput
      
        value={search}
        onChangeText={(text) => setSearch(text)}
      />
      <TouchableOpacity onPress={searchMovies}><Text>Search</Text></TouchableOpacity>
      {loading && <Text>Loading...</Text>}
      <Text>error</Text> 
      <View>
        {movies.map((movie) => (
          <View key={movie.id}><Text>{movie.title}</Text></View>
        ))}
      </View>
    </View>
  );
}   
export default Search;