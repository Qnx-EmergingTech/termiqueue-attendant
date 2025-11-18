import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword, getIdToken } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export const signUp = async (email, password) => {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    const idToken = await getIdToken(user, true);
    await AsyncStorage.setItem("userToken", idToken);

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
    }

    return { success: false, message };
  }
};
