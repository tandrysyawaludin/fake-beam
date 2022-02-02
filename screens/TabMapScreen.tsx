
import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, Alert, Linking, Text, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { convertDistance, getPreciseDistance } from 'geolib';
import * as Location from 'expo-location';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { View } from '../components/Themed';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import Colors from '../constants/Colors';
import { VehicleDataInterface, vehicleDataShape, UserLocationInterface } from '../constants/DataShape';
import { titleCase } from '../helpers/textFormatter';

export default function TabMapScreen() {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean | undefined>(false);
  const [modalData, setModalData] = useState<VehicleDataInterface>(vehicleDataShape);
  const [userLocation, setUserLocation] = useState<UserLocationInterface>({ latitude: 0, longitude: 0 });
  const [vehicleData, setVehicleData] = useState<Array<VehicleDataInterface>>([vehicleDataShape]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('GPS Not Found', 'Permission to access location was denied');
        return;
      }

      const selectedLocation: any = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = selectedLocation.coords || { latitude: 0, longtitude: 0 };

      if (selectedLocation.mocked) {
        Alert.alert('Fake GPS Detected', 'Please turn off to make better experience');
        return
      }

      fetchVehiclesData();
      setUserLocation({
        latitude, longitude
      });
    })();
  }, []);

  const fetchVehiclesData = () => {
    setIsLoading(true);

    fetch('https://fake-beam-api.herokuapp.com/vehicles')
      .then((response) => response.json())
      .then((json) => {
        let _vehicleData: any = json;
        let _distanceInKm: number = 0;
        let _battery: number = 0;

        for (let index = 0; index < json.length; index++) {
          _distanceInKm = Math.round(convertDistance(
            getPreciseDistance(
              userLocation,
              json[index].latlong
            ),
            'km'
          ) * 10) / 10;
          _battery = json[index].battery;
          _vehicleData[index]['distanceInKm'] = `${_distanceInKm > 100 ? '>100' : _distanceInKm} km`;
          _vehicleData[index]['batteryColor'] = _battery >= 70 ? 'greenBattery' : _battery >= 40 ? 'yellowBattery' : 'redBattery';
          _vehicleData[index]['batteryIcon'] = _battery >= 70 ? 'battery-full' : _battery >= 40 ? 'battery-2' : 'battery-1';
        }
        setVehicleData(_vehicleData);
      })
      .catch(() => {
        Alert.alert(
          'Fetch Vehicle is Failed',
          'Please click Refetch',
          [
            { text: "Refetch", onPress: fetchVehiclesData }
          ]
        );
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    !isLoading ?
      <View style={styles.container}>
        <Ionicons name='reload-circle' size={40} color={Colors.light.icon} style={{ position: 'absolute', top: 2, zIndex: 1, right: 2 }} onPress={fetchVehiclesData} />
        <MapView style={styles.map} initialRegion={{
          latitude: 1.294886577581049,
          longitude: 103.87145676464114, latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
          {vehicleData.map((data, index) => (
            <Marker
              key={index}
              coordinate={data.latlong}
              title={`${data.distanceInKm} • ${data.battery}%`}
              description={
                'click to see more'
              }
              onCalloutPress={() => {
                setModalVisible(true);
                setModalData(data);
              }}
            >
              <View style={{
                ...styles.marker,
                ...{
                  borderColor: Colors.dark[data.batteryColor]
                }
              }}>
                <MaterialIcons
                  name='electric-scooter'
                  size={25}
                  color={Colors.light.icon}
                />
              </View>
            </Marker>
          ))}
        </MapView>

        <Modal modalVisible={modalVisible} setModalVisible={setModalVisible}>
          <View style={styles.vehicleDetailOne}>
            <MaterialIcons
              name='electric-scooter'
              size={50}
              color={Colors.light.icon}
            />
            <View style={styles.vehicleDetailOneA}>
              <Text style={styles.vehicleDetailSerialCode}>
                {`${titleCase(modalData.type)} • ${modalData.serialCode}`}
              </Text>
              <Text style={styles.vehicleDetailSecondText}>
                {modalData.vehicleId}
              </Text>
            </View>
          </View>

          <View style={styles.vehicleDetailTwo}>
            <MaterialCommunityIcons
              name='map-marker-distance'
              size={30}
              color={Colors.light.text}
            />
            <View style={styles.vehicleDetailTwoA}>
              <Text style={styles.vehicleDetailDistance}>
                {modalData.distanceInKm}
              </Text>
              <Text style={styles.vehicleDetailSecondText}>
                {titleCase(modalData.region)}
              </Text>
            </View>
          </View>

          <View style={styles.vehicleDetailThree}>
            <FontAwesome
              name={modalData.batteryIcon}
              size={25}
              color={Colors.dark[modalData.batteryColor]}
            />
            <View style={styles.vehicleDetailTwoA}>
              <Text style={styles.vehicleDetailDistance}>
                {modalData.battery}%
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.openMapBtn}
            onPress={() => {
              Linking.openURL(`https://maps.google.com/?api=1&q=${modalData.latlong.latitude},${modalData.latlong.longitude}`)
            }}>
            <Text style={styles.openMapLabel}>
              Open Map
            </Text>
          </Pressable>
        </Modal>
      </View>
      : <Loader />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  openMapBtn: {
    marginTop: 30,
    width: 200,
    alignSelf: 'center',
    borderWidth: 4,
    borderColor: Colors.light.tabIconSelected,
    borderRadius: 6,
    padding: 10
  },
  openMapLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.light.tabIconSelected,
    fontWeight: 'bold'
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  marker: {
    width: 34,
    height: 34,
    borderRadius: 34,
    paddingTop: 2,
    paddingLeft: 1,
    backgroundColor: Colors.light.background,
    borderWidth: 3,
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
  vehicleDetailSerialCode: {
    fontSize: 20,
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
  },
  vehicleDetailSecondText: {
    fontSize: 12,
    color: Colors.light.secondaryText
  }
});
