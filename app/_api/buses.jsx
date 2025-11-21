import { getToken } from "../../src/utils/authStorage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const getMyBus = async () => {
  try {
    const idToken = await getToken();
    if (!idToken) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/buses/attendant/my-bus`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await response.json();
    console.log("My bus response:", data);
    console.log("Status:", response.status);

    if (!response.ok) {
      throw new Error(data.detail || "Unable to fetch bus info");
    }

    return { success: true, bus: data };
  } catch (error) {
    console.error("Error fetching my bus:", error);
    return { success: false, message: error.message, bus: null };
  }
};
