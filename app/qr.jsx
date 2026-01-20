import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { scanQr } from "../api/buses";


export default function Qr() {
  const router = useRouter();
  const { busId } = useLocalSearchParams();
  const [remainingSeats, setRemainingSeats] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();;
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  if (!busId) {
    return (
      <View style={styles.center}>
        <Text>Error: Bus ID missing</Text>
      </View>
    );
  }

const handleScan = async ({ data }) => {
  if (isProcessing) return;

  setIsProcessing(true);

  try {
    const result = await scanQr(busId.toString(), data);

    if (result.success) {
      // Optionally update remaining seats for UX
      if (typeof result.remaining_seats === "number") {
        setRemainingSeats(result.remaining_seats);
      }

      Alert.alert("Success", "Passenger scanned", [
        { text: "OK", onPress: () => setIsProcessing(false) },
      ]);
    } else {
      // Handle full bus
      if (result.code === "BUS_FULL") {
        Alert.alert("Bus Full", "This bus has reached its maximum capacity.", [
          { text: "Go Back", onPress: () => router.replace("/scan") },
        ]);
      } else {
        Alert.alert("Error", result.message, [
          { text: "OK", onPress: () => setIsProcessing(false) },
        ]);
      }
    }
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Something went wrong", [
      { text: "OK", onPress: () => setIsProcessing(false) },
    ]);
  }
};


  if (!permission?.granted) {
    return <Text>Camera permission required</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleScan}
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.replace("/scan")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>Scan Passenger&apos;s QR</Text>
      </View>

      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={styles.scanBox}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>
    </View>
  );
}

const BORDER_COLOR = "white";
const BORDER_SIZE = 30;
const BORDER_WIDTH = 4;

const styles = StyleSheet.create({
    header: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 56,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 12,
    zIndex: 10,
  },

  backButton: {
    marginRight: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanBox: {
    width: 300,
    height: 600,
    justifyContent: "center",
    alignItems: "center",
  },
  corner: {
    position: "absolute",
    width: BORDER_SIZE,
    height: BORDER_SIZE,
    borderColor: BORDER_COLOR,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderLeftWidth: BORDER_WIDTH,
    borderTopWidth: BORDER_WIDTH,
  },
  topRight: {
    top: 0,
    right: 0,
    borderRightWidth: BORDER_WIDTH,
    borderTopWidth: BORDER_WIDTH,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderLeftWidth: BORDER_WIDTH,
    borderBottomWidth: BORDER_WIDTH,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderRightWidth: BORDER_WIDTH,
    borderBottomWidth: BORDER_WIDTH,
  },
});
 