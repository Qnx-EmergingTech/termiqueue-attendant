import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { height: screenHeight } = Dimensions.get("window");

const tripHistory = [
  {
    id: "1",
    date: "April 15 2026",
    startTime: "08:00 AM",
    endTime: "09:00 AM",
    status: "completed",
    vehicle: { busName: "Shuttle A", busNumber: "101" },
    route: { origin: "Qnx", destination: "One Ayala" },
    passengerCount: 5,
    passengers: ["Juan", "Maria", "Pedro", "Ana", "Luis"],
  },
  {
    id: "2",
    date: "April 14 2026",
    startTime: "01:00 PM",
    endTime: "02:15 PM",
    status: "completed",
    vehicle: { busName: "Shuttle 2", busNumber: "202" },
    route: { origin: "Qnx", destination: "Lrt Gil Puyat" },
    passengerCount: 3,
    passengers: ["Mark", "John", "Lisa"],
  },
];

export default function TripHistory() {
  const router = useRouter();
  const [expandedTripId, setExpandedTripId] = useState(null);

  return (
    <View style={styles.screen}>
      {/* ✅ BLOB OUTSIDE PADDING FLOW */}
      <Image
        source={require("../assets/images/Blob.png")}
        style={styles.image}
      />

      {/* CONTENT WRAPPER (THIS IS THE ONLY PADDED AREA) */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </Pressable>

          <Text style={styles.title}>Trip History</Text>
        </View>

        <FlatList
          data={tripHistory}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TripCard
              item={item}
              expandedTripId={expandedTripId}
              setExpandedTripId={setExpandedTripId}
            />
          )}
        />
      </View>
    </View>
  );
}

/* ================= CARD ================= */
function TripCard({ item, expandedTripId, setExpandedTripId }) {
  const isExpanded = expandedTripId === item.id;

  const animatedHeight = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    if (isExpanded) {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 220,
        useNativeDriver: false,
      }).start(() => setExpandedTripId(null));
    } else {
      setExpandedTripId(item.id);
      Animated.timing(animatedHeight, {
        toValue: item.passengers.length * 18,
        duration: 220,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.date}>{item.date}</Text>

      <Text style={styles.bus}>
        {item.vehicle.busName} ({item.vehicle.busNumber})
      </Text>

      <Text style={styles.route}>
        {item.route.origin} → {item.route.destination}
      </Text>

      {/* Passenger toggle */}
      <Pressable style={styles.passengerRow} onPress={toggleExpand}>
        <Text style={styles.detail}>Passengers: ({item.passengerCount})</Text>

        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={18}
          color="#333"
        />
      </Pressable>

      {/* Animated list (NO EXTRA WHITE SPACE BUG FIXED) */}
      <Animated.View style={{ height: animatedHeight, overflow: "hidden" }}>
        <View style={styles.passengerBox}>
          {item.passengers.map((p, i) => (
            <Text key={i} style={styles.passenger}>
              • {p}
            </Text>
          ))}
        </View>
      </Animated.View>

      <Text style={styles.detail}>Status: {item.status.toUpperCase()}</Text>

      <Text style={styles.time}>
        {item.startTime} - {item.endTime}
      </Text>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* ✅ blob is absolute, NOT affected by padding */
  image: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: screenHeight * 0.35,
    zIndex: 0,
  },

  /* only real content gets padding */
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
});
