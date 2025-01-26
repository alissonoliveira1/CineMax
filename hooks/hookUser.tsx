import { UserContext } from "@/context/UserContext";
import { useContext } from "react";
export  const useUser = () => {
const context = useContext(UserContext);
if (!context) {
    throw new Error("useRegister must be used within a RegisterProvider");
  }
  return context;
}