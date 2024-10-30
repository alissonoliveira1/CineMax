import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axios from "axios";
import api from "../app/services/index";

interface TVShow {
  genre_ids: number[];
  title: string;
  poster_path: string;
  id: string;
  backdrop_path: string;
  name: string;
  genres: Genre[];
}
interface Genre {
  id: number;
  name: string;
}
interface AppContextType {
  genres: Genre[];

  logoUrl: string | null;
  coresBackground: string[];
  movies: TVShow[];
  movieAcaoAventura: TVShow[];
  movieTerror: TVShow[];
  destaque: TVShow[];
  filmesAlta: TVShow[];

}


const DEFAULT_VALUE: AppContextType = {

  genres: [],
  logoUrl: null,
  coresBackground: ["9, 14, 82"],
  movies: [],
  movieAcaoAventura: [],
  movieTerror: [],
  destaque: [],
  filmesAlta: [],
};

export const AppContext = createContext<AppContextType>(DEFAULT_VALUE);

  const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [coresBackground, setCoresBackground] = useState<string[]>(["9, 14, 82"]);
  const [movies, setMovies] = useState<TVShow[]>([]);
  const [movieAcaoAventura, setMovieAcaoAventura] = useState<TVShow[]>([]);
  const [movieTerror, setMovieTerror] = useState<TVShow[]>([]);
  const [destaque, setDestaque] = useState<TVShow[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [filmesAlta, setFilmesAlta] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";

  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      try {
 
        const [
          desenhoResponse,
          acaoeAvenResponse,
          terrorResponse,
          destaqueResponse,
          emAltaResponse,
        ] = await Promise.all([
          api.get("discover/tv", { params: { api_key: API_KEY, language: "pt-BR", with_genres: 16 } }),
          api.get("discover/tv", { params: { api_key: API_KEY, language: "pt-BR", with_genres: 10759 } }),
          api.get("discover/tv", { params: { api_key: API_KEY, language: "pt-BR", with_genres: 10765 } }),
          api.get("discover/tv", {params: { api_key: API_KEY, language: "pt-BR", with_genres: 16 },}),
          api.get("/movie/popular", { params: { api_key: API_KEY, language: "pt-BR", page: 1 } }),
        ]);
        setDestaque(destaqueResponse.data.results.slice(0, 1));
        setGenres(destaqueResponse.data.results.slice(0, 1).genres);
        setMovies(desenhoResponse.data.results);
        setMovieAcaoAventura(acaoeAvenResponse.data.results);
        setMovieTerror(terrorResponse.data.results);
        setFilmesAlta(emAltaResponse.data.results);
        const allMovies = [
          ...desenhoResponse.data.results,
          ...acaoeAvenResponse.data.results,
          ...terrorResponse.data.results,
          ...emAltaResponse.data.results,
        ];

      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
     
      }
    };
  
    getMovies();
  }, [API_KEY]);


  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=pt-BR`);
        setGenres(response.data.genres); 
      } catch (error) {
        console.error("Erro ao buscar gêneros:", error);
      }
    };
    fetchGenres(); 
 
  }, []);







  useEffect(() => {
    if (destaque.length > 0) {
      const fetchData = async () => {
        const imageUrl = `https://image.tmdb.org/t/p/original/${destaque[0].backdrop_path}`;
        try {
          const response = await axios.get(`https://colorstrac.onrender.com/get-colors?imageUrl=${imageUrl}`);
          setCoresBackground(response.data.dominantColor || ["255, 255, 255"]);
        } catch (error) {
          console.error("Erro ao buscar as cores:", error);
        }
      };
      fetchData();
    }
  }, [destaque]);
  
  useEffect(() => {
    const fetchLogo = async () => {
      if (destaque.length > 0) {
        try {
          const dadosResponse = await api.get(`tv/${destaque[0].id}/images`, {
            params: { api_key: API_KEY },
          });

          const logos = dadosResponse.data.logos.filter(
            (logo: any) => logo.iso_639_1 === "pt" || logo.iso_639_1 === "pt-BR"
          );
          if (logos.length > 0) {
            setLogoUrl(`https://image.tmdb.org/t/p/original${logos[0].file_path}`);
          }
        } catch (error) {
          console.error("Erro ao buscar o logo:", error);
        }
      }
    };
    fetchLogo();
  }, [destaque]);


  return (
    <AppContext.Provider
      value={{genres, logoUrl, coresBackground, movies, movieAcaoAventura, movieTerror, destaque, filmesAlta }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
      throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
  };
export { AppProvider, useAppContext };