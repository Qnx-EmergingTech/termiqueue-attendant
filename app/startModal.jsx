import { useState } from "react";
import CustomizableModal from "../app/common/commonModal";

export default function startModal() {
  const [visible, setVisible] = useState(true);

  return (
    <CustomizableModal
      visible={visible}
      onClose={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      onConfirm={() => console.log("Confirmed!")}

      title="Want to start your trip?"
      message="Capacity is at 45/45 (Full) \nDrive Safe!"
      confirmText="Confirm"
      cancelText="Cancel"
      icon={require('../assets/images/success.png')}
      primaryColor="#096B72" 
    />
  );
}
