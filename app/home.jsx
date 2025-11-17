import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { Menu, Provider as PaperProvider } from 'react-native-paper';

export default function Home() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const region = {
    latitude: 37.78825, 
    longitude: -122.4324, 
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLogout = async () => {
    closeMenu();
    router.replace("/logoutModal");
  };

  return (
  <PaperProvider>
    <Stack.Screen options={{ headerShown: false }} />

    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Hello, Seth!</Text>
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
      
      <MapView style={styles.map} region={region}>
        <Marker coordinate={region} title="You are here" />
      </MapView>

      <View>
        <Text>Cher, 0521</Text>
        <Text>One Ayala, Terminal 2</Text>
        <Text>Destination: Pacita</Text>
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
    proceedButton: {
    backgroundColor: "#8C8C8C",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 10,
    width: screenWidth * 0.83,
    alignItems: "center",
    alignSelf: "center",
  },
    textContainer: {
    flexDirection: "column",
    },
    try: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 40,
    },
    icon: {
        width: 34,
        height: 34,       
        alignItems: "center",       
        justifyContent: "center",
    },
});