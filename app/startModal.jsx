import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from "react";
import { departBus } from "../api/buses";
import CustomizableModal from "../app/common/commonModal";
import { setTripState } from "../utils/authStorage";

export default function startModal() {
  const router = useRouter();
  const { busId } = useLocalSearchParams();
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!busId) {
      alert("Bus ID not found");
      return;
    }
    setLoading(true);
    const result = await departBus(busId);

    if (result.success) {
      console.log("Bus departed");

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

  return (
    <CustomizableModal
      visible={visible}
      onClose={closeAndGoHome}
      onCancel={closeAndGoHome}
      onConfirm={handleConfirm}
      confirmDisabled={loading}

      title="Want to start your trip?"
      message="Capacity is at 45/45 (Full)\nDrive Safe!"
      confirmText={loading ? "Starting..." : "Confirm"}
      cancelText="Cancel"
      icon={require('../assets/images/success.png')}
      primaryColor="#096B72"
    />
  );
}
