import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from 'react-native-paper';
import { getAttendantPassengers, getMyBus } from "../../api/buses";


export default function Scan() {
  const router = useRouter();
  const [myBus, setMyBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [boardedCount, setBoardedCount] = useState(0);
  const canAddPassenger = myBus?.status === "arrived";

  useEffect(() => {
  const fetchMyBus = async () => {
    const result = await getMyBus();
    if (result.success && result.bus) {
      setMyBus(result.bus);
    }
    const passengerResult = await getAttendantPassengers();
    if (passengerResult.success) {
      const boarded = passengerResult.passengers.filter(
        p => p.status === "boarded"
      );
      setBoardedCount(boarded.length);
    }
    setLoading(false);
  };

  fetchMyBus();
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

  return (
  <PaperProvider>

    <View style={styles.container}>
      <Text style={styles.header}>Add a Passenger</Text>

      <View style={styles.info1}>
          <Ionicons name="bus-outline" size={170} color="#096B72" style={styles.icon}/>
          <View style={{ flex: 1 }}>
            {loading ? (
              <Text style={styles.details}>Loading bus info...</Text>
            ) : myBus ? (
              <>
                <Text style={styles.bus}>{myBus.bus_name}, {myBus.bus_number}</Text>
                <Text style={styles.details}>{myBus.origin}</Text>
                <Text style={styles.details}>Destination: {myBus.destination}</Text>
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
            {/* Last passenger scanned — API not available yet */}
            <Text style={styles.details}>
              Last passenger scanned: {myBus?.lastScanTime || "4:40pm"}
            </Text>
            {/* Idle duration placeholder */}
            <Text style={styles.details}>
              No Activity for {myBus?.idleDuration || "5 minutes"}
            </Text>
            {/* Schedule hint — static for now */}
            <Text style={styles.details}>
              You're {myBus?.delayTime || "5 minutes"} behind schedule. Consider starting route soon
            </Text>
          </View>


        <View style={styles.bottomContainer}>
        {!canAddPassenger && !loading && (
        <Text style={styles.statusHint}>
          Set your status to "Has Arrived" first in the home screen to add a passenger
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 20,
    },
     header: {
    fontSize: 20,
    fontWeight: '600',
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