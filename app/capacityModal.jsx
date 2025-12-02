import { useRouter } from 'expo-router';
import { useState } from "react";
import CustomizableModal from "../app/common/commonModal";

export default function addpassengerModal() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);


    const handleConfirm = async () => {
    setVisible(false);
  };

    const closeAndGoHome = () => {
    setVisible(false);
  };

  return (
    <CustomizableModal
      visible={visible}
      onClose={closeAndGoHome}
      onCancel={closeAndGoHome}
      onConfirm={handleConfirm}

      title="Capacity Full"
      message="Seems like you're fully boarded, you can now start your route!"
      confirmText="Confirm"
      cancelText="Cancel"
      icon={require('../assets/images/success.png')}
      primaryColor="#096B72" 
    />
  );
}
