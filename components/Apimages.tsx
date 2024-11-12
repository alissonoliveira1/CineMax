import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useMemo,
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
  media_type: string;
  type: string;
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

const AppProvider: React.FC<{ children: ReactNode }> = React.memo(
  ({ children }) => {
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
    const currentDate = new Date().toISOString().split("T")[0];

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
                first_air_date_lte: currentDate,
              },
            }),
            api.get("discover/tv", {
              params: {
                api_key: API_KEY,
                language: "pt-BR",
                with_genres: 10759,
                page: 1,
                first_air_date_lte: currentDate,
              },
            }),
            api.get("discover/tv", {
              params: {
                api_key: API_KEY,
                language: "pt-BR",
                with_genres: 10765,
                page: 1,
                first_air_date_lte: currentDate,
              },
            }),
            api.get("movie/popular", {
              params: {
                api_key: API_KEY,
                language: "pt-BR",
                page: 1,
                release_date_lte: currentDate,
              },
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
          const idiomasPrioridade = ["pt-BR", "pt", "en-US", "en"];

          const escolherLogoPorPrioridade = (logos: any[], idiomas: string[]) => {
            for (const idioma of idiomas) {
              const logo = logos.find((logo: any) => logo.iso_639_1 === idioma);
              if (logo) return logo.file_path;
            }
            return null;
          };

          for (const movie of allMovies) {
            if (movie.genre_ids?.length > 0 && movie.backdrop_path) {
              const logoData = await api.get(`tv/${movie.id}/images`, {
                params: { api_key: API_KEY },
              });
              const logoPath = escolherLogoPorPrioridade(
                logoData.data.logos,
                idiomasPrioridade
              );

              if (logoPath) {
                filmesComLogoEGênero.push({ ...movie, logoPath });
                if (filmesComLogoEGênero.length >= 10) break;
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

            const backdropPath = destaqueSelecionado.backdrop_path;
            if (backdropPath) {
              const imageUrl = `https://image.tmdb.org/t/p/original${backdropPath}`;
              const colorResponse = await axios.get(
                `https://colorstrac.onrender.com/get-colors?imageUrl=${imageUrl}`
              );
              setCoresBackground(
                colorResponse.data.dominantColor 
              );
            }
          }
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      };

      getInitialData();
    }, []);

    const memoizedValues = useMemo(() => ({
      genres,
      logoUrl,
      coresBackground,
      movies,
      movieAcaoAventura,
      movieTerror,
      destaque,
      filmesAlta,
    }), [genres, logoUrl, coresBackground, movies, movieAcaoAventura, movieTerror, destaque, filmesAlta]);

    return (
      <AppContext.Provider value={memoizedValues}>
        {children}
      </AppContext.Provider>
    );
  }
);


export { AppProvider };
