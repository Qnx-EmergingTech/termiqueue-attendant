import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from "react";
import { Alert } from "react-native";
import { addWalkInPassenger } from "../api/buses";
import CustomizableModal from "../app/common/commonModal";

export default function WalkInModal() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const { busId } = useLocalSearchParams();

  if (!busId) {
    Alert.alert("Error", "Bus ID missing");
    router.replace("/scan");
    return null;
  }

  const handleAddWalkIn = async () => {
    if (loading) return;

    setLoading(true);

    const result = await addWalkInPassenger(busId);

    setLoading(false);

    if (!result.success) {
      Alert.alert("Error", result.message);
      return;
    }

    setVisible(false);
    setTimeout(() => {
      router.push({
        pathname: "/resultModal",
        params: {
          busId,
          ticketNumber: result.passenger.ticket_number,
        },
      });
    }, 10);
  };

    const handleElderly = async () => {
    if (cancelLoading) return;

    setCancelLoading(true);

    const result = await addWalkInPassenger(busId);

    setCancelLoading(false);

    if (!result.success) {
      Alert.alert("Error", result.message);
      return;
    }

    setVisible(false);
    setTimeout(() => {
      router.push({
        pathname: "/resultModal",
        params: {
          busId,
          ticketNumber: result.passenger.ticket_number,
        },
      });
    }, 10);
  };

  const closeAndGoHome = () => {
    if (loading) return;
    setVisible(false);
    setTimeout(() => {
      router.push({pathname: "/addpassengerModal", params: {busId} });
    }, 10);
  };

  return (
    <CustomizableModal
      visible={visible}
      onClose={closeAndGoHome}
      onConfirm={handleAddWalkIn}
      onCancel={handleElderly} // same logic for now
      loading={loading}
      cancelLoading={cancelLoading}

      title="What type of walk in passenger?"
      message="Add a walk-in passenger to the bus queue"
      confirmText="Regular"
      cancelText="Elderly/PWD"
      icon={require('../assets/images/success.png')}
      primaryColor="#096B72"
    />
  );
}
