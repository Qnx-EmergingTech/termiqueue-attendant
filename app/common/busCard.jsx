import { Pressable, StyleSheet, Text, View } from "react-native";

export default function BusCard({ bus, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        selected && styles.selectedCard,
      ]}
    >
      <Text style={styles.busName}>{bus.bus_name}</Text>

      <Text style={styles.meta}>
        Bus No: {bus.bus_number} • Plate: {bus.plate_number}
      </Text>

      <View style={styles.row}>
        <Text style={styles.label}>Capacity:</Text>
        <Text style={styles.value}>{bus.capacity}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Route:</Text>
        <Text style={styles.value}>
          {bus.origin} → {bus.destination}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F2F3F7",
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    borderWidth: 2,
    borderColor: "#F2F3F7",
    width: "100%",
  },
  selectedCard: {
    borderColor: "#096B72",
  },
  busName: {
    fontFamily: "Roboto_700Bold",
    fontSize: 16,
    marginBottom: 5,
  },
  meta: {
    fontFamily: "Roboto_300Bold",
    fontSize: 12,
    color: "#A1A4B2",
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  label: {
    fontFamily: "Roboto_500Medium",
    fontSize: 12,
    color: "#096B72",
    marginRight: 5,
  },
  value: {
    fontFamily: "Roboto_300Bold",
    fontSize: 12,
  },
});
