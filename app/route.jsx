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
import { claimBus, getAllBuses } from "../api/buses";
import BusCard from "../app/common/busCard";

export default function Route() {
  const router = useRouter();
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      setFetching(true);
      const res = await getAllBuses();
      if (res.success) {
        setBuses(res.buses.filter((bus) => bus.status === "available"));
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
      return Alert.alert("Error", res.message);
    }

    router.replace("/home");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerBackTitleVisible: false,
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
                onPress={() => setSelectedBusId(bus.id)}
              />
            ))
          )}
        </ScrollView>

        <Pressable
          style={[styles.proceedButton, !selectedBusId && styles.disabled]}
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
    bottom: 30,
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
