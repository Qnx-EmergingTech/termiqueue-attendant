import { getToken } from "../../src/utils/authStorage";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const createProfile = async ({ first_name, middle_name, last_name, address, birthdate }) => {
  try {
    const idToken = await getToken();
    if (!idToken) throw new Error("User not authenticated");

        const body = {
        first_name,
        middle_name,
        last_name,
        address,
        birthdate: birthdate ? new Date(birthdate).toISOString() : new Date('2000-01-01').toISOString(),
        user_type: "bus_attendant",
        is_privileged: true,
        in_queue: false
        };

    const response = await fetch(`${API_BASE_URL}/profiles/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to create profile");
    }

    return { success: true, message: "Profile created successfully!" };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

