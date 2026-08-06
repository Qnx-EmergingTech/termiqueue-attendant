import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Menu, Provider as PaperProvider } from "react-native-paper";
import { signOutAccount } from "../../api/auth";
import { getMyBus, updateBusLocation } from "../../api/buses";
import LogoutModal from "../logoutModal";

// Module-level cache — survives remounts from router.replace
let _cachedBus = null;
let _cachedRegion = null;

// Lets other screens (e.g. finishModal) stop location tracking immediately
// on a trip-ending action, without waiting for Home to regain focus —
// Home stays mounted in the background when navigating away, so its GPS
// watcher would otherwise keep firing with a stale bus status indefinitely.
export function clearCachedBus() {
  _cachedBus = null;
}

const mapBusStatusToTripStatus = (busStatus) => {
  switch (busStatus) {
    case "available":
      return "idle";
    case "active":
      return "active";
    case "arrived":
      return "arrived";
    case "in_transit":
      return "ongoing";
    default:
      return "idle";
  }
};

const getActionLabel = (status) => {
  switch (status) {
    case "idle":
      return "Set Active Status";
    case "active":
      return "Update Status";
    case "arrived":
      return "Start Your Trip";
    case "ongoing":
      return "Finish Trip";
    default:
      return "Set Active Status";
  }
};

// While "active": bus is heading to the pickup point, drives the
// "bus approaching" proximity alert to passengers waiting in queue.
const trackPickupProximity = (bus, latitude, longitude) => {
  if (bus?.status !== "active") return;
  updateBusLocation(bus.id, latitude, longitude);
};

// While "in_transit": bus is en route to the destination, drives the
// destination-arrival alert to onboard passengers and the
// "tap Finish Trip" prompt to the attendant.
const trackDestinationArrival = (bus, latitude, longitude) => {
  if (bus?.status !== "in_transit") return;
  updateBusLocation(bus.id, latitude, longitude);
};

