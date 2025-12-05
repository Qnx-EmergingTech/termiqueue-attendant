import { useRouter } from 'expo-router';
import { useState } from "react";
import CustomizableModal from "../app/common/commonModal";

export default function WalkInModal() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);


    const handleConfirm = async () => {
    setVisible(false);
    setTimeout(() => {
      router.push("/qr");
    }, 10);
  };

// same logic for Regular, but soon will adjust for Elderly/PWD?
    const handleNext = () => {
    setVisible(false);
    setTimeout(() => {
      router.push("/qr");
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
      onCancel={handleNext}
      onConfirm={handleConfirm}

      title="What type of walk in passenger?"
      //message="Scan passenger QR to update the passenger count"
      confirmText="Regular"
      cancelText="Elderly/PWD"
      icon={require('../assets/images/success.png')}
      primaryColor="#096B72" 
    />
  );
}
