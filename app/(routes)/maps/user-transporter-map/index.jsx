import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import haversine from 'haversine-distance';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Linking, Platform, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useSelector } from 'react-redux';
import { COLORS, SIZES } from '../../../../constants/constants';
import useApi from '../../../../hook/useApi';
import { GOOGLE_MAP_API_KEY, USER_IMAGE_URI } from '../../../../RequestMethods';

const index = () => {
    const router = useRouter();
    const { transporter_id } = useLocalSearchParams();

    const user_id = '20250224_1629007291740407340729_67bc822cb1de46.283611430da19cbb202460a3e5c9b65232566259';
    const { latitude, longitude } = useSelector(state => state.location);

    const { data: gettransporter, isLoading: transporterloading, error: transportererrors } = useApi(`/deliveryman/transporter/${transporter_id}`);

    const origine_lat = parseFloat(latitude) || 0;
    const origine_lng = parseFloat(longitude) || 0;
    const destination_lat = parseFloat(gettransporter?.latitude) || 0;
    const destination_lng = parseFloat(gettransporter?.longitude) || 0;

    const [coords, setCoords] = useState([]);

    const directions = useMemo(() => [
        { latitude: origine_lat, longitude: origine_lng },
        { latitude: destination_lat, longitude: destination_lng }
    ], [origine_lat, origine_lng, destination_lat, destination_lng]);

    const pointA = directions[0];
    const pointB = directions[1];

    const MakeCall = (phone_num) => {
        const phoneNumber = Platform.OS === 'android' ? `tel:+26${phone_num}` : `telprompt:+260${phone_num}`;
        Linking.openURL(phoneNumber);
    };

    const calculateDistance = (pointA, pointB) => {
        const distanceKm = haversine(pointA, pointB) / 1000;
        return distanceKm < 1 ? `${Math.round(distanceKm * 1000)} meters` : `${distanceKm.toFixed(2)} Km`;
    };

    const estimateTime = (pointA, pointB, averageSpeedKmh = 40) => {
        const distanceKm = haversine(pointA, pointB) / 1000;
        const totalMinutes = Math.ceil((distanceKm / averageSpeedKmh) * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}` : `${minutes} min${minutes !== 1 ? 's' : ''}`;
    };

    const mapRef = useRef();

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.fitToCoordinates([pointA, pointB], {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [pointA, pointB]);

    const midLat = (origine_lat + destination_lat) / 2;
    const midLng = (origine_lng + destination_lng) / 2;

    useEffect(() => {
        const fetchRoute = async () => {
            try {
                const origin = `${origine_lat},${origine_lng}`;
                const destination = `${destination_lat},${destination_lng}`;
                const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving&key=${GOOGLE_MAP_API_KEY}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.routes?.length > 0) {
                const points = require('@mapbox/polyline').decode(data.routes[0].overview_polyline.points);
                const routeCoords = points.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
                setCoords(routeCoords);
                }
            } catch (err) {
                console.error('Failed to fetch route', err);
            }
        };

        fetchRoute();
    }, [origine_lat, origine_lng, destination_lat, destination_lng]);

    if (transporterloading) return <Text>Loading transporter data...</Text>;
    if (transportererrors) return <Text>Error loading transporter data.</Text>;

  return (
        <View className="flex-1 bg-white relative">
            <MapView
                initialRegion={{
                    latitude: midLat,
                    longitude: midLng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                ref={mapRef}
                onMapReady={() => {
                    mapRef.current?.fitToCoordinates([pointA, pointB], {
                        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                        animated: true,
                    });
                }}
                style={{ flex: 1, marginTop: 10, zIndex: 0 }}
                showsUserLocation={true}
                mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
            >
                <Marker
                    coordinate={pointA}
                    identifier="origin"
                    pinColor="red"
                    title={gettransporter?.first_name + ' ' + gettransporter?.last_name}
                />
                <Marker
                    coordinate={pointB}
                    identifier="destination"
                    pinColor="red"
                    title={gettransporter?.first_name + ' ' + gettransporter?.last_name}
                />
                <MapViewDirections
                    origin={pointA}
                    destination={pointB}
                    apikey={GOOGLE_MAP_API_KEY}
                    strokeWidth={5}
                    strokeColor="blue"
                    optimizeWaypoints={true}
                />
            </MapView>

            <View>
                <View className="bg-white z-40"
                    style={{ paddingHorizontal: 10, borderRadius: SIZES.radius, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
                >
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-green2 text-base" style={{ fontFamily: 'maven-medium' }}>
                                Distance & Time
                            </Text>
                            <Text className="text-black text-lg" style={{ fontFamily: 'maven-bold' }}>
                                {calculateDistance(pointA, pointB)} • {estimateTime(pointA, pointB)}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="bg-white flex-row justify-between items-center px-[5px]" style={{ height: 60 }}>
                    <View className="border-2 border-lavender rounded-full" style={{ height: 45, width: 45, marginLeft: 5 }}>
                        <Image
                            source={{ uri: `${USER_IMAGE_URI}${gettransporter?.profile_image}` }}
                            className="rounded-full h-full w-full"
                        />
                    </View>
                    <View className="flex-1 justify-center" style={{ paddingLeft: 7 }}>
                        <Text numberOfLines={1} style={{ fontFamily: 'maven-bold' }}>
                            {gettransporter?.first_name} {gettransporter?.last_name}
                        </Text>
                        <Text className="text-slate text-sm" style={{ fontFamily: 'roboto-medium' }}>
                            {gettransporter?.phone_num}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => MakeCall(gettransporter?.phone_num)}
                        style={{height: 45, width: 45,}}
                        className="justify-center rounded-full items-center p-1 bg-green2 mr-2"
                    >
                        <FontAwesome5 name="phone" style={{ color: COLORS.white, fontSize: 15 }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => router.back()}
                        style={{
                        justifyContent: 'center',
                        borderRadius: SIZES.round,
                        alignItems: 'center',
                        padding: 4,
                        backgroundColor: 'red',
                        height: 45,
                        width: 45,
                        marginRight: 7,
                        }}
                    >
                        <FontAwesome5 name="times" style={{ color: COLORS.white, fontSize: 20 }} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default index;