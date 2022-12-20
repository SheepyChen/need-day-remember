import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "need-day-remember.firebaseapp.com",
  projectId: "need-day-remember",
  storageBucket: "need-day-remember.appspot.com",
  messagingSenderId: "258159545836",
  appId: "1:258159545836:web:717ad5bfd2c216bfbfc4c9",
};

const firebase = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
export const fs = getFirestore(firebase);
