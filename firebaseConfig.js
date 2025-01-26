import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAr3Bml2M0-2mW2Jv1lLolpz01bgrw8jCo",
  authDomain: "cinemagic-77a09.firebaseapp.com",
  projectId: "cinemagic-77a09",
  storageBucket: "cinemagic-77a09.firebasestorage.app",
  messagingSenderId: "152399026163",
  appId: "1:152399026163:web:d6f9d079f78b37f736e486",
  measurementId: "G-03V9B70VFF",
};

// Inicialize o Firebase App primeiro
const app = initializeApp(firebaseConfig);

// Depois, configure os serviços que você precisa
const auth = getAuth(app);
const db = getFirestore(app);

// Exporte os objetos para uso no projeto
export { app, db, auth };
