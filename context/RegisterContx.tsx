import React, { createContext, useState, useMemo, Dispatch, SetStateAction } from "react";


export interface RegisterContextType {
  conta: string | null;
  setConta: Dispatch<SetStateAction<string | null>>;
}


export const RegisterContext = createContext<RegisterContextType | undefined>(undefined);


export const RegisterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conta, setConta] = useState<string | null>(null);

 
  const value = useMemo(() => ({ conta, setConta }), [conta, setConta]);

  return <RegisterContext.Provider value={value}>{children}</RegisterContext.Provider>;
};
