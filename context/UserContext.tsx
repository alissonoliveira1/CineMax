import { createContext, useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import { useMemo } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { useRegister } from "@/hooks/hookRegister";

interface UserContextType {
    user: User | null;
  }


export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }:any) => {
    const {conta} = useRegister();
    const [user, setUser] = useState<User | null>(null);
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
    
    if(user){
        updateProfile(user, {
            displayName: conta.nome,
            photoURL: conta.perfil
          }).then(() => {
            console.log("Profile updated");
          }).catch((error:any) => {
            console.log("erro ao atualizar perfil:", error);
          }); 
       }

   if(user){
    emailVerified = user.emailVerified;
    email = user.email;
    uid = user.uid;
   }
   if(user){
    user.providerData.forEach((profile:any) => {
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL);
      });
   }
    const contextValue = useMemo(() => ({ user, email }), [user, email, emailVerified, uid]);

    return(
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}   
