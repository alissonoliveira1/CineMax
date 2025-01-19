import React, { createContext, useContext, useState, ReactNode } from "react";

interface MenuContextType {
  isMenuVisible: boolean;
  toggleMenu: (visible: boolean) => void;
}


const MenuContext = createContext<MenuContextType | undefined>(undefined);


export const MenuProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isMenuVisible, setMenuVisible] = useState(false);

 
  const toggleMenu = () => setMenuVisible((prev) => !prev);

  return (
    <MenuContext.Provider value={{ isMenuVisible, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};


export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu deve ser usado dentro de um MenuProvider");
  }
  return context;
};
