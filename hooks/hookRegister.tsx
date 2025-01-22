import { useContext } from "react";
import { RegisterContext, RegisterContextType } from "@/context/RegisterContx";

export const useRegister = (): RegisterContextType => {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error("useRegister must be used within a RegisterProvider");
  }
  return context;
};