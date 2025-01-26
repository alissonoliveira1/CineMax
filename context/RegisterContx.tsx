import React, { createContext, useState, useMemo, Dispatch, SetStateAction } from "react";

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
  const [conta, setConta] = useState<User>({
    nome: "",
    email: "",
    perfil: "",
  });
  
  const value = useMemo(() => ({ conta, setConta, passos, setPassos }), [conta, setConta, setPassos, passos]);

  return <RegisterContext.Provider value={value}>{children}</RegisterContext.Provider>;
};
