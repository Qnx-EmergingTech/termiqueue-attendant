import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getAttendantPassengers } from "../../api/buses";

const Passenger = () => {
  const [activeTab, setActiveTab] = useState("queue");
  const [passengers, setPassengers] = useState([]);
  const [capacity, setCapacity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
      fetchPassengers();
    }, []);

const fetchPassengers = async () => {
  try {
    setLoading(true);
    const result = await getAttendantPassengers();

    setPassengers(result.passengers);
    setCapacity(result.capacity);
  } catch (error) {
    console.error("Failed to fetch passengers:", error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};



  const queuePassengers = passengers;
  const boardedPassengers = passengers.filter(p => p.status === "boarded");

  const onboard = boardedPassengers.length;

  const renderPassenger = ({ item }) => {
    const isHere = item.status === "boarded";

    return (
      <View style={styles.passengerRow}>
        <View
          style={[
            styles.iconCircle,
            !isHere && styles.iconCircleDisabled,
          ]}
        >
          <Image
            source={
              isHere
                ? require("../../assets/images/seat-passenger.png")
                : require("../../assets/images/seat-passenger-disable.png")
            }
            style={styles.iconImage}
            resizeMode="contain"
          />
        </View>

        <View>
          <Text style={styles.passengerId}>{item.id}</Text>
          <Text style={[styles.status, isHere && styles.statusHere]}>
            {isHere ? "Already here" : "Not yet boarded"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Passenger List</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "queue" && styles.tabActive]}
          onPress={() => setActiveTab("queue")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "queue" && styles.tabTextActive,
            ]}
          >
            Passenger queue
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "boarded" && styles.tabActive]}
          onPress={() => setActiveTab("boarded")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "boarded" && styles.tabTextActive,
            ]}
          >
            Boarded passengers
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
        <FlatList
          data={activeTab === "queue" ? queuePassengers : boardedPassengers}
          keyExtractor={(item) => item.id}
          renderItem={renderPassenger}
          contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}

          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchPassengers();
          }}

          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {refreshing ? "Refreshing..." : loading ? "Loading passengers..." : "No Passengers at This Time"}
              </Text>
            </View>
          }
        />

      {/* Counter bubble */}
      <View style={styles.counterBubble}>
        <Text style={styles.counterTop}>{String(onboard).padStart(2, "0")}</Text>

        <View style={styles.diagonalLine} />

        <Text style={styles.counterBottom}>{capacity}</Text>
      </View>
    </View>
  );
};

export default Passenger;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },

  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  tabActive: {
    borderBottomColor: '#096B72',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  tabTextActive: {
    color: '#096B72',
    fontWeight: '600',
  },

  passengerRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#096B72',
    borderWidth: 2,
    borderColor: '#096B72',
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleDisabled: {
    borderColor: '#8C8C8C',
    backgroundColor: '#ffffff',
  },

  iconImage: {
    width: 20,
    height: 20,
  },

  passengerId: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },

  status: {
    fontSize: 11,
    color: '#8C8C8C',
  },

  statusHere: {
    color: '#59A96A',
  },

  counterBubble: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#096B72',
    alignItems: 'center',
    justifyContent: 'center',
  },

  counterTop: {
    position: 'absolute',
    top: 11,
    left: 12,
    fontSize: 24,
    fontWeight: '700',
    color: '#096B72',
  },

  counterBottom: {
    position: 'absolute',
    bottom: 11,
    right: 12,
    fontSize: 24,
    fontWeight: '700',
    color: '#096B72',
  },

  diagonalLine: {
    position: 'absolute',
    width: 3,
    height: 50,
    backgroundColor: '#096B72',
    transform: [{ rotate: '45deg' }],
  },
  emptyContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#8C8C8C",
    fontWeight: "500",
  },

});
