import { getToken } from "../utils/authStorage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const joinUrl = (base, path) => `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

export const getMyBus = async () => {
  try {
    const idToken = await getToken();
    if (!idToken) throw new Error("User not authenticated");

    const url = joinUrl(API_BASE_URL, "buses/attendant/my-bus");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await response.json();
    console.log("My bus response:", data, "Status:", response.status);

    if (!response.ok) {
      throw new Error(data.detail || "Unable to fetch bus info");
    }

    return { success: true, bus: data };
  } catch (error) {
    console.error("Error fetching my bus:", error);
    return { success: false, message: error.message, bus: null };
  }
};

export const createBus = async (busData) => {
  try {
    const idToken = await getToken();
    if (!idToken) throw new Error("User not authenticated");

    const url = joinUrl(API_BASE_URL, "buses/");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(busData),
    });

    const data = await response.json();
    if (!response.ok) {
      const msg = Array.isArray(data.detail)
        ? data.detail.map(d => d.msg || JSON.stringify(d)).join(", ")
        : data.detail || "Failed to create bus";
      throw new Error(msg);
    }

    return { success: true, message: "Bus created successfully!", bus: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
