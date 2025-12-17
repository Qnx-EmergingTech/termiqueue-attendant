import { Link, Stack, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { Alert, Dimensions, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import DropDownPicker from "react-native-dropdown-picker";
import { claimBus, createBus, getQueues } from "../api/buses";
import { getUser } from "../utils/authStorage";

export default function Route() {
  const router = useRouter();
  const [busName, setBusName] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [plateNumber, setplateNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [user, setUser] = useState(null);
  const [queues, setQueues] = useState([]);
  const [open, setOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(null);
  const [dropdownItems, setDropdownItems] = useState([]);


  useEffect(() => {
    (async () => {
      const currentUser = await getUser();
      if (!currentUser) {
        Alert.alert("Error", "User not authenticated");
        return;
      }
      setUser(currentUser);
    })();
  }, []);

  useEffect(() => {
    const fetchQueues = async () => {
      const res = await getQueues();
      if (res.success) {
        const availableQueues = res.queues.filter(q => !q.bus_id);
        setQueues(availableQueues);

        setDropdownItems(
          availableQueues.map(q => ({
            label: `${q.destination}`,
            value: q.id,
          }))
        );
      }
    };

    fetchQueues();
  }, []);

  const handleCreateBus = async () => {
    if (!busName || !busNumber || !capacity || !destination || !plateNumber || !origin) {
      return Alert.alert("Validation Error", "All fields are required.");
    }

    if (!user) {
      return Alert.alert("Error", "User info not found.");
    }

    const attendantName = [user.first_name, user.middle_name, user.last_name]
      .filter(Boolean)
      .join(" ");

    const busData = {
      bus_name: busName,
      bus_number: busNumber,
      plate_number: plateNumber, 
      priority_seat: 0,
      capacity: Number(capacity),
      origin: origin, 
      destination: destination,
      status: "available",
      current_location: { lat: 0.0, lon: 0.0 },
      attendant_id: user.uid,
      attendant_name: attendantName,
    };

    const res = await createBus(busData);
    if (!res.success) {
      return Alert.alert("Error", res.message);
    }

    const busId = res.bus.id; 
    const claimRes = await claimBus(busId);
    if (!claimRes.success) {
      return Alert.alert("Error", claimRes.message);
    }

    router.push("/home");
  };


  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerBackTitleVisible: false
        }}
      />

      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image 
            source={require('../assets/images/Blob.png')}
            style={styles.image}
          />

          <Text style={styles.heading}>Set your bus route</Text>

          <View style={styles.mid}>
            <TextInput 
              placeholder="Bus company"
              value={busName}
              onChangeText={setBusName}
              style={styles.input}
            />

            <TextInput 
              placeholder="Bus number"
              value={busNumber}
              onChangeText={setBusNumber}
              style={styles.input}
            />

            <TextInput 
              placeholder="Plate number"
              value={plateNumber}
              onChangeText={setplateNumber}
              style={styles.input}
            />

             <TextInput 
              placeholder="Max seat capacity"
              keyboardType="numeric"
              value={capacity}
              onChangeText={setCapacity}
              style={styles.input}
            />

            <TextInput 
              placeholder="Start Route"
              value={origin}
              onChangeText={setOrigin}
              style={styles.input}
            />

            <View style={{ zIndex: 1000, width: "100%" }}>
              <DropDownPicker
                open={open}
                value={dropdownValue}
                items={dropdownItems}
                setOpen={setOpen}
                setValue={(cb) => {
                  const selectedId = cb(dropdownValue);
                  setDropdownValue(selectedId);

                  if (!selectedId) {
                    setDestination("");
                    return;
                  }

                  const queue = queues.find(q => q.id === selectedId);
                  if (!queue) return;

                  setDestination(queue.destination);
                }}
                setItems={setDropdownItems}
                placeholder="End Route"
                style={styles.dropdown}
                textStyle={styles.dropdownText}
                placeholderStyle={styles.placeholder}
                dropDownContainerStyle={styles.dropdownContainer}
                listItemLabelStyle={styles.dropdownText}
              />
            </View>

            <Pressable style={styles.proceedButton} onPress={handleCreateBus}>
              <Text style={styles.proceed}>PROCEED</Text>
            </Pressable>

            <Text style={styles.fp}>Forgot Password?</Text>
          </View>

          <View style={styles.bottom}>
            <Text style={styles.bot}>ALREADY HAVE AN ACCOUNT? </Text>
            <Link href="/signup" style={styles.signUp}>LOG IN</Link>
          </View>
        </View>
      </View>
    </>
  )
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    imageContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    image: {
        position: 'absolute',
        top: 0,          
        left: 0,
        right: 0,
        height: screenHeight * 0.45,
        width:  '100%'
    },
    heading: {
       position: 'absolute',
       top: screenHeight * 0.25,    
       left: '21%',                 
       transform: [{ translateX: -50 }, { translateY: -10 }],
       justifyContent: "center",
       alignItems: "center",
       width: screenWidth * 0.85,
        fontFamily: "Roboto_700Bold",
        fontSize: 28,
        textAlign: "center",
        marginTop: 10,
    },
    mid: {
        flex: 1, 
        marginTop: 220,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: "#F2F3F7",
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 15,
      fontSize: 11,
      fontFamily: "Roboto_300Light",
      marginTop: 15,
      width: screenWidth * 0.83,
      backgroundColor: "#F2F3F7",
      color: "#A1A4B2",
      letterSpacing: 1,
      alignSelf: "center",
    },
    proceedButton: {
        borderRadius: 38,
        backgroundColor: "#096B72",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignSelf: "center",
        width: screenWidth * 0.83,
        alignItems: "center",
        marginBottom: 10,
        marginTop: 20,
    },
    proceed: {
        color: "white",
        fontFamily: "Roboto_500Medium",
        fontSize: 14,
    },
    fp: {
        fontFamily: "Roboto_500Medium",
        fontSize: 14,
        letterSpacing: 1, 
    },
    bottom: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 60,
        alignItems: "center",
        letterSpacing: 1,
    },
    bot: {
        color: "#A1A4B2",
        fontFamily: "Roboto_300Light",
        fontSize: 14,
    },
    signUp: {
        color: "#096B72",
        fontFamily: "Roboto_500Medium",
        fontSize: 14,
    },
    dropdown: {
      backgroundColor: "#F2F3F7",
      borderColor: "#F2F3F7",
      borderRadius: 10,
      minHeight: 48,
      marginTop: 15,
      paddingHorizontal: 15,
      paddingVertical: 15,
      width: screenWidth * 0.83,
      alignSelf: "center",
    },

    dropdownContainer: {
      backgroundColor: "#F2F3F7",
      borderColor: "#F2F3F7",
      width: screenWidth * 0.83,
      alignSelf: "center",
    },

    dropdownText: {
      fontSize: 11,
      fontFamily: "Roboto_300Light",
      color: "#000",
    },

    placeholder: {
      fontSize: 12,
      fontFamily: "Roboto_300",
      color: "#A1A4B2",
    },
});