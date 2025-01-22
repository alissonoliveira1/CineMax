import { db } from "../firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";


export const delFav = async (movieId: string) => {
    const userId = "R2IqDjgdrERzRKkV8gDUhX5nQp62";
    try {
 
      const movieRef = doc(db, "cineData", userId, "favoritos", movieId);
  
      
      await deleteDoc(movieRef);
      console.log("Filme deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar filme: ", error);
    }
  };
