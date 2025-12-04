import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from 'react-native-paper';

export default function Scan() {
  const router = useRouter();

  return (
  <PaperProvider>

    <View style={styles.container}>
      <Text style={styles.header}>Scan</Text>

      <View style={styles.info1}>
          <Ionicons name="bus-outline" size={170} color="#096B72" style={styles.icon}/>
          <View style={{ flex: 1 }}>
            <Text style={styles.bus}>Cher, 0521</Text>
            <Text style={styles.details}>One Ayala, Terminal 2</Text>
            <Text style={styles.details}>Destination: Pacita</Text>
            <Text style={styles.details}>Capacity: 12/45</Text>
            <Text style={styles.details}>Status: Waiting for passengers</Text>
          </View>
        </View>

      <View style={styles.info}>
            <Text style={styles.vehicle}>Vehicle Info</Text>
            <Text style={styles.details}>Bus Plate Number: PGH522</Text>
            <Text style={styles.details}>Last passenger scanned: 5:38 PM</Text>
            <Text style={styles.details}>No Activity for 10 mins</Text>
            <Text style={styles.details}>You're 5 mins behind schedule. Consider starting route soon</Text>
      </View>

        <View style={styles.bottomContainer}>
          <View style={styles.box}>
            <Text style={styles.status}>Scan Passenger</Text>
            <Text style={styles.time}>Route - Pacita</Text>
          </View>

          <Pressable style={styles.activeButton} onPress={() => {
              router.push("/addpassengerModal");
            }}>
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
});