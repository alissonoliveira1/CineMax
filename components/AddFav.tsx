import { db } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const addFav = async (movie: any) => {
  // Verifica se o movie possui os dados necessários
  if (!movie.id || !movie.nome || !movie.sobre || !movie.categoria || !movie.poster || !movie.backdrop) {
    console.error("Dados do filme incompletos.");
    return;
  }

  const userId = await AsyncStorage.getItem("UserID");

  if (!userId) {
    console.error("Erro ao obter o ID do usuário.");
    return;
  }
  const cleanedUserId = userId ? userId.replace(/^"|"$/g, '') : null;

  if (!cleanedUserId) {
    console.error("Erro ao obter o ID do usuário.");
    return;
  }
  try {
    // Garante que o ID seja utilizado corretamente
    const userFavoriteDoc = doc(db, "cineData", cleanedUserId, "favoritos", movie.id);
    await setDoc(userFavoriteDoc, {
      nome: movie.nome,
      sobre: movie.sobre,
      categoria: movie.categoria,
      poster: movie.poster,
      backdrop: movie.backdrop,
    });
    console.log("Filme/série adicionado aos favoritos!");
    return { success: true, message: "Filme/série adicionado aos favoritos!" };
  } catch (error) {
    console.error("Erro ao adicionar aos favoritos: ", error);
    return { success: false, message: "Erro ao adicionar aos favoritos." };
  }
};
