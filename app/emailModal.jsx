import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';


export default function emailModal() {
  const router = useRouter();
  //const [visible, setVisible] = useState(true);

  const closeAndGoHome = () => {
    //setVisible(false);
    setTimeout(() => router.replace('/(tabs)/home'), 150);
  };

  const handleConfirm = () => {
    //setVisible(false);           
    router.replace('/(tabs)/home');          
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
    <Modal
      //visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeAndGoHome}
    >
      <TouchableWithoutFeedback onPress={closeAndGoHome}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalBox}>
              <Pressable style={styles.closeIcon} onPress={closeAndGoHome}>
                <Ionicons name="close" size={24} color="#333" />
              </Pressable>
              <Image
                source={require('../assets/images/success.png')}
                style={styles.icon}
              />
              <Text style={styles.title}>Email verification sent!</Text>
              <Text style={styles.text}>
                Please check your email and verify your account.
              </Text>

              <Pressable style={styles.button} onPress={handleConfirm}>
                <Text style={styles.cbutton}>Confirm</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000033',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'left',
    gap: 12,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 10,
  },
  text: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  cbutton:{
    fontFamily: "Inter_600SemiBold",
    color: "white",
  },
  button: {
    backgroundColor: "#096B72",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  icon: {
    width: 48,
    height: 48,
  }
});
