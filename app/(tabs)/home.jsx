import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { Menu, Provider as PaperProvider } from 'react-native-paper';
import { getMyBus } from "../../api/buses";
import { getTripState } from "../../utils/authStorage";
import LogoutModal from "../logoutModal";


export default function Home() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [region, setRegion] = useState(null);
  const [myBus, setMyBus] = useState(null);
  const [isFetchingBus, setIsFetchingBus] = useState(true);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const toggleMenu = () => setMenuVisible(prev => !prev);
  const [tripStatus, setTripStatus] = useState("idle");
  const [actionButtonLabel, setActionButtonLabel] = useState("Set Active Status");
  const isButtonDisabled = isFetchingBus;




  const handleLogout = () => {
    closeMenu();
    setLogoutVisible(true); 
  };

  const handleActive = () => {
  console.log("Status set to active"); //TEMPORARY STUFF, BEFORE INTEGRATING SET BUS QUEUE TO ACTIVE
};

    const loadTripState = async () => {
      const state = await getTripState();
      if (state?.tripStatus) setTripStatus(state.tripStatus);
      if (state?.buttonLabel) setActionButtonLabel(state.buttonLabel);
    };


  const fetchMyBus = async () => {
    setIsFetchingBus(true);
    try {
      const result = await getMyBus();
      if (result.success && result.bus) {
        setMyBus(result.bus);
      } else {
        console.log("No assigned bus or failed to fetch.");
      }
    } catch (err) {
      console.error("Error fetching my bus:", err);
    }finally {
    setIsFetchingBus(false);
  }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied.");
        return;
      }
      await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, distanceInterval: 1 },
        (location) => {
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      );
      await loadTripState();
      await fetchMyBus();
    })();
  }, []);

      useEffect(() => {
        if (!actionButtonLabel) {
          if (tripStatus === "idle") setActionButtonLabel("Set Active Status");
          else if (tripStatus === "active") setActionButtonLabel("Update Status");
          else if (tripStatus === "arrived") setActionButtonLabel("Start Your Trip");
          else if (tripStatus === "ongoing") setActionButtonLabel("Finish Trip");
        }
      }, [tripStatus]);

  return (
  <PaperProvider>
      <LogoutModal
        visible={logoutVisible}
        onClose={() => setLogoutVisible(false)}
      />

    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: 10 }}>
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
      
      {region && (
          <MapView
            style={styles.map}
            region={region}
            showsUserLocation
            showsMyLocationButton
          >
            <Marker coordinate={region} title="You are here" />
          </MapView>
        )}
        
      <View style={styles.info}>
        {myBus ? (
          <>
            <Text style={styles.bus}>
              {myBus.bus_name}, {myBus.bus_number}
            </Text>
            <Text style={styles.destination}>
              {myBus.origin}
            </Text>
            <Text style={styles.destination}>
              Destination: {myBus.destination}
            </Text>
          </>
        ) : (
          <Text style={styles.destination}>Loading bus info...</Text>
        )}
      </View>

        <View style={styles.box}>
            <Text style={styles.status}>
              {tripStatus === "idle" ? "Waiting for you to arrive" :
              tripStatus === "active" ? "You are now active, and on your way!" :
              tripStatus === "arrived" ? "Ready to start your trip" :
              tripStatus === "ongoing" ? "On Going" :
              "Waiting for you to arrive"}
            </Text>


          <Text style={styles.time}>
            Terminal 2 - 45 mins
          </Text>
        </View>

      <View>
        <Pressable 
            disabled={isButtonDisabled}
            style={[
              styles.activeButton,
              isButtonDisabled && { opacity: 0.5 },
            ]}
          onPress={() => {
            if (actionButtonLabel === "Set Active Status") {
              router.push("/activeModal");   
            } 
            else if (actionButtonLabel === "Update Status") {
              router.push({
                pathname: "/arrivedModal",
                params: { busId: myBus.id },
              });
            }
            else if (actionButtonLabel === "Start Your Trip") {
              router.push({
                pathname: "/startModal",
                params: { busId: myBus.id },
              });
            } 
            else if (actionButtonLabel === "Finish Trip") {
              router.push({
                pathname: "/finishModal",
                params: { busId: myBus.id },
              }); 
            }
          }}
        >
          <Text style={styles.active}>{actionButtonLabel}</Text>
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
        marginBottom: 5
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
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.38,
    borderRadius: 12,
    marginTop: 30,
    marginBottom: 20,
    },
    activeButton: {
    backgroundColor: "#096B72",
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
    backgroundColor: "#333242",   
    borderRadius: 8,         
    paddingVertical: 16,
    paddingHorizontal: 24,             
    marginTop: 30,
    gap: 4,          
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
    gap: 6,
   },
   bus: {
    fontFamily: "Roboto_700Bold",
    fontSize: 20,
    color: "#096B72",
   },
   destination: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    color: "black",
   }
});