import { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Passenger = () => {
  const [activeTab, setActiveTab] = useState('queue');

  const passengerQueue = [
    { id: '#102896', status: 'Already here' },
    { id: '#01235', status: 'Already here' },
    { id: '#01344', status: 'Already here' },
    { id: '#01230', status: 'Already here' },
    { id: '#01345', status: '5 mins away' },
    { id: '#12789', status: '7 mins away' },
    { id: '#13453', status: '10 mins away' },
  ];

  const boardedPassengers = passengerQueue.slice(0, 4);

  const capacity = 45;
  const onboard = boardedPassengers.length;

  const renderPassenger = ({ item }) => {
    const isHere = item.status === 'Already here';

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
                ? require('../../assets/images/seat-passenger.png')
                : require('../../assets/images/seat-passenger-disable.png')
            }
            style={styles.iconImage}
            resizeMode="contain"
          />
        </View>

        <View>
          <Text style={styles.passengerId}>{item.id}</Text>
          <Text style={[styles.status, isHere && styles.statusHere]}>
            {item.status}
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
          style={[styles.tab, activeTab === 'queue' && styles.tabActive]}
          onPress={() => setActiveTab('queue')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'queue' && styles.tabTextActive,
            ]}
          >
            Passenger queue
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'boarded' && styles.tabActive]}
          onPress={() => setActiveTab('boarded')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'boarded' && styles.tabTextActive,
            ]}
          >
            Boarded passengers
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={activeTab === 'queue' ? passengerQueue : boardedPassengers}
        keyExtractor={(item) => item.id}
        renderItem={renderPassenger}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* Counter bubble */}
      <View style={styles.counterBubble}>
        <Text style={styles.counterTop}>
          {String(onboard).padStart(2, '0')}
        </Text>

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
    paddingTop: 10,
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
});
