import { Stack, useRouter } from "expo-router";
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
import { claimBus, getAllBuses } from "../api/buses";
import BusCard from "../app/common/busCard";

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

const PRIMARY_PLATE_NUMBER = "NLF4077";
const BACKUP_PLATE_NUMBER = "NJF9354";

const normalizePlate = (plate) => plate?.replace(/\s+/g, "").toUpperCase();

function isCodingRestrictedToday(bus) {
  const today = new Date().getDay();
  if (today === 0 || today === 6) return false;

  const lastDigit = Number(normalizePlate(bus.plate_number).slice(-1));
  return CODING_DAY_BY_LAST_DIGIT[lastDigit] === today;
}

function annotateBuses(buses) {
  const isUsablePrimary = (bus) =>
    normalizePlate(bus.plate_number) === PRIMARY_PLATE_NUMBER &&
    bus.status === "available" &&
    !isCodingRestrictedToday(bus);

  const hasUsablePrimary = buses.some(isUsablePrimary);

  return buses
    .filter((bus) => !isCodingRestrictedToday(bus))
    .filter((bus) => !(normalizePlate(bus.plate_number) === BACKUP_PLATE_NUMBER && hasUsablePrimary))
    .map((bus) => {
      if (bus.status !== "available") {
        return {
          ...bus,
          disabled: true,
          reason: `Claimed by ${bus.attendant_name || "another attendant"}`,
        };
      }
      return { ...bus, disabled: false, reason: null };
    });
}

export default function Route() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      setFetching(true);
      const res = await getAllBuses();
      if (res.success) {
        setBuses(annotateBuses(res.buses));
      }
      setFetching(false);
    };

    fetchBuses();
  }, []);

  const handleClaim = async () => {
    if (!selectedBusId) {
      return Alert.alert("Select a bus", "Please select one bus to claim.");
    }

    setLoading(true);
    const res = await claimBus(selectedBusId);
    setLoading(false);

    if (!res.success) {
      const isCodingViolation = res.message?.toLowerCase().includes("coding");
      return Alert.alert(
        isCodingViolation ? "Coding Restriction" : "Error",
        isCodingViolation
          ? "Warning: Operation of this vehicle during restricted hours may constitute a violation of the Metro Manila Unified Vehicular Volume Reduction Program (UVVRP)."
          : res.message,
      );
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

        <Text style={styles.heading}>Claim a Vehicle</Text>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {fetching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#020eba" />
              <Text style={styles.loadingText}>
                Loading available vehicle...
              </Text>
            </View>
          ) : buses.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>
                No available vehicle at the moment
              </Text>
            </View>
          ) : (
            buses.map((bus) => (
              <BusCard
                key={bus.id}
                bus={bus}
                selected={bus.id === selectedBusId}
                disabled={bus.disabled}
                reason={bus.reason}
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
          onPress={handleClaim}
          disabled={!selectedBusId || loading || fetching}
        >
          <Text style={styles.proceed}>
            {loading ? "CLAIMING..." : "CLAIM VEHICLE"}
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
