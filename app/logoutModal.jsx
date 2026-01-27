import { Stack, useRouter } from "expo-router";
import { signOutAccount } from "../api/auth";
import CustomizableModal from "../app/common/commonModal";

export default function LogoutModal({ visible, onClose }) {
  const router = useRouter();

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
