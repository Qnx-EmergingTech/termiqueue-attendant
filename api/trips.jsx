import { getToken } from "../utils/authStorage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const joinUrl = (base, path) =>
  `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

export const getAttendantTrips = async () => {
  try {
    const idToken = await getToken();
    if (!idToken) throw new Error("User not authenticated");

    const url = joinUrl(API_BASE_URL, "buses/attendant/trips");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Unable to fetch trip history");
    }

    return { success: true, trips: data.trips };
  } catch (error) {
    console.error("Error fetching attendant trips:", error);
    return { success: false, message: error.message, trips: [] };
  }
};

export const getAttendantTripDetail = async (tripId) => {
  try {
    const idToken = await getToken();
    if (!idToken) throw new Error("User not authenticated");

    const url = joinUrl(
      API_BASE_URL,
      `buses/attendant/trips/${encodeURIComponent(tripId)}`
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Unable to fetch trip detail");
    }

    return { success: true, detail: data };
  } catch (error) {
    console.error("Error fetching trip detail:", error);
    return { success: false, message: error.message, detail: null };
  }
};