export default function Home() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [region, setRegion] = useState(_cachedRegion);
  const regionSet = useRef(!!_cachedRegion);
  const [locationDenied, setLocationDenied] = useState(false);

  const initialStatus = _cachedBus
    ? mapBusStatusToTripStatus(_cachedBus.status)
    : "idle";
  const [myBus, setMyBus] = useState(_cachedBus);
  const [isFetchingBus, setIsFetchingBus] = useState(!_cachedBus);
  const [tripStatus, setTripStatus] = useState(initialStatus);
  const [actionButtonLabel, setActionButtonLabel] = useState(
    getActionLabel(initialStatus),
  );
  const closeMenu = () => setMenuVisible(false);
  const toggleMenu = () => setMenuVisible((prev) => !prev);
  const isButtonDisabled = isFetchingBus || !myBus;

  const handleLogout = () => {
    closeMenu();
    setLogoutVisible(true);
  };

  const fetchMyBus = async () => {
    const hadCachedBus = !!_cachedBus;
    if (!_cachedBus) setIsFetchingBus(true);
    try {
      const result = await getMyBus();
      if (result.success && result.bus) {
        _cachedBus = result.bus;
        setMyBus(result.bus);
        const derivedStatus = mapBusStatusToTripStatus(result.bus.status);
        setTripStatus(derivedStatus);
        setActionButtonLabel(getActionLabel(derivedStatus));
      } else if (
        result.message?.toLowerCase().includes("invalid") ||
        result.message?.toLowerCase().includes("expired")
      ) {
        Alert.alert(
          "Session Expired",
          "Your session has expired. Please log in again.",
          [
            {
              text: "OK",
              onPress: async () => {
                await signOutAccount();
                router.replace("/login");
              },
            },
          ],
          { cancelable: false },
        );
      } else {
        _cachedBus = null;
        setMyBus(null);
        if (!hadCachedBus) {
          Alert.alert(
            "No Shuttle Assigned",
            "You don't have a shuttle assigned yet. Would you like to claim one now?",
            [
              { text: "Not Now", style: "cancel" },
              { text: "Claim a Shuttle", onPress: () => router.push("/route") },
            ],
          );
        }
      }
    } catch (err) {
      console.error("Error fetching my bus:", err);
    } finally {
      setIsFetchingBus(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyBus();
    }, []),
  );

  useEffect(() => {
    let subscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationDenied(true);
        return;
      }
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, distanceInterval: 1 },
        (location) => {
          const { latitude, longitude } = location.coords;
          const r = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          _cachedRegion = r;
          setRegion(r);
          regionSet.current = true;

          trackPickupProximity(_cachedBus, latitude, longitude);
          trackDestinationArrival(_cachedBus, latitude, longitude);
        },
      );
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <PaperProvider>
      <LogoutModal
        visible={logoutVisible}
        onClose={() => setLogoutVisible(false)}
      />

      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            marginBottom: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              Hello{myBus?.attendant_name ? `, ${myBus.attendant_name}!` : "!"}
            </Text>
            <Text style={styles.title}>Ready for your next trip?</Text>
          </View>

          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: 5,
            }}
            anchor={
              <Pressable onPress={toggleMenu} style={{ padding: 10 }}>
                <Ionicons name="ellipsis-vertical" size={24} color="#A1A4B2" />
              </Pressable>
            }
          >
            <Menu.Item
              onPress={() => {
                closeMenu();
                router.push({
                  pathname: "/tripHistory",
                });
              }}
              title="Trip History"
              leadingIcon={() => (
                <Ionicons name="time-outline" size={24} color="#020eba" />
              )}
              titleStyle={{
                fontFamily: "Roboto_500Medium",
                fontSize: 16,
                color: "#333",
              }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}
            />
            <Menu.Item
              disabled={
                myBus && (tripStatus === "arrived" || tripStatus === "ongoing")
              }
              onPress={() => {
                closeMenu();
                if (!myBus) {
                  router.push("/route");
                  return;
                }
                router.push({
                  pathname: "/re-route",
                  params: { currentBusId: myBus.id },
                });
              }}
              title="Change Shuttle"
              description={
                myBus && (tripStatus === "arrived" || tripStatus === "ongoing")
                  ? "Not permitted while a trip is in progress"
                  : undefined
              }
              leadingIcon={() => (
                <Ionicons
                  name="swap-horizontal-outline"
                  size={24}
                  color={
                    myBus &&
                    (tripStatus === "arrived" || tripStatus === "ongoing")
                      ? "#A1A4B2"
                      : "#020eba"
                  }
                />
              )}
              titleStyle={{
                fontFamily: "Roboto_500Medium",
                fontSize: 16,
                color:
                  myBus &&
                  (tripStatus === "arrived" || tripStatus === "ongoing")
                    ? "#A1A4B2"
                    : "#333",
              }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}
            />
            <Menu.Item
              onPress={handleLogout}
              title="Logout"
              leadingIcon={() => (
                <Ionicons name="log-out-outline" size={24} color="#DB5461" />
              )}
              titleStyle={{
                fontFamily: "Roboto_500Medium",
                fontSize: 16,
                color: "#333",
              }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}
            />
          </Menu>
        </View>

        {locationDenied ? (
          <View style={[styles.map, styles.mapDenied]}>
            <Ionicons name="location-outline" size={32} color="#A1A4B2" />
            <Text style={styles.mapDeniedText}>
              Location access is required to show the map.
            </Text>
            <Text style={styles.mapDeniedSub}>
              Enable it in your device Settings to continue.
            </Text>
          </View>
        ) : region ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={region}
            showsUserLocation
            showsMyLocationButton
          />
        ) : null}

        <View style={styles.info}>
          {myBus ? (
            <>
              <Text style={styles.bus} numberOfLines={1} ellipsizeMode="tail">
                {myBus.bus_name}, {myBus.bus_number}
              </Text>
              <Text style={styles.destination}>{myBus.origin}</Text>
              <Text style={styles.destination}>
                Destination: {myBus.destination}
              </Text>
            </>
          ) : (
            <Text style={styles.destination}>No shuttle assigned yet.</Text>
          )}
        </View>

        <View style={styles.box}>
          <Text style={styles.status}>
            {!myBus
              ? "No shuttle assigned"
              : tripStatus === "idle"
                ? "Waiting for you to arrive"
                : tripStatus === "active"
                  ? "You are now active, and on your way!"
                  : tripStatus === "arrived"
                    ? "Ready to start your trip"
                    : tripStatus === "ongoing"
                      ? "On Going"
                      : "Waiting for you to arrive"}
          </Text>

          <Text style={styles.time}>
            {!myBus
              ? "Claim a shuttle to get started."
              : "Keep an eye on your route and schedule."}
          </Text>
        </View>

        <View>
          {!myBus ? (
            <Pressable
              style={styles.activeButton}
              onPress={() => router.push("/route")}
            >
              <Text style={styles.active}>Claim a Shuttle</Text>
            </Pressable>
          ) : (
            <Pressable
              disabled={isButtonDisabled}
              style={[
                styles.activeButton,
                isButtonDisabled && { opacity: 0.5 },
              ]}
              onPress={() => {
                if (actionButtonLabel === "Set Active Status") {
                  router.push("/activeModal");
                } else if (actionButtonLabel === "Update Status") {
                  router.push({
                    pathname: "/arrivedModal",
                    params: { busId: myBus.id },
                  });
                } else if (actionButtonLabel === "Start Your Trip") {
                  router.push({
                    pathname: "/startModal",
                    params: { busId: myBus.id },
                  });
                } else if (actionButtonLabel === "Finish Trip") {
                  router.push({
                    pathname: "/finishModal",
                    params: { busId: myBus.id },
                  });
                }
              }}
            >
              <Text style={styles.active}>{actionButtonLabel}</Text>
            </Pressable>
          )}
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
  greeting: {
    fontFamily: "Roboto_700Bold",
    fontSize: 20,
  },
  title: {
    fontFamily: "Roboto_400Regular",
    fontSize: 20,
    color: "#A1A4B2",
  },
  btitle: {
    fontFamily: "Roboto_700Bold",
    fontSize: 18,
    color: "white",
    marginBottom: 5,
  },
  stitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 11,
    color: "white",
  },
  out: {
    fontFamily: "Roboto_700Bold",
    fontSize: 20,
    color: "#DB5461",
  },
  outtext: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
  },
  map: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.38,
    borderRadius: 12,
    marginTop: 30,
    marginBottom: 20,
  },
  mapDenied: {
    backgroundColor: "#F2F3F7",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  mapDeniedText: {
    fontSize: 14,
    fontFamily: "Roboto_500Medium",
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  mapDeniedSub: {
    fontSize: 12,
    fontFamily: "Roboto_400Regular",
    color: "#A1A4B2",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  activeButton: {
    backgroundColor: "#020eba",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 38,
    marginTop: 20,
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
    backgroundColor: "#D5D5D5",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 30,
    gap: 4,
  },
  status: {
    fontFamily: "Roboto_700Bold",
    fontSize: 18,
    color: "#3F414E",
  },
  time: {
    fontFamily: "Roboto_500Medium",
    fontSize: 11,
    color: "#3F414E",
  },
  info: {
    gap: 6,
  },
  bus: {
    fontFamily: "Roboto_700Bold",
    fontSize: 20,
    color: "#020eba",
  },
  destination: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    color: "black",
  },
});
