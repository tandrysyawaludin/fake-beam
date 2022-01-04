
import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, Alert, Linking, Modal, Text, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { convertDistance, getPreciseDistance } from 'geolib';
import * as Location from 'expo-location';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import Colors from '../constants/Colors';

const vehicleDataShape = {
  id: '',
  vehicleId: '',
  serialCode: '',
  latlong: {
    latitude: 0,
    longitude: 0,
  },
  region: '',
  type: '',
  distanceInKm: '',
  battery: 0,
}

export default function TabMapScreen({ navigation }: RootTabScreenProps<'TabMap'>) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(vehicleDataShape);
  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });
  const [vehicleData, setVehicleData] = useState([vehicleDataShape]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('GPS Not Found', 'Permission to access location was denied');
        return;
      }

      const selectedLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = selectedLocation.coords || { latitude: 0, longtitude: 0 };

      if (selectedLocation.mocked) {
        Alert.alert('Fake GPS Detected', 'Please turn off to make better experience');
      }

      setUserLocation({
        latitude, longitude
      });
    })();
  }, []);

  useEffect(() => {
    fetchVehiclesData();
  }, [userLocation]);

  const fetchVehiclesData = () => {
    fetch('https://fake-beam-api.herokuapp.com/vehicles')
      .then((response) => response.json())
      .then((json) => {
        let _vehicleData: any = json;
        let _distanceInKm: number = 0;
        for (let index = 0; index < json.length; index++) {
          _distanceInKm = Math.round(convertDistance(
            getPreciseDistance(
              userLocation,
              json[index].latlong
            ),
            'km'
          ) * 10) / 10;
          _vehicleData[index]['distanceInKm'] = `${_distanceInKm > 100 ? '>100' : _distanceInKm} km`;
        }
        setVehicleData(_vehicleData);
      })
      .catch((error) => {
        Alert.alert(
          'Fetch Vehicle is Failed',
          'Please click Refetch',
          [
            { text: "Refetch", onPress: () => fetchVehiclesData() }
          ]
        );
      });
  }

  return (
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
            title={`${data.serialCode} • ${data.distanceInKm} • ${data.battery}%`}
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
                borderColor: data.battery >= 70 ? Colors.dark.greenBattery : data.battery >= 40 ? Colors.dark.yellowBattery : Colors.dark.redBattery
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          (!modalVisible);
        }}>
        <View style={styles.modalView}>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}>
            <MaterialIcons
              name='close'
              size={20}
              color={Colors.light.icon}
            />
          </Pressable>

          <View style={styles.vehicleDetailOne}>
            <MaterialIcons
              name='electric-scooter'
              size={50}
              color={Colors.light.icon}
            />
            <View style={styles.vehicleDetailOneA}>
              <Text style={styles.vehicleDetailSerialCode}>
                {`${modalData.type} • ${modalData.serialCode}`}
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
                {modalData.region}
              </Text>
            </View>
          </View>

          <View style={styles.vehicleDetailThree}>
            <FontAwesome
              name='battery-full'
              size={25}
              color={Colors.light.greenBattery}
            />
            <View style={styles.vehicleDetailTwoA}>
              <Text style={styles.vehicleDetailDistance}>
                {modalData.battery}%
              </Text>
            </View>
          </View>

          <Pressable
            style={{
              marginTop: 30,
              width: 200,
              alignSelf: 'center',
              borderWidth: 4,
              borderColor: Colors.light.tabIconSelected,
              borderRadius: 6,
              padding: 10
            }}
            onPress={() => {
              Linking.openURL(`https://maps.google.com/?api=1&q=${modalData.latlong.latitude},${modalData.latlong.longitude}`)
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: Colors.light.tabIconSelected,
                fontWeight: 'bold'
              }}>
              Open Map
            </Text>
          </Pressable>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
  modalView: {
    flex: 1,
    marginTop: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopWidth: 4,
    borderColor: Colors.light.popUpBorder,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: Colors.light.background,
    width: 40,
    height: 40,
    marginTop: 8,
    marginRight: 8,
    alignSelf: 'flex-end',
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
    color: Colors.light.secondaryText,
  }
});
