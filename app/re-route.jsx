import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { claimBus, getAllBuses, releaseBus } from "../api/buses";
import BusCard from "./common/busCard";

const CODING_DAY_BY_LAST_DIGIT = {
  1: 1,
  2: 1, // Monday
  3: 2,
  4: 2, // Tuesday
  5: 3,
  6: 3, // Wednesday
  7: 4,
  8: 4, // Thursday
  9: 5,
  0: 5, // Friday
};

function filterBySchedule(buses) {
  const today = new Date().getDay();
  if (today === 0 || today === 6) return buses; // no coding on weekends

  return buses.filter((bus) => {
    const lastDigit = Number(bus.plate_number.slice(-1));
    return CODING_DAY_BY_LAST_DIGIT[lastDigit] !== today;
  });
}

export default function ReRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentBusId } = useLocalSearchParams();

  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      setFetching(true);
      const res = await getAllBuses();
      if (res.success) {
        const available = res.buses.filter((bus) => bus.status === "available");
        setBuses(filterBySchedule(available));
      }
      setFetching(false);
    };
    fetchBuses();
  }, []);

  const handleChangeBus = async () => {
    if (!selectedBusId) {
      return Alert.alert("Select a bus", "Please select a new bus.");
    }

    setLoading(true);

    if (currentBusId) {
      const releaseRes = await releaseBus(currentBusId);
      if (!releaseRes.success) {
        setLoading(false);
        return Alert.alert("Error", releaseRes.message);
      }
    }

    const claimRes = await claimBus(selectedBusId);
    setLoading(false);

    if (!claimRes.success) {
      return Alert.alert("Error", claimRes.message);
    }

    router.replace("/(tabs)/home");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerBackTitleVisible: false,
          gestureEnabled: true,
        }}
      />

      <View style={styles.container}>
        <Image
          source={require("../assets/images/Blob.png")}
          style={styles.image}
        />

        <Text style={styles.heading}>Change Shuttle</Text>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {fetching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#020eba" />
              <Text style={styles.loadingText}>
                Loading available shuttles...
              </Text>
            </View>
          ) : buses.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>
                No available shuttles at the moment
              </Text>
            </View>
          ) : (
            buses.map((bus) => (
              <BusCard
                key={bus.id}
                bus={bus}
                selected={bus.id === selectedBusId}
                onPress={() => setSelectedBusId(bus.id)}
              />
            ))
          )}
        </ScrollView>

        <Pressable
          style={[
            styles.proceedButton,
            !selectedBusId && styles.disabled,
            { bottom: insets.bottom + 16 },
          ]}
          onPress={handleChangeBus}
          disabled={!selectedBusId || loading || fetching}
        >
          <Text style={styles.proceed}>
            {loading ? "UPDATING..." : "CONFIRM CHANGE"}
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    position: "absolute",
    top: 0,
    height: screenHeight * 0.45,
    width: "100%",
  },
  heading: {
    position: "absolute",
    top: screenHeight * 0.1,
    width: "100%",
    textAlign: "center",
    fontFamily: "Roboto_700Bold",
    fontSize: 28,
  },
  scrollArea: {
    marginTop: 140,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  proceedButton: {
    position: "absolute",
    left: 20,
    right: 20,
    borderRadius: 38,
    backgroundColor: "#020eba",
    justifyContent: "center",
    paddingVertical: 14,
    alignItems: "center",
  },
  disabled: {
    backgroundColor: "#A1A4B2",
  },
  proceed: {
    color: "white",
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
  },
  loadingContainer: {
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    color: "#A1A4B2",
  },
});
