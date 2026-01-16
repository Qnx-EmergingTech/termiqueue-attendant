import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { getAttendantPassengers } from "../api/buses";
import CustomizableModal from "../app/common/commonModal";

export default function ResultModal() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [capacity, setCapacity] = useState(0);
  const [seatTaken, setSeatTaken] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAttendantPassengers();

        if (!result.success) {
          Alert.alert("Error", "Failed to fetch passenger information");
          return;
        }

        const boarded = result.passengers.filter(
          p => p.status === "boarded"
        );

        setSeatTaken(boarded.length);
        setCapacity(result.capacity);
      } catch (err) {
        Alert.alert("Error", "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const closeAndGoHome = () => {
    setVisible(false);
    setTimeout(() => {
      router.replace("/scan");
    }, 10);
  };

  if (loading) return null;

  return (
    <CustomizableModal
      visible={visible}
      onClose={closeAndGoHome}
      onConfirm={closeAndGoHome}
      showCancel={false}
      title="Passenger Added"
      message={`Seat Available: ${capacity - seatTaken}\nSeat Taken: ${seatTaken}\nTotal Seats: ${capacity}`}
      confirmText="Confirm"
      primaryColor="#096B72"
    />
  );
}
