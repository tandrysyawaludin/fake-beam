export interface VehicleDataInterface {
  id: string,
  vehicleId: string,
  serialCode: string,
  latlong: {
    latitude: number,
    longitude: number,
  },
  region: string,
  type: string,
  distanceInKm: string,
  battery: number,
  batteryColor: string,
  batteryIcon: string
}

export interface TripDataInterface {
  vehicleId: string,
  date: number,
  duration: number,
  region: string,
  type: string,
  charge: number,
  unit: string
}

export interface UserLocationInterface {
  latitude: number,
  longitude: number
}

export const vehicleDataShape = {
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
  batteryColor: '',
  batteryIcon: ''
}

export const tripDataShape = {
  vehicleId: '',
  date: 0,
  duration: 0,
  region: '',
  type: '',
  charge: 0,
  unit: ''
}