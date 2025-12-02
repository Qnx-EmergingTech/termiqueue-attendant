import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCodes, setScannedCodes] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) return null;

  if (!permission.granted) {
    return <View><Text>Camera permission required.</Text></View>;
  }

  const handleBarcodeScanned = ({ data }) => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (scannedCodes.includes(data)) {
      Alert.alert("Already Scanned", "This QR code was already scanned.", [
        { text: "OK", onPress: () => setIsProcessing(false) },
      ]);
      return;
    }

    setScannedCodes((prev) => [...prev, data]);
    Alert.alert("Success!", "QR code scanned successfully.", [
      { text: "OK", onPress: () => setIsProcessing(false) },
    ]);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      {/* Overlay with corner borders */}
      <View style={styles.overlay}>
        <View style={styles.scanBox}>
          {/* 4 Corner Borders */}
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
