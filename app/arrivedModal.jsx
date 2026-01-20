import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { arriveBus } from "../api/buses";
import { setTripState } from "../utils/authStorage";

export default function arrivedModal() {
  const router = useRouter();
  const { busId } = useLocalSearchParams();
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const closeAndGoHome = () => {
    setVisible(false);
    router.replace('/(tabs)/home');    
  };

    const handleConfirm = async () => {
      if (loading) return;

      try {
        setLoading(true);
        await arriveBus(busId);

        await setTripState("arrived", "Start Your Trip");
        router.replace("/(tabs)/home");

      } catch (err) {
        console.error("Arrive bus error:", err);
        alert("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeAndGoHome}
    >
      <TouchableWithoutFeedback onPress={closeAndGoHome}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalBox}>
              <Pressable style={styles.closeIcon} onPress={closeAndGoHome}>
                <Ionicons name="close" size={24} color="#333" />
              </Pressable>
              <Image
                source={require('../assets/images/success.png')}
                style={styles.icon}
              />
              <Text style={styles.title}>Want to set your status to "has Arrived"?</Text>
              <Text style={styles.text}>
                Setting your status to “has arrive” will let people on queue know that you are already and waiting for them to board
              </Text>
            <Pressable
              style={[
                styles.button,
                loading && { opacity: 0.6 },
              ]}
              onPress={handleConfirm}
              disabled={loading}
            >
              <Text style={styles.cbutton}>
                {loading ? "Updating..." : "Confirm"}
              </Text>
            </Pressable>
              <Pressable style={styles.cancelButton} onPress={closeAndGoHome}>
                <Text style={styles.cancel}>Cancel</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000033',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'left',
    gap: 12,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontFamily: "Roboto_500Medium",
    marginBottom: 10,
  },
  text: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
  },
  cbutton:{
    fontFamily: "Roboto_500Medium",
    color: "white",
  },
  cancel:{
    fontFamily: "Roboto_500Medium",
    color: "#096B72",
  },
  button: {
    backgroundColor: "#096B72",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 5,
    borderColor: "#096B72",
    borderWidth: 1, 
  },
  icon: {
    width: 48,
    height: 48,
  }
});
