import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Alert, RefreshControl, Pressable, Linking } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { Text, View } from '../components/Themed';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import dateFormatter from '../helpers/dateFormatter';
import Colors from '../constants/Colors';
import { TripDataInterface, tripDataShape } from '../constants/DataShape';
import { titleCase } from '../helpers/textFormatter';

export default function TabTripsScreen() {
  const [tripsData, setTripsData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState<boolean | undefined>(false);
  const [modalData, setModalData] = useState<TripDataInterface>(tripDataShape);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTripsData();
  }, []);

  useEffect(() => {
    fetchTripsData();
  }, []);

  const fetchTripsData = () => {
    setIsLoading(true);
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
        setRefreshing(false);
        setIsLoading(false);
      })
  }

  return (
    !isLoading ?
      <ScrollView refreshControl={<RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />}>
        {tripsData.map((data: any, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setModalData(data);
              setModalVisible(true);
            }}>
            <View style={{
              ...styles.tripsDetailBox,
              borderTopWidth: index === 0 ? 1 : 0
            }}>
              <MaterialIcons
                name='electric-scooter'
                size={50}
                color={Colors.light.icon}
              />
              <View style={styles.tripsDetail}>
                <Text style={styles.title}>
                  {`${titleCase(data.type)} • ${data.vehicleId}`}
                </Text>
                <Text style={styles.vehicleDetailSecondText}>
                  {`${dateFormatter(data.date)} • ${data.duration} min • ${data.region}`}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}

        <Modal modalVisible={modalVisible} setModalVisible={setModalVisible}>
          <View style={styles.vehicleDetailOne}>
            <MaterialIcons
              name='electric-scooter'
              size={50}
              color={Colors.light.icon}
            />
            <View style={styles.vehicleDetailOneA}>
              <Text style={styles.title}>
                {modalData.type}
              </Text>
              <Text style={styles.vehicleDetailSecondText}>
                {modalData.vehicleId}
              </Text>
            </View>
          </View>

          <View style={styles.vehicleDetailTwo}>
            <MaterialCommunityIcons
              name='map-marker'
              size={30}
              color={Colors.light.text}
            />
            <View style={styles.vehicleDetailTwoA}>
              <Text style={styles.vehicleDetailDistance}>
                {titleCase(modalData.region)}
              </Text>
            </View>
          </View>

          <View style={styles.vehicleDetailThree}>
            <MaterialIcons
              name='account-balance-wallet'
              size={25}
              color={Colors.light.text}
            />
            <View style={styles.vehicleDetailTwoA}>
              <Text style={styles.vehicleDetailDistance}>
                {`${modalData.charge} ${modalData.unit}`}
              </Text>
              <Text style={styles.vehicleDetailSecondText}>
                {`${dateFormatter(modalData.date)} • ${modalData.duration} min`}
              </Text>
            </View>
          </View>
        </Modal>
      </ScrollView>
      : <Loader />
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
  title: {
    fontSize: 20,
  },
  vehicleDetailSecondText: {
    fontSize: 12,
    color: Colors.light.secondaryText
  },
  vehicleDetailOne: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.light.borderColor,
    marginTop: 10,
    padding: 10,
    flexDirection: 'row',
  },
  vehicleDetailOneA: {
    marginLeft: 10
  },
  vehicleDetailTwo: {
    marginTop: 20,
    padding: 10,
    flexDirection: 'row',
  },
  vehicleDetailThree: {
    marginTop: 5,
    padding: 10,
    flexDirection: 'row',
  },
  vehicleDetailTwoA: {
    marginLeft: 30
  },
  vehicleDetailDistance: {
    fontSize: 16,
  }
});
