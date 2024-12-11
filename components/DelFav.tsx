import { db } from "../firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";


export const delFav = async (movieId: string) => {
    const userId = "R2IqDjgdrERzRKkV8gDUhX5nQp62";
    try {
      // Referência do documento no Firestore
      const movieRef = doc(db, "cineData", userId, "favoritos", movieId);
  
      // Deletando o documento
      await deleteDoc(movieRef);
      console.log("Filme deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar filme: ", error);
    }
  };
