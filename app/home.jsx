import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { Menu, Provider as PaperProvider } from 'react-native-paper';
import { getMyBus } from "./_api/buses";

export default function Home() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [region, setRegion] = useState(null);
  const [myBus, setMyBus] = useState(null);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLogout = () => {
    closeMenu();
    router.replace("/logoutModal");
  };

  const fetchMyBus = async () => {
    try {
      const result = await getMyBus();
      if (result.success && result.bus) {
        setMyBus(result.bus);
      } else {
        console.log("No assigned bus or failed to fetch.");
      }
    } catch (err) {
      console.error("Error fetching my bus:", err);
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
      await fetchMyBus();
    })();
  }, []);

  return (
  <PaperProvider>
    <Stack.Screen options={{ headerShown: false }} />

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
              <Pressable onPress={openMenu} style={{ padding: 10 }}>
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
        <Text style={styles.status}>Set my status to active</Text>
        <Text style={styles.time}>Terminal 2 - 45 mins</Text>
      </View>

      <View>
        <Pressable style={styles.activeButton} onPress={handleActive}>
          <Text style={styles.active}>Set status as active</Text>
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