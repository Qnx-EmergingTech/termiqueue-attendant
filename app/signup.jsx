import Checkbox from "expo-checkbox";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { signUp } from "../api/auth";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  const handleProceed = async () => {
    if (loading) return;
    setError("");

    if (!username.trim()) return setError("Username is required.");
    if (!email.trim()) return setError("Email is required.");
    if (!password || !confirmPassword) return setError("Password is required.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");
    if (!accepted) return setError("Please accept the privacy policy.");

    try {
      setLoading(true);

      const result = await signUp(email, password, username);

      if (result.success) {
        router.replace("/kyc");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/Blob.png")}
            style={styles.image}
          />
          <Text style={styles.heading}>Create your account</Text>

          <View style={styles.mid}>
            <TextInput
              placeholder="Username"
              placeholderTextColor="#A1A4B2"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#A1A4B2"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#A1A4B2"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
              style={styles.input}
            />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#A1A4B2"
              value={confirmPassword}
              secureTextEntry
              onChangeText={setConfirmPassword}
              style={styles.input}
            />

            {error ? (
              <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
            ) : null}

            <View style={styles.privacy}>
              <Text style={styles.read}>I have read the </Text>
              <Pressable onPress={() => setShowPolicy(true)}>
                <Text style={styles.policy}>Privacy Policy</Text>
              </Pressable>
              <Checkbox
                value={accepted}
                onValueChange={setAccepted}
                color={accepted ? "#020EBA" : undefined}
                style={styles.box}
              />
            </View>

            <Pressable
              style={[styles.loginButton, loading && { opacity: 0.7 }]}
              onPress={handleProceed}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.login}>PROCEED</Text>
              )}
            </Pressable>
          </View>
        </View>
        <Modal visible={showPolicy} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Privacy Policy</Text>

              <ScrollView>
                <Text style={styles.modalText}>
                  Privacy Policy
                  {"\n\n"}QNext Attendant is committed to protecting user data
                  and ensuring that all information handled within the
                  application is used responsibly and securely.
                  {"\n\n"}1. Information We Collect
                  {"\n"}The application may collect and process the following
                  information:
                  {"\n"}• Username and account credentials
                  {"\n"}• Passenger names and related trip details
                  {"\n"}• Vehicle status updates (e.g., active, arrived, ready
                  to board, will board)
                  {"\n"}• Queue and trip activity data
                  {"\n\n"}2. Purpose of Data Usage
                  {"\n"}The collected information is used strictly to:
                  {"\n"}• Manage and monitor vehicle status in real time
                  {"\n"}• Organize passenger queues and boarding flow
                  {"\n"}• Display passenger lists and trip assignments
                  {"\n"}• Ensure accurate tracking of trips from origin to
                  destination
                  {"\n\n"}3. Data Handling and Security
                  {"\n"}All data is handled securely and is only accessible to
                  authorized personnel or users of the system. We take
                  reasonable measures to protect information from unauthorized
                  access, disclosure, or misuse.
                  {"\n\n"}4. Data Sharing
                  {"\n"}QNext Attendant does not sell, trade, or share personal
                  data with third parties. Information is only used within the
                  system to support operational functionality.
                  {"\n\n"}5. User Responsibilities
                  {"\n"}Users are responsible for ensuring that the information
                  they input, including passenger details and vehicle updates,
                  is accurate and used appropriately within the system.
                  {"\n\n"}6. System Usage
                  {"\n"}The application is intended solely for managing
                  transport operations, including updating vehicle status,
                  adding passengers, and handling queues. Any misuse of the
                  system may result in restricted access.
                  {"\n\n"}7. Updates to This Policy
                  {"\n"}This Privacy Policy may be updated from time to time.
                  Continued use of the application indicates acceptance of any
                  changes.
                  {"\n\n"}By using QNext Attendant, you agree to the terms
                  outlined in this Privacy Policy.
                </Text>
              </ScrollView>

              <Pressable
                style={styles.closeButton}
                onPress={() => setShowPolicy(false)}
              >
                <Text style={{ color: "white" }}>CLOSE</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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
  imageContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.45,
    width: "100%",
  },
  heading: {
    position: "absolute",
    top: screenHeight * 0.2,
    left: "9%",
    justifyContent: "center",
    alignItems: "center",
    width: screenWidth * 0.85,
    fontFamily: "Roboto_700Bold",
    fontSize: 28,
    textAlign: "center",
    marginTop: 30,
  },
  mid: {
    flex: 1,
    marginTop: 70,
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
  privacy: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginLeft: 15,
    marginTop: 20,
    alignItems: "center",
  },
  policy: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    color: "#7583CA",
  },
  box: {
    marginLeft: 90,
  },
  read: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    color: "#A1A4B2",
  },
  loginButton: {
    borderRadius: 38,
    backgroundColor: "#020eba",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "center",
    width: screenWidth * 0.83,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  login: {
    color: "white",
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontFamily: "Roboto_700Bold",
    marginBottom: 10,
    textAlign: "center",
  },

  modalText: {
    fontSize: 14,
    fontFamily: "Roboto_300Light",
    color: "#333",
  },

  closeButton: {
    marginTop: 15,
    backgroundColor: "#020eba",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
});
