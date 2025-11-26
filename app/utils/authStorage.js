import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, signOut } from "firebase/auth";


const TOKEN_KEY = "firebaseIdToken";
const USER_KEY = "userData";

export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error clearing token:", error);
  }
};

export const setUser = async (user) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

export const getUser = async () => {
  try {
    const userStr = await AsyncStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error retrieving user:", error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error };
  }
};
