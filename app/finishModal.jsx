import { useRouter } from 'expo-router';
import { useState } from "react";
import CustomizableModal from "../app/common/commonModal";
import { setTripState } from "../app/utils/authStorage";

export default function finishModal() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);


    const handleConfirm = async () => {
    await setTripState("idle", "Set Active Status");
    setVisible(false);
    router.replace("/home");
  };

  return (
    <CustomizableModal
      visible={visible}
      onClose={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      onConfirm={handleConfirm}

      title="Want to finish your trip?"
      confirmText="Confirm"
      cancelText="Cancel"
      icon={require('../assets/images/success.png')}
      primaryColor="#096B72" 
    />
  );
}
