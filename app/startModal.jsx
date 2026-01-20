import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { departBus, getAttendantPassengers } from "../api/buses";
import CustomizableModal from "../app/common/commonModal";
import { setTripState } from "../utils/authStorage";

export default function StartModal() {
  const router = useRouter();
  const { busId } = useLocalSearchParams();
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  // Dynamic passenger info
  const [capacity, setCapacity] = useState(0);
  const [seatTaken, setSeatTaken] = useState(0);
  const [fetchingSeats, setFetchingSeats] = useState(true);

  // Fetch current passengers and capacity
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAttendantPassengers();
        if (!result.success) {
          Alert.alert("Error", "Failed to fetch passenger information");
          return;
        }

        setCapacity(result.capacity);
        const boarded = result.passengers.filter(p => p.status === "boarded");
        setSeatTaken(boarded.length);
      } catch (err) {
        Alert.alert("Error", "Something went wrong");
      } finally {
        setFetchingSeats(false);
      }
    };

    fetchData();
  }, []);

  const handleConfirm = async () => {
    if (!busId) {
      alert("Bus ID not found");
      return;
    }
    setLoading(true);

    const result = await departBus(busId);

    if (result.success) {
      await setTripState("ongoing", "Finish Trip");
      setVisible(false);
      router.replace("/(tabs)/home");
    } else {
      alert(result.message);
    }

    setLoading(false);
  };

  const closeAndGoHome = () => {
    setVisible(false);
    router.replace("/(tabs)/home");
  };

  if (fetchingSeats) return null; 

  return (
    <CustomizableModal
      visible={visible}
      onClose={closeAndGoHome}
      onCancel={closeAndGoHome}
      onConfirm={handleConfirm}
      confirmDisabled={loading}
      title="Want to start your trip?"
      message={`Capacity is at ${seatTaken}/${capacity}\nDrive Safe!`}
      confirmText={loading ? "Starting..." : "Confirm"}
      cancelText="Cancel"
      icon={require('../assets/images/success.png')}
      primaryColor="#096B72"
    />
  );
}
