import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { getAttendantPassengers, getMyBus } from "../../api/buses";

export default function Scan() {
  const router = useRouter();
  const [myBus, setMyBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [boardedCount, setBoardedCount] = useState(0);
  const [lastScanned, setLastScanned] = useState(null);
  const canAddPassenger = myBus?.status === "arrived";

  useEffect(() => {
    const fetchData = async () => {
      const busResult = await getMyBus();
      if (busResult.success && busResult.bus) {
        setMyBus(busResult.bus);
      }

      const passengerResult = await getAttendantPassengers();

      if (passengerResult.success) {
        const boarded = passengerResult.passengers.filter(
          (p) => p.status === "boarded",
        );

        setBoardedCount(boarded.length);

        const latestActivity = getLatestActivity(
          passengerResult.lastPassengerScanned,
          passengerResult.passengers,
        );

        setLastScanned(latestActivity);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const getBusStatusText = (status) => {
    switch (status) {
      case "idle":
        return "Not Operating";
      case "active":
        return "Not Operating";
      case "arrived":
        return "Waiting for passengers";
      case "ongoing":
        return "Ongoing trip";
      case "in_transit":
        return "Ongoing trip";
      case "offline":
        return "Not operating";
      default:
        return "Unknown";
    }
  };

  const getAttendantMessage = (status) => {
    switch (status) {
      case "arrived":
        return "Ready to scan — please register passengers as they board.";
      case "ongoing":
      case "in_transit":
        return "Trip in progress. Passenger scanning is unavailable.";
      case "idle":
      case "active":
        return "Bus is not yet accepting passengers.";
      case "offline":
        return "Bus is currently offline.";
      default:
        return "";
    }
  };

  const getLatestActivity = (apiLastScanned, passengers = []) => {
    if (apiLastScanned?.timestamp) {
      return apiLastScanned;
    }

    if (passengers.length > 0) {
      const sorted = [...passengers].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      );

      return sorted[0];
    }

    return null;
  };

  const formatTime = (isoString) => {
    if (!isoString) return "—";

    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const minutesSince = (isoString) => {
    if (!isoString) return "—";

    const now = new Date();
    const then = new Date(isoString);

    const diffMs = now - then;
    return Math.floor(diffMs / 60000);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.header}>Add a Passenger</Text>

        <View style={styles.info1}>
          <Ionicons
            name="bus-outline"
            size={170}
            color="#096B72"
            style={styles.icon}
          />
          <View style={{ flex: 1 }}>
            {loading ? (
              <Text style={styles.details}>Loading bus info...</Text>
            ) : myBus ? (
              <>
                <Text style={styles.bus}>
                  {myBus.bus_name}, {myBus.bus_number}
                </Text>
                <Text style={styles.details}>{myBus.origin}</Text>
                <Text style={styles.details}>
                  Destination: {myBus.destination}
                </Text>
                <Text style={styles.details}>
                  Capacity: {boardedCount}/{myBus.capacity}
                </Text>
                <Text style={styles.details}>
                  Status: {getBusStatusText(myBus.status)}
                </Text>
              </>
            ) : (
              <Text style={styles.details}>No assigned bus</Text>
            )}
          </View>
        </View>

        <View style={styles.info}>
          <Text style={styles.vehicle}>Vehicle Info</Text>
          <Text style={styles.details}>
            Bus Plate Number: {myBus?.plate_number || "—"}
          </Text>
          <Text style={styles.details}>
            Last passenger scanned:{" "}
            {lastScanned ? formatTime(lastScanned.timestamp) : "— "}
          </Text>

          <Text style={styles.details}>
            {lastScanned
              ? `No activity for ${minutesSince(lastScanned.timestamp)} minutes`
              : "Awaiting first boarding activity"}
          </Text>
          {/* No endpoint for this ( just put a reminder for now will replace soon ) */}
          {/* <Text style={styles.details}>
            You're 5 minutes behind schedule. Consider starting route soon
          </Text> */}
          <Text style={styles.details}>
            {getAttendantMessage(myBus?.status)}
          </Text>
        </View>

        <View style={styles.bottomContainer}>
          {!canAddPassenger && !loading && (
            <Text style={styles.statusHint}>
              Set your status to "Has Arrived" first in the home screen to add a
              passenger
            </Text>
          )}
          <Pressable
            style={[
              styles.activeButton,
              !canAddPassenger && styles.disabledButton,
            ]}
            disabled={!canAddPassenger}
            onPress={() => {
              if (!myBus?.id) {
                Alert.alert("Error", "Bus not loaded yet");
                return;
              }

              router.push({
                pathname: "/addpassengerModal",
                params: { busId: myBus.id },
              });
            }}
          >
            <Text style={styles.active}>Add A Passenger</Text>
          </Pressable>
        </View>
      </View>
    </PaperProvider>
  );
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
    marginBottom: 20,
  },
  activeButton: {
    backgroundColor: "#096B72",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 38,
    marginTop: 10,
    width: screenWidth * 0.9,
    alignItems: "center",
    alignSelf: "center",
  },
  active: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    color: "white",
  },
  box: {
    backgroundColor: "#333242",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 30,
    marginBottom: 6,
  },
  status: {
    fontFamily: "Roboto_700Bold",
    fontSize: 18,
    color: "white",
  },
  time: {
    fontFamily: "Roboto_500Medium",
    fontSize: 11,
    color: "white",
  },
  info: {
    marginBottom: 6,
  },
  info1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  bus: {
    fontFamily: "Roboto_700Bold",
    fontSize: 20,
    color: "#096B72",
    marginBottom: 5,
  },
  details: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    color: "black",
    marginBottom: 5,
  },
  vehicle: {
    fontFamily: "Roboto_700Bold",
    fontSize: 20,
    color: "black",
    marginBottom: 5,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  disabledButton: {
    backgroundColor: "#BFC5C6",
  },
  statusHint: {
    color: "red",
    fontStyle: "italic",
    fontSize: 12,
    textAlign: "left",
  },
});
