import { Stack, useRouter } from "expo-router";
import { signOutAccount } from "../app/_api/auth";
import CustomizableModal from "../app/common/commonModal";

export default function LogoutModal({ visible, onClose }) {
  const router = useRouter();

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => router.replace("/home"), 150);
  };

  const handleConfirm = async () => {
    const result = await signOutAccount();
    if (result.success) {
      onClose();
      router.replace("/login");
    } else {
      console.log("Logout error:", result.message);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <CustomizableModal
        visible={visible}
        onClose={onClose}
        onBackdropPress={onClose}
        onConfirm={handleConfirm}
        onCancel={handleCancel}

        icon={require("../assets/images/alert.png")}
        title="Are you sure you want to logout?"
        
        confirmText="Confirm"
        cancelText="Cancel"
        primaryColor="#096B72"
      />
    </>
  );
}
