import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
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
  const [coresBackground, setCoresBackground] = useState<string[]>([
    "9, 14, 82",
  ]);
  const [movies, setMovies] = useState<TVShow[]>([]);
  const [movieAcaoAventura, setMovieAcaoAventura] = useState<TVShow[]>([]);
  const [movieTerror, setMovieTerror] = useState<TVShow[]>([]);
  const [destaque, setDestaque] = useState<TVShow[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [filmesAlta, setFilmesAlta] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const API_KEY = "9f4ef628222f7685f32fc1a8eecaae0b";

  useEffect(() => {
    const getInitialData = async () => {
      try {
        const [
          desenhoResponse,
          acaoeAvenResponse,
          terrorResponse,
          emAltaResponse,
          genresResponse,
        ] = await Promise.all([
          api.get("discover/tv", {
            params: {
              api_key: API_KEY,
              language: "pt-BR",
              with_genres: 16,
              page: 1,
            },
          }),
          api.get("discover/tv", {
            params: {
              api_key: API_KEY,
              language: "pt-BR",
              with_genres: 10759,
              page: 1,
            },
          }),
          api.get("discover/tv", {
            params: {
              api_key: API_KEY,
              language: "pt-BR",
              with_genres: 10765,
              page: 1,
            },
          }),
          api.get("movie/popular", {
            params: { api_key: API_KEY, language: "pt-BR", page: 1 },
          }),
          api.get("genre/tv/list", {
            params: { api_key: API_KEY, language: "pt-BR" },
          }),
        ]);

        setMovies(desenhoResponse.data.results);
        setMovieAcaoAventura(acaoeAvenResponse.data.results);
        setMovieTerror(terrorResponse.data.results);
        setFilmesAlta(emAltaResponse.data.results);
        setGenres(genresResponse.data.genres);

        const allMovies = [
          ...desenhoResponse.data.results,
          ...acaoeAvenResponse.data.results,
          ...terrorResponse.data.results,
          ...emAltaResponse.data.results,
        ];
        const filmesComLogoEGênero = [];
        const idiomasPrioridade = ["pt-BR", "pt", "en-US", "en"]; // Ordem de preferência para idiomas

        const escolherLogoPorPrioridade = (logos: any[], idiomas: string[]) => {
          for (const idioma of idiomas) {
            const logo = logos.find((logo: any) => logo.iso_639_1 === idioma);
            if (logo) return logo.file_path; // Retorna o caminho da primeira logo encontrada
          }
          return null; // Retorna null se nenhuma logo for encontrada
        };

        // Busca de logo apenas para filmes e séries com gênero e imagem de fundo
        for (const movie of allMovies) {
          if (movie.genre_ids?.length > 0 && movie.backdrop_path) {
            const logoData = await api.get(`tv/${movie.id}/images`, {
              params: { api_key: API_KEY },
            });
            const logoPath = escolherLogoPorPrioridade(
              logoData.data.logos,
              idiomasPrioridade
            );

            // Adiciona o item se tiver logotipo
            if (logoPath) {
              filmesComLogoEGênero.push({ ...movie, logoPath });
              if (filmesComLogoEGênero.length >= 10) break; // Limita a 10 itens
            }
          }
        }

        if (filmesComLogoEGênero.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * filmesComLogoEGênero.length
          );
          const destaqueSelecionado = filmesComLogoEGênero[randomIndex];
          setDestaque([destaqueSelecionado]);
          setLogoUrl(
            `https://image.tmdb.org/t/p/original${destaqueSelecionado.logoPath}`
          );

          // Define cores de fundo com base no backdrop_path do item selecionado
          const backdropPath = destaqueSelecionado.backdrop_path;
          if (backdropPath) {
            const imageUrl = `https://image.tmdb.org/t/p/original${backdropPath}`;
            const colorResponse = await axios.get(
              `https://colorstrac.onrender.com/get-colors?imageUrl=${imageUrl}`
            );
            setCoresBackground(
              colorResponse.data.dominantColor || ["255, 255, 255"]
            );
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    getInitialData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        genres,
        logoUrl,
        coresBackground,
        movies,
        movieAcaoAventura,
        movieTerror,
        destaque,
        filmesAlta,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
export { AppProvider, useAppContext };
