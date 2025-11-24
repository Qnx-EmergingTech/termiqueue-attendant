import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword, getIdToken, signInWithEmailAndPassword, } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { setToken } from "../utils/authStorage";

export const signUp = async (email, password) => {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;
    const idToken = await user.getIdToken(true);
    await setToken(idToken);
    // await AsyncStorage.setItem("uid", user.uid);

    return { success: true, message: "Account created successfully!" };

  } catch (err) {
    let message = "Something went wrong. Please try again.";

    switch (err.code) {
      case "auth/email-already-in-use":
        message = "This email is already registered. Try logging in instead.";
        break;
      case "auth/invalid-email":
        message = "Please enter a valid email address.";
        break;
      case "auth/weak-password":
        message = "Password must be at least 6 characters.";
        break;
      case "auth/operation-not-allowed":
        message = "Email/password accounts are not enabled in Firebase Auth.";
        break;
      case "auth/network-request-failed":
        message = "Network error. Please check your internet connection.";
        break;
    }

    return { success: false, message };
  }
};

export const logIn = async (email, password) => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;
    const idToken = await getIdToken(user, true);
    await setToken(idToken);
    await AsyncStorage.setItem("userToken", idToken);

    return { success: true, message: "Logged in successfully!" };
  } catch (err) {
    let message = "Something went wrong. Please try again.";

    switch (err.code) {
      case "auth/user-not-found":
        message = "No account found with this email. Please sign up first.";
        break;
      case "auth/wrong-password":
        message = "Incorrect password. Please try again.";
        break;
      case "auth/invalid-email":
        message = "Invalid email address format.";
        break;
      case "auth/user-disabled":
        message = "This account has been disabled. Contact support.";
        break;
      case "auth/too-many-requests":
        message = "Too many failed login attempts. Please try again later.";
        break;
    }

    return { success: false, message };
  }
};
