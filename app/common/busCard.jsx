import { Pressable, StyleSheet, Text, View } from "react-native";

export default function BusCard({ bus, selected, onPress, disabled, reason }) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[
        styles.card,
        selected && styles.selectedCard,
        disabled && styles.disabledCard,
      ]}
    >
      <Text style={[styles.busName, disabled && styles.disabledText]}>
        {bus.bus_name}
      </Text>

      <Text style={[styles.meta, disabled && styles.disabledText]}>
        Vehicle: {bus.bus_number} • Plate: {bus.plate_number}
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

      {disabled && reason && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{reason}</Text>
        </View>
      )}
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
    borderColor: "#020eba",
  },
  disabledCard: {
    backgroundColor: "#E9EAEF",
    opacity: 0.7,
  },
  busName: {
    fontFamily: "Roboto_700Bold",
    fontSize: 16,
    marginBottom: 5,
  },
  disabledText: {
    color: "#A1A4B2",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#FBE3E3",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
  },
  badgeText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 10,
    color: "#C43A3A",
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
    color: "#020eba",
    marginRight: 5,
  },
  value: {
    fontFamily: "Roboto_300Bold",
    fontSize: 12,
  },
});
