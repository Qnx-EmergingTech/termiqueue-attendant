import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword, getIdToken, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { clearTripState, logoutUser, setToken } from "../utils/authStorage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const signUp = async (email, password, username) => {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    const idToken = await getIdToken(user);
    await setToken(idToken);

    const res = await fetch(`${API_BASE_URL}/profiles/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        username: username.trim(),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.log("Backend error response:", data);
      await user.delete();
      throw new Error(data.detail || "Failed to create profile");
    }

    await clearTripState();
    return { success: true };

  } catch (err) {
    console.error("Signup error:", err);

    let message = err.message || "Something went wrong. Please try again.";

    switch (err.code) {
      case "auth/email-already-in-use":
        message = "This email is already registered.";
        break;
      case "auth/invalid-email":
        message = "Please enter a valid email address.";
        break;
      case "auth/weak-password":
        message = "Password must be at least 6 characters.";
        break;
      case "auth/network-request-failed":
        message = "Network error. Please check your internet connection.";
        break;
    }

    return { success: false, message };
  }
};

export const logInWithUsername = async (username, password) => {
  try {
    const res = await fetch(`${API_BASE_URL}/profiles/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.trim(),
        password,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || "Invalid username or password");
    }

    const data = await res.json();
    const email = data.email;

    if (!email) {
      throw new Error("Email not found for this username");
    }

    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    const idToken = await getIdToken(user, true);

    await setToken(idToken);
    await AsyncStorage.setItem("firebaseIdToken", idToken);
    await AsyncStorage.setItem("userId", user.uid);
    await AsyncStorage.setItem("isLoggedIn", "true");

    return { success: true };

  } catch (err) {
    console.error("Login error:", err);
    return {
      success: false,
      message: err.message || "Login failed",
    };
  }
};

export const signOutAccount = async () => {
  try {
    const result = await logoutUser();
    await clearTripState();
    return {
      success: result.success,
      message: "Logged out locally and Firebase session ended.",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};