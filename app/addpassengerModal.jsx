import { useRouter } from 'expo-router';
import { useState } from "react";
import CustomizableModal from "../app/common/commonModal";

export default function AddPassengerModal() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);


    const handleConfirm = async () => {
    setVisible(false);
    setTimeout(() => {
      router.push("/scanModal");
    }, 10);
  };

    const closeAndGoHome = () => {
    setVisible(false);
    setTimeout(() => {
      router.push("/scan");
    }, 10);
  };

    const handleNext = () => {
    setVisible(false);
    setTimeout(() => {
      router.push("/walkinModal");
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
      icon={require('../assets/images/success.png')}
      primaryColor="#096B72" 
    />
  );
}
