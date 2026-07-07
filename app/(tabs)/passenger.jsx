import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { signOutAccount } from "../../api/auth";
import { getAttendantPassengers } from "../../api/buses";
import {
  clearQueueId,
  clearTripState,
  getQueueId,
  getTripState,
} from "../../utils/authStorage";

const TRIP_STATUS_CHECK_INTERVAL_MS = 4000;
const WS_RECONNECT_BASE_DELAY_MS = 2000;
const WS_RECONNECT_MAX_DELAY_MS = 30000;
const POLL_BASE_INTERVAL_MS = 10000;
const POLL_MAX_INTERVAL_MS = 60000;
const WS_DEGRADED_ALERT_MS = 60000;

const Passenger = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("queue");
  const [passengers, setPassengers] = useState([]);
  const [capacity, setCapacity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [connectionDegraded, setConnectionDegraded] = useState(false);
  const [tripStatus, setTripStatus] = useState("idle");

  const authExpiredRef = useRef(false);
  const teardownConnectionRef = useRef(() => {});

  const getWsBaseUrl = () => {
    const base = process.env.EXPO_PUBLIC_API_BASE_URL;
    return base.replace(/^http/, "ws");
  };

  useEffect(() => {
    let ws = null;
    let isActive = true;
    let tracking = false;
    let pollTimeout = null;
    let reconnectTimeout = null;
    let tripStatusInterval = null;
    let pollDelay = POLL_BASE_INTERVAL_MS;
    let reconnectDelay = WS_RECONNECT_BASE_DELAY_MS;
    let wsDegradedSince = null;
    let hasAlerted = false;

    const clearPollTimeout = () => {
      if (pollTimeout) {
        clearTimeout(pollTimeout);
        pollTimeout = null;
      }
    };

    const clearReconnectTimeout = () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
    };

    const stopPolling = () => clearPollTimeout();

    const checkDegradedAlert = () => {
      if (
        wsDegradedSince &&
        !hasAlerted &&
        Date.now() - wsDegradedSince > WS_DEGRADED_ALERT_MS
      ) {
        hasAlerted = true;
        setConnectionDegraded(true);
      }
    };

    const noteWsDown = () => {
      if (!wsDegradedSince) wsDegradedSince = Date.now();
      checkDegradedAlert();
    };

    const markWsHealthy = () => {
      wsDegradedSince = null;
      hasAlerted = false;
      reconnectDelay = WS_RECONNECT_BASE_DELAY_MS;
      pollDelay = POLL_BASE_INTERVAL_MS;
      setConnectionDegraded(false);
    };

    const scheduleNextPoll = (delay) => {
      clearPollTimeout();
      if (!isActive || authExpiredRef.current || !tracking) return;
      pollTimeout = setTimeout(pollTick, delay);
    };

    const pollTick = async () => {
      if (!isActive || authExpiredRef.current || !tracking) return;

      const ok = await fetchPassengers();
      pollDelay = ok
        ? POLL_BASE_INTERVAL_MS
        : Math.min(pollDelay * 2, POLL_MAX_INTERVAL_MS);

      checkDegradedAlert();
      maybeConnectWS();
      scheduleNextPoll(pollDelay);
    };

    const startPolling = () => {
      if (pollTimeout || authExpiredRef.current || !tracking) return;
      scheduleNextPoll(pollDelay);
    };

    const scheduleReconnect = () => {
      if (!isActive || authExpiredRef.current || !tracking) return;
      clearReconnectTimeout();
      reconnectTimeout = setTimeout(() => {
        reconnectTimeout = null;
        reconnectDelay = Math.min(
          reconnectDelay * 2,
          WS_RECONNECT_MAX_DELAY_MS,
        );
        maybeConnectWS(true);
      }, reconnectDelay);
    };

    const maybeConnectWS = async (forceAttempt = false) => {
      if (!isActive || authExpiredRef.current || !tracking) return;
      if (
        ws &&
        (ws.readyState === WebSocket.OPEN ||
          ws.readyState === WebSocket.CONNECTING)
      ) {
        return;
      }
      if (reconnectTimeout && !forceAttempt) return;

      const queueId = await getQueueId();

      if (!queueId) {
        startPolling();
        return;
      }

      try {
        const wsBaseUrl = getWsBaseUrl();
        const wsUrl = `${wsBaseUrl}/queues/ws/queues/${queueId}`;

        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          if (!isActive) return;
          markWsHealthy();
          clearReconnectTimeout();
          stopPolling();
          fetchPassengers();
        };

        ws.onmessage = (event) => {
          if (!isActive) return;
          const data = JSON.parse(event.data);
          setPassengers((prev) => applyQueueEvent(prev, data));

          if (data.type === "BUS_DEPARTED") {
            clearQueueId();
            clearTripState();
            ws.close();
          }
        };

        ws.onerror = () => {
          if (!isActive || authExpiredRef.current || !tracking) return;
          noteWsDown();
          startPolling();
        };

        ws.onclose = () => {
          if (!isActive || authExpiredRef.current || !tracking) return;
          noteWsDown();
          startPolling();
          scheduleReconnect();
        };
      } catch {
        noteWsDown();
        startPolling();
        scheduleReconnect();
      }
    };

    const stopTracking = () => {
      if (!tracking) return;
      tracking = false;
      clearPollTimeout();
      clearReconnectTimeout();
      wsDegradedSince = null;
      hasAlerted = false;
      pollDelay = POLL_BASE_INTERVAL_MS;
      reconnectDelay = WS_RECONNECT_BASE_DELAY_MS;
      setConnectionDegraded(false);
      ws?.close();
      ws = null;
    };

    const startTracking = () => {
      if (tracking) return;
      tracking = true;
      fetchPassengers();
      maybeConnectWS();
      startPolling();
    };

    // "arrived": live WS/POLL tracking, the list can still change.
    // "ongoing": boarding closed, list is final — fetch it exactly once
    // (covers both "just departed" and "app opened mid-trip"), then leave
    // it alone. No poll, no WS, no repeat fetches for the rest of the trip.
    // "idle"/"active": no queue exists yet — nothing to show, clear it.
    let ongoingSnapshotFetched = false;

    const applyTripStatus = (status) => {
      if (status === "arrived") {
        ongoingSnapshotFetched = false;
        startTracking();
        return;
      }

      stopTracking();

      if (status === "ongoing") {
        if (!ongoingSnapshotFetched) {
          ongoingSnapshotFetched = true;
          fetchPassengers();
        }
        return;
      }

      ongoingSnapshotFetched = false;
      setPassengers([]);
      setCapacity(0);
    };

    const checkTripStatus = async () => {
      if (!isActive || authExpiredRef.current) return;
      const { tripStatus: status } = await getTripState();
      setTripStatus(status);
      applyTripStatus(status);
    };

    teardownConnectionRef.current = () => {
      stopTracking();
      if (tripStatusInterval) clearInterval(tripStatusInterval);
    };

    checkTripStatus();
    tripStatusInterval = setInterval(
      checkTripStatus,
      TRIP_STATUS_CHECK_INTERVAL_MS,
    );

    return () => {
      isActive = false;
      if (tripStatusInterval) clearInterval(tripStatusInterval);
      clearPollTimeout();
      clearReconnectTimeout();
      ws?.close();
    };
  }, []);

  const handleSessionExpired = async () => {
    if (authExpiredRef.current) return;
    authExpiredRef.current = true;

    teardownConnectionRef.current();

    await signOutAccount();

    Alert.alert(
      "Session expired",
      "Please log in again to continue.",
      [
        {
          text: "OK",
          onPress: () => router.replace("/login"),
        },
      ],
      { cancelable: false },
    );
  };

  const applyQueueEvent = (passengers, event) => {
    switch (event.type) {
      case "PASSENGER_QUEUED":
        if (passengers.some((p) => p.id === event.passenger.id))
          return passengers;
        return [...passengers, event.passenger];
      case "PASSENGER_BOARDED":
        return passengers.map((p) =>
          p.id === event.passenger.id ? { ...p, status: "boarded" } : p,
        );
      case "PASSENGER_LEFT":
        return passengers.filter((p) => p.id !== event.passenger.id);
      case "BUS_DEPARTED":
        return [];
      default:
        return passengers;
    }
  };

  const fetchPassengers = async () => {
    if (authExpiredRef.current) {
      setLoading(false);
      setRefreshing(false);
      return false;
    }

    try {
      setLoading(true);
      const result = await getAttendantPassengers();

      if (result.authError) {
        handleSessionExpired();
        return false;
      }

      if (!result.success) {
        return false;
      }

      setPassengers(result.passengers);
      setCapacity(result.capacity);
      return true;
    } catch (error) {
      console.error("Failed to fetch passengers:", error);
      return false;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const shouldSkipMasking = (name) => {
    return (
      name.startsWith("Walk-in #") || name.startsWith("Priority Walk-in #")
    );
  };

  const maskName = (name) => {
    if (!name || shouldSkipMasking(name)) {
      return name;
    }

    return name
      .split(" ")
      .map((part) => {
        if (part.length <= 2) return part;
        return part.slice(0, 2) + "*".repeat(part.length - 2);
      })
      .join(" ");
  };

  const boardedPassengers = passengers.filter(
    (p) => p.status === "boarded" || p.status === "ongoing",
  );

  const queuePassengers = passengers.filter(
    (p) => p.status !== "boarded" && p.status !== "ongoing",
  );

  const boardedCount = boardedPassengers.length;
  const queueCount = queuePassengers.length;
  const remainingCapacity = Math.max(capacity - boardedCount, 0);

  const renderPassenger = ({ item }) => {
    const isBoarded = item.status === "boarded";
    const isOngoing = item.status === "ongoing";

    return (
      <View style={styles.passengerRow}>
        <View
          style={[
            styles.iconCircle,
            isOngoing && styles.iconCircleOngoing,
            !isBoarded && !isOngoing && styles.iconCircleDisabled,
          ]}
        >
          <Image
            source={
              isBoarded || isOngoing
                ? require("../../assets/images/seat-passenger.png")
                : require("../../assets/images/seat-passenger-disable.png")
            }
            style={[styles.iconImage, isOngoing && { tintColor: "#F5A623" }]}
            resizeMode="contain"
          />
        </View>

        <View>
          <Text style={styles.passengerId}>{maskName(item.name)}</Text>
          <Text
            style={[
              styles.status,
              isBoarded && styles.statusHere,
              isOngoing && styles.statusOngoing,
            ]}
          >
            {isBoarded
              ? "Already here"
              : isOngoing
                ? "Ongoing"
                : "Not yet boarded"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Passenger List</Text>

      {connectionDegraded && (
        <Text style={styles.degradedBanner}>
          Live updates unavailable — refreshing periodically
        </Text>
      )}

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "queue" && styles.tabActive]}
          onPress={() => setActiveTab("queue")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "queue" && styles.tabTextActive,
            ]}
          >
            Passenger queue
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "boarded" && styles.tabActive]}
          onPress={() => setActiveTab("boarded")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "boarded" && styles.tabTextActive,
            ]}
          >
            Boarded passengers
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={activeTab === "queue" ? queuePassengers : boardedPassengers}
        keyExtractor={(item) => item.id}
        renderItem={renderPassenger}
        contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchPassengers();
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {refreshing
                ? "Refreshing..."
                : loading
                  ? "Loading passengers..."
                  : tripStatus === "idle" || tripStatus === "active"
                    ? "\t\t\t\tPassenger unavailable;\nUpdate status to Arrived to view."
                    : activeTab === "queue"
                      ? "No Queued Passengers"
                      : "No Boarded Passengers"}
            </Text>
          </View>
        }
      />

      {/* Counter bubble */}
      {activeTab === "queue" ? (
        <View style={styles.counterBubble}>
          <Text style={styles.counterTop}>
            {String(queueCount).padStart(2, "0")}
          </Text>
          <View style={styles.diagonalLine} />
          <Text style={styles.counterBottom}>
            {String(remainingCapacity ?? 0).padStart(2, "0")}
          </Text>
        </View>
      ) : (
        <View style={styles.counterBubble}>
          <Text style={styles.counterTop}>
            {String(boardedCount).padStart(2, "0")}
          </Text>
          <View style={styles.diagonalLine} />
          <Text style={styles.counterBottom}>
            {String(capacity ?? 0).padStart(2, "0")}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Passenger;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },

  degradedBanner: {
    fontSize: 12,
    color: "#F5A623",
    marginTop: -12,
    marginBottom: 12,
  },

  tabs: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  tabActive: {
    borderBottomColor: "#020eba",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  tabTextActive: {
    color: "#020eba",
    fontWeight: "600",
  },

  passengerRow: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#020eba",
    borderWidth: 2,
    borderColor: "#020eba",
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleDisabled: {
    borderColor: "#8C8C8C",
    backgroundColor: "#ffffff",
  },

  iconImage: {
    width: 20,
    height: 20,
  },

  passengerId: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
  },

  status: {
    fontSize: 11,
    color: "#8C8C8C",
  },

  statusHere: {
    color: "#59A96A",
  },

  statusOngoing: {
    color: "#F5A623",
  },

  iconCircleOngoing: {
    borderColor: "#F5A623",
    backgroundColor: "#FFF8EC",
  },

  counterBubble: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#020eba",
    alignItems: "center",
    justifyContent: "center",
  },

  counterTop: {
    position: "absolute",
    top: 11,
    left: 12,
    fontSize: 24,
    fontWeight: "700",
    color: "#020eba",
  },

  counterBottom: {
    position: "absolute",
    bottom: 11,
    right: 12,
    fontSize: 24,
    fontWeight: "700",
    color: "#020eba",
  },

  diagonalLine: {
    position: "absolute",
    width: 3,
    height: 50,
    backgroundColor: "#020eba",
    transform: [{ rotate: "45deg" }],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#8C8C8C",
    fontWeight: "500",
  },
});
