import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';

export default function CustomizableModal({
  visible = true,
  onClose,
  icon = require('../../assets/images/success.png'),
  title = "",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  primaryColor = "#096B72",
  showCancel = true,
  loading = false,
  cancelLoading = false,
}) {

        const renderMessage = (msg) => {
    if (!msg && msg !== "") return null;
    // normalize both real newlines and literal "\n" sequences
    const normalized = String(msg).replace(/\\n/g, "\n");
    return normalized.split(/\r?\n/).map((line, i) => (
        <Text key={i} style={styles.text}>
        {line}
        {i < normalized.split(/\r?\n/).length - 1 ? "\n" : null}
        </Text>
    ));
    };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.modalBox}>
                
                <Pressable style={styles.closeIcon} onPress={onClose}>
                  <Ionicons name="close" size={24} color="#333" />
                </Pressable>

                <Image source={icon} style={styles.icon} />

                <Text style={styles.title}>{title}</Text>

                {message ? (
                    <View style={{ alignSelf: "stretch" }}>
                        {renderMessage(message)}
                    </View>
                    ) : null}

                <Pressable
                  style={[styles.button, { backgroundColor: primaryColor }, loading && { opacity: 0.7 }]}
                  onPress={onConfirm}
                  disabled={loading || cancelLoading}

                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.cbutton}>{confirmText}</Text>
                  )}
                </Pressable>

                {onCancel && (
                  <Pressable
                    style={[
                      styles.cancelButton,
                      { borderColor: primaryColor },
                      cancelLoading && { opacity: 0.7 },
                    ]}
                    onPress={onCancel}
                    disabled={loading || cancelLoading}

                  >
                    {cancelLoading ? (
                      <ActivityIndicator color={primaryColor} />
                    ) : (
                      <Text style={[styles.cancelText, { color: primaryColor }]}>
                        {cancelText}
                      </Text>
                    )}
                  </Pressable>
                )}

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
    fontSize: 20,
    fontFamily: "Roboto_700Bold",
  },

  text: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#4B5563",
  },

  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 5,
  },
  cbutton: {
    fontFamily: "Inter_600SemiBold",
    color: "white",
  },

  cancelButton: {
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },

  icon: {
    width: 48,
    height: 48,
  }
});
