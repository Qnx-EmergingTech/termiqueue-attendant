import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import CustomizableModal from "../app/common/commonModal";

export default function AddPassengerModal() {
  const router = useRouter();
  const { busId } = useLocalSearchParams(); 
  const [visible, setVisible] = useState(true);

  if (!busId) {
    Alert.alert("Error", "Bus ID missing");
    router.replace("/home");
    return null;
  }

  const handleConfirm = () => {
    setVisible(false);
    setTimeout(() => {
      router.push({
        pathname: "/scanModal",
        params: { busId },
      });
    }, 10);
  };

  const closeAndGoHome = () => {
    setVisible(false);
    setTimeout(() => {
      router.push({
        pathname: "/scan",
        params: { busId },
      });
    }, 10);
  };

  const handleNext = () => {
    setVisible(false);
    setTimeout(() => {
      router.push({
        pathname: "/walkinModal",
        params: { busId },
      });
    }, 10);
  };

  return (
    <CustomizableModal
      visible={visible}
      onClose={closeAndGoHome}
      onCancel={handleNext}
      onConfirm={handleConfirm}
      title="Add Passenger"
      message="Please select if the passenger is from the QNEXT App or Walk In"
      confirmText="Scan"
      cancelText="Walk In"
      icon={require("../assets/images/success.png")}
      primaryColor="#096B72"
    />
  );
}
 