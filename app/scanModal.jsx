import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import CustomizableModal from "../app/common/commonModal";

export default function ScanModal() {
  const router = useRouter();
  const { busId } = useLocalSearchParams(); 
  const [visible, setVisible] = useState(true);

  if (!busId) {
    Alert.alert("Error", "Bus ID missing");
    router.replace("/scan");
    return null;
  }

  const handleConfirm = () => {
    setVisible(false);
    setTimeout(() => {
      router.push({
        pathname: "/qr",
        params: { busId },
      });
    }, 10);
  };

  const closeAndGoHome = () => {
    setVisible(false);
    setTimeout(() => {
      router.push("/scan");
    }, 10);
  };

  return (
    <CustomizableModal
      visible={visible}
      onClose={closeAndGoHome}
      onCancel={closeAndGoHome}
      onConfirm={handleConfirm}
      title="Scan QR"
      message="Scan passenger QR to update the passenger count"
      confirmText="Confirm"
      cancelText="Cancel"
      icon={require("../assets/images/success.png")}
      primaryColor="#096B72"
    />
  );
}
 