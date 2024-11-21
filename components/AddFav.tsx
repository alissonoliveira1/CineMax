import { db } from "@/firebaseConfig";
import { doc,setDoc } from "firebase/firestore";
export const addFav = async ( movie:any) => {
    const userId = 'R2IqDjgdrERzRKkV8gDUhX5nQp62'
    try {
        const userFavoriteDoc = doc(db, "cineData", userId, "favoritos", movie.id);
        await setDoc(userFavoriteDoc, {
          nome: movie.nome,
          sobre: movie.sobre,
          poster: movie.poster,
          backdrop: movie.backdrop,
        });
      console.log("Filme/série adicionado aos favoritos!");
    } catch (error) {
      console.error("Erro ao adicionar aos favoritos: ", error);
    }
  };