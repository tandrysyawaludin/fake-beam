import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from '../components/Themed';
import dateFormatter from '../helpers/dateFormatter';
import Colors from '../constants/Colors';

export default function TabTripsScreen() {
  const [tripsData, setTripsData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTripsData();
  }, []);

  useEffect(() => {
    fetchTripsData();
  }, []);

  const fetchTripsData = () => {
    fetch('https://fake-beam-api.herokuapp.com/trips')
      .then((response) => response.json())
      .then((json) => setTripsData(json))
      .catch(() => {
        Alert.alert(
          'Fetch Vehicle is Failed',
          'Please click Refetch',
          [
            { text: "Refetch", onPress: () => fetchTripsData() }
          ]
        );
      })
      .finally(() => {
        setRefreshing(false)
      })
  }

  return (
    <ScrollView refreshControl={<RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
    />}>
      {tripsData.map((data, index) => (
        <View
          key={index}
          style={{
            ...styles.tripsDetailBox,
            borderTopWidth: index === 0 ? 1 : 0
          }}>
          <MaterialIcons
            name='electric-scooter'
            size={50}
            color={Colors.light.icon}
          />
          <View style={styles.tripsDetail}>
            <Text style={styles.vehicleDetailSerialCode}>
              {`${data.type} • ${data.vehicleId}`}
            </Text>
            <Text style={styles.vehicleDetailSecondText}>
              {`${dateFormatter(data.tripDate)} • ${data.tripDuration} min • ${data.region}`}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  tripsDetailBox: {
    borderBottomWidth: 1,
    borderColor: Colors.light.borderColor,
    padding: 10,
    flexDirection: 'row',
  },
  tripsDetail: {
    marginLeft: 10
  },
  vehicleDetailSerialCode: {
    fontSize: 20,
  },
  vehicleDetailSecondText: {
    fontSize: 12,
    color: Colors.light.secondaryText,
  }
});
