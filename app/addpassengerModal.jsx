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

      title="Add Passenger"
      message="Please select if the passenger is from the QNEXT App or Walk In"
      confirmText="Scan"
      cancelText="Walk In"
      icon={require('../assets/images/success.png')}
      primaryColor="#096B72" 
    />
  );
}
