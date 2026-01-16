import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from "react";
import { Alert } from "react-native";
import CustomizableModal from "../app/common/commonModal";

export default function ResultModal() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const { busId } = useLocalSearchParams(); 

  if (!busId) {
    Alert.alert("Error", "Bus ID missing");
    router.replace("/scan");
    return null;
  }

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
      onConfirm={closeAndGoHome}
      showCancel={false} 
      title="Passenger Added"
      message=" Seat Available: \n Seat Taken: \n Total Seats: "
      confirmText="Confirm"
      icon={require('../assets/images/success.png')}
      primaryColor="#096B72" 
    />
  );
}
 