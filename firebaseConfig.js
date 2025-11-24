import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyA5ai21uU_Ln_2FlSxXpB3Wmn4tzLGmzx0",
  authDomain: "qnext-bc282.firebaseapp.com",
  projectId: "qnext-bc282",
  storageBucket: "qnext-bc282.firebasestorage.app",
  messagingSenderId: "655635157366",
  appId: "1:655635157366:web:041042eac22a7153c0aa57"
};

const app = initializeApp(firebaseConfig);

let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

const db = getFirestore(app);

export { auth, db };

