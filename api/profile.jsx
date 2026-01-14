import { getToken } from "../utils/authStorage";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const joinUrl = (base, path) => {
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
};

export const createProfile = async (data) => {
  const url = joinUrl(API_BASE_URL, "profiles/");
  console.log("API Endpoint:", url);

  try {
    const idToken = await getToken();
    console.log("Auth Token Exists:", !!idToken);

    if (!idToken) throw new Error("User not authenticated");

    const payload = {
      ...data,
      username: data.username,
      birthdate: data.birthdate
        ? new Date(data.birthdate).toISOString()
        : new Date("2000-01-01").toISOString(),
      user_type: "bus_attendant",
      is_privileged: true,
      in_queue: false
    };

    console.log("Request Payload:", payload);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${idToken}`
      },
      body: JSON.stringify(payload),
    });

    console.log("Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error Response:", errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { detail: errorText };
      }

      throw new Error(errorData.detail || "Failed to create profile");
    }

    return { success: true };
  } catch (err) {
    console.error("Create Profile Error:", err.message);
    return { success: false, message: err.message };
  }
};
