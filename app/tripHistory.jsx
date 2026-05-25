import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getAttendantTripDetail, getAttendantTrips } from "../api/trips";

const { height: screenHeight } = Dimensions.get("window");

const formatDate = (ts) => {
  if (!ts) return "Unknown date";
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (ts) => {
  if (!ts) return "--";
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

export default function TripHistory() {
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTripId, setExpandedTripId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const result = await getAttendantTrips();
      if (result.success) {
        const sorted = [...result.trips].sort(
          (a, b) => new Date(b.finished_at) - new Date(a.finished_at)
        );
        setTrips(sorted);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator size="large" color="#020eba" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Image
        source={require("../assets/images/Blob.png")}
        style={styles.image}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </Pressable>
          <Text style={styles.title}>Trip History</Text>
        </View>

        {trips.length === 0 ? (
          <Text style={styles.empty}>No trip history found.</Text>
        ) : (
          <FlatList
            data={trips}
            keyExtractor={(item) => item.trip_id}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TripCard
                item={item}
                expandedTripId={expandedTripId}
                setExpandedTripId={setExpandedTripId}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}

/* ================= CARD ================= */
function TripCard({ item, expandedTripId, setExpandedTripId }) {
  const isExpanded = expandedTripId === item.trip_id;
  const [passengers, setPassengers] = useState([]);
  const [loadingPassengers, setLoadingPassengers] = useState(false);
  const cachedPassengers = useRef(null);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const toggleExpand = async () => {
    if (isExpanded) {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 220,
        useNativeDriver: false,
      }).start(() => setExpandedTripId(null));
      return;
    }

    setExpandedTripId(item.trip_id);

    if (cachedPassengers.current !== null) {
      setPassengers(cachedPassengers.current);
      Animated.timing(animatedHeight, {
        toValue: cachedPassengers.current.length * 22 + 8,
        duration: 220,
        useNativeDriver: false,
      }).start();
      return;
    }

    // Show loading spinner at fixed height, then expand to full
    Animated.timing(animatedHeight, {
      toValue: 36,
      duration: 150,
      useNativeDriver: false,
    }).start();

    setLoadingPassengers(true);
    const result = await getAttendantTripDetail(item.trip_id);
    const pList = result.success ? result.detail.passengers : [];
    cachedPassengers.current = pList;
    setPassengers(pList);
    setLoadingPassengers(false);

    Animated.timing(animatedHeight, {
      toValue: Math.max(pList.length * 22 + 8, 36),
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.date}>{formatDate(item.finished_at)}</Text>

      <Text style={styles.bus}>
        Shuttle No. {item.bus_number} • {item.plate_number}
      </Text>

      <Text style={styles.route}>
        {item.origin} → {item.destination}
      </Text>

      <Pressable style={styles.passengerRow} onPress={toggleExpand}>
        <Text style={styles.detail}>Passengers: ({item.passenger_count})</Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={18}
          color="#333"
        />
      </Pressable>

      <Animated.View style={{ height: animatedHeight, overflow: "hidden" }}>
        <View style={styles.passengerBox}>
          {loadingPassengers ? (
            <ActivityIndicator size="small" color="#020eba" />
          ) : (
            passengers.map((p, i) => (
              <Text key={i} style={styles.passenger}>
                • {p.full_name}
                {p.is_privileged ? " (PWD/Senior)" : ""}
              </Text>
            ))
          )}
        </View>
      </Animated.View>

      <Text style={styles.time}>
        Departed: {formatTime(item.departed_at)}
      </Text>
      {item.finished_at && (
        <Text style={styles.arrived}>
          Finished: {formatTime(item.finished_at)}
        </Text>
      )}
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: screenHeight * 0.35,
    zIndex: 0,
  },

  content: {
    flex: 1,
    padding: 20,
    zIndex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  date: {
    fontSize: 16,
    fontWeight: "700",
  },

  bus: {
    fontSize: 14,
    color: "#020eba",
    marginTop: 4,
  },

  route: {
    fontSize: 14,
    marginTop: 4,
  },

  detail: {
    fontSize: 13,
    marginTop: 6,
  },

  time: {
    fontSize: 12,
    marginTop: 6,
    color: "#666",
  },

  passengerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  passengerBox: {
    marginTop: 4,
  },

  passenger: {
    fontSize: 12,
    marginLeft: 10,
  },

  arrived: {
    fontSize: 12,
    marginTop: 4,
    color: "#020eba",
  },
});
