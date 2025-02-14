import { createContext, useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import { useMemo } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { db } from "@/firebaseConfig";

import { getDoc, doc, onSnapshot } from "firebase/firestore";
interface UserContextType {
  user: User | null;
  dadosUser: { photoURL: String; displayName: String };
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [dadosUser, setDadosUser] = useState<{
    photoURL: string;
    displayName: string;
  }>({ photoURL: "", displayName: "" });
  let email: string | null = null;
  let emailVerified: boolean | null = null;
  let uid: string | null = null;
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (user?.uid) {
      const refDoc = doc(db, "cineData", user.uid);
  
      const unsubscribe = onSnapshot(refDoc, (docSnap) => {
        if (docSnap.exists()) {
          setDadosUser(docSnap.data() as { photoURL: string; displayName: string });
          console.log("Documento encontrado:", docSnap.data());
        } else {
          console.log("Documento não encontrado!");
        }
      });
  
      // Removendo o listener ao desmontar o componente
      return () => unsubscribe();
    }
  }, [user]);

  console.log("Dados do documento:", dadosUser.photoURL, dadosUser.displayName);

  const contextValue = useMemo(() => ({ user, dadosUser }), [user, dadosUser]);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
