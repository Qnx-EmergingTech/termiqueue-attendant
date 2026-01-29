import { getToken } from "../utils/authStorage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const joinUrl = (base, path) =>
  `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

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
        ? data.detail.map((d) => d.msg || JSON.stringify(d)).join(", ")
        : data.detail || "Failed to create bus";
      throw new Error(msg);
    }

    return { success: true, message: "Bus created successfully!", bus: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const claimBus = async (busId) => {
  try {
    const idToken = await getToken();
    if (!idToken) throw new Error("User not authenticated");

    const url = joinUrl(API_BASE_URL, `buses/${busId}/claim`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = Array.isArray(data.detail)
        ? data.detail.map((d) => d.msg || JSON.stringify(d)).join(", ")
        : data.detail || "Failed to claim bus";
      throw new Error(msg);
    }

    return { success: true, message: "Bus claimed successfully!", bus: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const arriveBus = async (busId) => {
  try {
    const idToken = await getToken();
    if (!idToken) throw new Error("User not authenticated");
    if (!busId) throw new Error("Bus ID is required");

    const url = joinUrl(API_BASE_URL, `buses/${busId}/arrive`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = Array.isArray(data.detail)
        ? data.detail.map((d) => d.msg).join(", ")
        : data.detail || "Failed to set bus as arrived";
      throw new Error(msg);
    }

    return { success: true, message: data };
  } catch (error) {
    console.error("Arrive bus error:", error);
    return { success: false, message: error.message };
  }
};

export const departBus = async (busId) => {
  try {
    const idToken = await getToken();
    if (!idToken) throw new Error("User not authenticated");
    if (!busId) throw new Error("Bus ID is required");

    const url = joinUrl(API_BASE_URL, `buses/${busId}/depart`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = Array.isArray(data.detail)
        ? data.detail.map((d) => d.msg).join(", ")
        : data.detail || "Failed to depart bus";
      throw new Error(msg);
    }

    return {
      success: true,
      message: "Bus departed successfully",
      data,
    };
  } catch (error) {
    console.error("Depart bus error:", error);
    return { success: false, message: error.message };
  }
};

export const updateBusStatus = async (busId, status) => {
  try {
    const idToken = await getToken();
    if (!idToken) throw new Error("User not authenticated");
    if (!busId) throw new Error("Bus ID is required");

    const url = joinUrl(API_BASE_URL, `buses/${busId}`);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = Array.isArray(data.detail)
        ? data.detail.map((d) => d.msg).join(", ")
        : data.detail || "Failed to update bus";
      throw new Error(msg);
    }

    return { success: true, bus: data };
  } catch (error) {
    console.error("Update bus error:", error);
    return { success: false, message: error.message };
  }
};

export const getAttendantPassengers = async () => {
  try {
    const idToken = await getToken();
    if (!idToken) throw new Error("User not authenticated");

    const url = joinUrl(API_BASE_URL, "buses/attendant/passengers");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = data.detail || "Failed to fetch passengers";
      throw new Error(msg);
    }

    return {
      success: true,
      passengers: data.passengers || [],
      capacity: data.capacity,
      lastPassengerScanned: data.last_passenger_scanned || null,
    };
  } catch (error) {
    console.error("Passenger API error:", error);
    return {
      success: false,
      passengers: [],
      capacity: 0,
      lastPassengerScanned: null,
    };
  }
};

export const getQueues = async () => {
  try {
    const idToken = await getToken();
    if (!idToken) throw new Error("User not authenticated");

    const url = joinUrl(API_BASE_URL, "queues/");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to fetch queues");
    }

    return { success: true, queues: data };
  } catch (error) {
    console.error("Get queues error:", error);
    return { success: false, queues: [] };
  }
};

export const scanQr = async (busId, qrJson) => {
  try {
    const idToken = await getToken();
    if (!idToken) throw new Error("User not authenticated");
    if (!busId) throw new Error("Bus ID is required");

    const url = joinUrl(API_BASE_URL, `buses/${busId}/scan-qr`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ qr_json: qrJson }),
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = data.detail || "Failed to scan QR code";
      throw new Error(msg);
    }

    return { success: true, data };
  } catch (error) {
    console.error("scanQr API error:", error);
    return { success: false, message: error.message };
  }
};

export const addWalkInPassenger = async (busId) => {
  try {
    const idToken = await getToken();
    if (!idToken) throw new Error("User not authenticated");
    if (!busId) throw new Error("Bus ID is required");

    const url = joinUrl(API_BASE_URL, `buses/${busId}/manual-add`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = data.detail || "Failed to add walk-in passenger";
      throw new Error(msg);
    }

    return {
      success: true,
      passenger: data.passenger,
      message: data.message,
    };
  } catch (error) {
    console.error("Add walk-in passenger error:", error);
    return { success: false, message: error.message };
  }
};

export const addPrivilegedPassenger = async (busId, force = false) => {
  try {
    const idToken = await getToken();
    if (!idToken) throw new Error("User not authenticated");
    if (!busId) throw new Error("Bus ID is required");

    const url = joinUrl(API_BASE_URL, `buses/${busId}/manual-add/privileged`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ force }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const msg = data.message || "Failed to add privileged passenger";
      throw new Error(msg);
    }

    return {
      success: true,
      passengerTicket: data.ticket_number,
      message: data.message,
      forced: data.forced,
      remainingPrioritySeats: data.remaining_priority_seats,
      remainingCapacity: data.remaining_capacity,
    };
  } catch (error) {
    console.error("Add privileged passenger error:", error);
    return { success: false, message: error.message };
  }
};

export const getAllBuses = async () => {
  try {
    const idToken = await getToken();
    if (!idToken) throw new Error("User not authenticated");

    const url = joinUrl(API_BASE_URL, "buses/");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to fetch buses");
    }

    return { success: true, buses: data };
  } catch (error) {
    return { success: false, buses: [], message: error.message };
  }
};

export const releaseBus = async (busId) => {
  try {
    const idToken = await getToken();
    if (!idToken) throw new Error("User not authenticated");
    if (!busId) throw new Error("Bus ID is required");

    const url = joinUrl(API_BASE_URL, `buses/${busId}/release`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = data.detail || "Failed to release bus";
      throw new Error(msg);
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
