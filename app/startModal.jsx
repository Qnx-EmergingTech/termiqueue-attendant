import { useRouter } from 'expo-router';
import { useState } from "react";
import CustomizableModal from "../app/common/commonModal";
import { setTripState } from "../utils/authStorage";

export default function startModal() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  const handleConfirm = async () => {
    await setTripState("ongoing", "Finish Trip");
    setVisible(false);
    router.replace("/(tabs)/home");
  };

    const closeAndGoHome = () => {
    setVisible(false);
    router.replace('/(tabs)/home');    
  };



  return (
    <CustomizableModal
      visible={visible}
      onClose={closeAndGoHome}
      onCancel={closeAndGoHome}
      onConfirm={handleConfirm}

      title="Want to start your trip?"
      message="Capacity is at 45/45 (Full) \nDrive Safe!"
      confirmText="Confirm"
      cancelText="Cancel"
      icon={require('../assets/images/success.png')}
      primaryColor="#096B72" 
    />
  );
}
