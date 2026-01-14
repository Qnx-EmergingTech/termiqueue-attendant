import { Link, Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { createProfile } from '../api/profile';
import { getToken, setUser } from "../utils/authStorage";


export default function Kyc() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [token, setTokenState] = useState(null);

  useEffect(() => {
    (async () => {
      const idToken = await getToken();
      if (!idToken) {
        setError("User not authenticated. Please login again.");
        return;
      }
      setTokenState(idToken);
    })();
  }, []);

const handleProceed = async () => {
  setError("");

  if (!firstName.trim() || !lastName.trim()) {
    setError("All required fields (First name, Last name) must be filled.");
    return;
  }
  if (!token) {
    setError("Authentication token not found. Please log in again.");
    return;
  }
  try {
    const result = await createProfile({
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
    });

    if (result.success) {
    await setUser({
        uid: result.uid, 
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
      });
      router.replace("/route");
    } else {
      setError(`Failed to create profile: ${result.message}`);
    }
  } catch (err) {
    if (err.message.includes("Network")) {
      setError("Network error: Please check your internet connection.");
    } else if (err.message.includes("User not authenticated")) {
      setError("Authentication error: Your session has expired. Please log in again.");
    } else {
      setError(`Unexpected error: ${err.message}`);
    }
  }
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
          <Text style={styles.heading}>Create your profile</Text>

          <View style={styles.mid}>
            <TextInput 
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
            />
            <TextInput 
              placeholder="Middle name (optional)"
              value={middleName}
              onChangeText={setMiddleName}
              style={styles.input}
            />
            <TextInput 
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
            />
            {error ? <Text style={{ color: 'red', marginTop: 5 }}>{error}</Text> : null}

            <Pressable style={styles.proceedButton} onPress={handleProceed}>
              <Text style={styles.proceed}>PROCEED</Text>
            </Pressable>
          </View>

          <View style={styles.bottom}>
            <Text style={styles.bot}>ALREADY HAVE AN ACCOUNT? </Text>
            <Link href="/login" style={styles.signUp}>LOG IN</Link>
          </View>
        </View>
      </View>
    </>
  );
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
       left: '8%',                 
       justifyContent: "center",
       alignItems: "center",
       width: screenWidth * 0.85,
        fontFamily: "Roboto_700Bold",
        fontSize: 28,
        textAlign: "center",
        marginTop: 1,
    },
    mid: {
        flex: 1, 
        marginTop: 100,
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
});