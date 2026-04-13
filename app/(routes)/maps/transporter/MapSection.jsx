import { Platform, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAP_API_KEY } from '../../../../RequestMethods';
import { estimateTime } from '../../../../utils/getDistance';


const MapSection = ({ mapRef, origin, destination, runnerLocation, runner }) => {
    const midLat = ((runnerLocation?.latitude || origin.latitude) + destination.latitude) / 2;
    const midLng = ((runnerLocation?.longitude || origin.longitude) + destination.longitude) / 2;

    const eta = runnerLocation 
        ? estimateTime(runnerLocation, destination, runner.delivery_mode)
        : null;

    return (
        <View style={{ flex: 1 }}>
            <MapView
                ref={mapRef}
                initialRegion={{
                    latitude: midLat,
                    longitude: midLng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                style={{ flex: 1 }}
                showsUserLocation
                mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
            >
                <Marker 
                    coordinate={runnerLocation || origin} 
                    title={`${runner.first_name} ${runner.last_name}`} 
                    pinColor="red" 
                />
                <Marker coordinate={destination} title="Custom Store" pinColor="green" />
                <MapViewDirections
                    origin={runnerLocation || origin}
                    destination={destination}
                    apikey={GOOGLE_MAP_API_KEY}
                    strokeWidth={5}
                    strokeColor="blue"
                />
            </MapView>

            {eta && <Text style={{ padding: 10, fontWeight: 'bold' }}>ETA: {eta}</Text>}
        </View>
    );
};

export default MapSection;