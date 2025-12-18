import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { scanQr } from "../api/buses";

export default function Qr() {
  const router = useRouter();
  const { busId } = useLocalSearchParams();

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

    const result = await scanQr(busId.toString(), data);

    if (result.success) {
      Alert.alert("Success", "Passenger scanned", [
        {
          text: "OK",
          onPress: () => {
            setIsProcessing(false);
            router.replace("/passengers");
          },
        },
      ]);
    } else {
      Alert.alert("Error", result.message, [
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
const BORDER_SIZE = 40;
const BORDER_WIDTH = 4;

const styles = StyleSheet.create({
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
 