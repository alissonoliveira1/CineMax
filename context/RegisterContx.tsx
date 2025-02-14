import React, { createContext, useState, useMemo, Dispatch, SetStateAction, useEffect } from "react";
import { addDoc,collection,doc, setDoc } from "firebase/firestore";
import { auth } from "@/firebaseConfig";
import { db } from "@/firebaseConfig";
type User = {
  nome: string;
  email: string;
  perfil: string;
};

export interface RegisterContextType {
  conta: User;
  passos: number;

  setConta: Dispatch<SetStateAction<User>>;
  setPassos: Dispatch<SetStateAction<number>>;
}


export const RegisterContext = createContext<RegisterContextType | undefined>(undefined);


export const RegisterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [passos, setPassos] = useState<number>(1);
  const user = auth.currentUser;
  
  const [conta, setConta] = useState<User>({
    nome: "",
    email: "",
    perfil: "https://i.ibb.co/pXcqy1M/Inserir-um-t-tulo.png",
  });

  useEffect(() => {
    if (user?.uid) {
      const RefDoc = doc(db, 'cineData', user.uid);
  
      // Atualizar o campo displayName
      if (conta.nome !== '') {
        setDoc(
          RefDoc,
          { displayName: conta.nome },
          { merge: true } // Evita sobrescrever outros dados
        )
          .then(() => {
            console.log('Nome do usuário salvo com sucesso!');
          })
          .catch((error) => {
            console.error('Erro ao salvar o Nome do usuário:', error);
          });
      }
  
      // Atualizar o campo photoURL
      if (conta.perfil !== '') {
        setDoc(
          RefDoc,
          { photoURL: conta.perfil },
          { merge: true } // Evita sobrescrever outros dados
        )
          .then(() => {
            console.log('Foto do usuário salva com sucesso!');
          })
          .catch((error) => {
            console.error('Erro ao salvar a Foto do usuário:', error);
          });
      }
    }
  }, [conta, user]);

  
  const value = useMemo(() => ({ conta, setConta, passos, setPassos }), [conta, setConta, setPassos, passos]);

  return <RegisterContext.Provider value={value}>{children}</RegisterContext.Provider>;
};
