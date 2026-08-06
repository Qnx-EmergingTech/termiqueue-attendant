import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { finishTrip } from "../api/buses";
import CustomizableModal from "../app/common/commonModal";
import { clearCachedBus } from "./(tabs)/home";
import { setLastArrivalTime, setTripState } from "../utils/authStorage";

export default function finishModal() {
  const router = useRouter();
  const { busId } = useLocalSearchParams();
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const result = await finishTrip(busId);
      if (!result.success) {
        console.error(result.message);
        return;
      }
      if (result.bus?.updated_at) {
        await setLastArrivalTime(result.bus.updated_at);
      }
      await setTripState("idle", "Set Active Status");
      clearCachedBus();

      setVisible(false);
      Alert.alert(
        "Trip Complete!",
        "Your trip has been finished. Would you like to claim a new shuttle?",
        [
          { text: "Not Now", style: "cancel", onPress: () => router.replace("/(tabs)/home") },
          { text: "Claim a Shuttle", onPress: () => router.replace("/route") },
        ]
      );
    } catch (err) {
      console.error("Finish trip error:", err);
    } finally {
      setLoading(false);
    }
  };
  const closeAndGoHome = () => {
    if (loading) return;
    setVisible(false);
    router.replace("/(tabs)/home");
  };

  return (
    <CustomizableModal
      visible={visible}
      onClose={closeAndGoHome}
      onCancel={closeAndGoHome}
      onConfirm={handleConfirm}
      confirmText="Confirm"
      cancelText="Cancel"
      title="Want to finish your trip?"
      icon={require("../assets/images/success.png")}
      primaryColor="#020eba"
      loading={loading}
    />
  );
}
