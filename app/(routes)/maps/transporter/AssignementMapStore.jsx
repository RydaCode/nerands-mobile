import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import haversine from 'haversine-distance';
import { useEffect, useRef, useState } from 'react';
import { Image, Linking, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { COLORS, SIZES } from '../../../../constants/constants';
import { GOOGLE_MAP_API_KEY, STORES_IMAGE_URI } from '../../../../RequestMethods';

const AssignementMapStore = () => {
    const { latitude, longitude } = useSelector(state => state.location);
    const router = useRouter();

    const {
        transporter_id,
        assigned_store_id,
        assign_order_id,
        assigned_order_number,
        assigned_store_name,
        assign_store_latitude,
        assign_store_longitude,
        destination_latitude,
        destination_longitude,
        destination_phone,
        first_name,
        last_name,
        profile_image,
        store_profileImage,
        phone_num
    } = useLocalSearchParams();

    const mapRef = useRef();

    const destination = {
        latitude: parseFloat(assign_store_latitude),
        longitude: parseFloat(assign_store_longitude)
    };

    const [transporterLocation, setTransporterLocation] = useState({
        latitude: parseFloat(latitude) || 0,
        longitude: parseFloat(longitude) || 0
    });

    const [loading, setLoading] = useState(false);
    const [openclosemenu, setOpenCloseMenu] = useState(false);

    // Start tracking transporter live location
    useEffect(() => {
        let subscription;
        const startWatching = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            subscription = await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 5 },
                ({ coords }) => {
                    setTransporterLocation({ latitude: coords.latitude, longitude: coords.longitude });
                }
            );
        };

        startWatching();
        return () => subscription?.remove();
    }, []);

    // Calculate distance between transporter and store
    const calculateDistance = (pointA, pointB) => {
        const distanceKm = haversine(pointA, pointB) / 1000;
        return distanceKm < 1
            ? `${Math.round(distanceKm * 1000) || ''} meters`
            : `${distanceKm.toFixed(2) || 0}Km`;
    };

    // Estimate ETA based on delivery mode
    const estimateTime = (pointA, pointB, averageSpeedKmh = 40) => {
        const distanceKm = haversine(pointA, pointB) / 1000;
        const timeHours = distanceKm / averageSpeedKmh;
        const totalMinutes = Math.ceil(timeHours * 60);

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours > 0) {
            return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
        } else {
            return `${minutes} min${minutes !== 1 ? 's' : ''}`;
        }
    };

    const MakeCall = (phone) => {
        const phoneNumber =
            Platform.OS === 'android' ? `tel:+260${phone}` : `telprompt:+260${phone}`;
        Linking.openURL(phoneNumber);
    };

    const midLat = (transporterLocation.latitude + destination.latitude) / 2;
    const midLng = (transporterLocation.longitude + destination.longitude) / 2;

    // Fit map to coordinates when location changes
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.fitToCoordinates([transporterLocation, destination], {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [transporterLocation]);

    const handleStartOff = async () => {
        try {
            setLoading(true);
            // Implement your API patch here
            // e.g., await patch({ order_id: assign_order_id, order_status: 'in_progress' })
            Toast.show({ type: 'success', text1: `Order started` });
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Something went wrong' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className='flex-1 bg-white relative'>
            {openclosemenu && (
                <Pressable onPress={() => setOpenCloseMenu(false)} className='absolute w-full h-full z-50'>
                    <View className='bg-transparentBlack w-full justify-center items-center h-full relative px-4'>
                        <View className='absolute bg-white w-full rounded-md p-2 pb-4'>
                            <View className='flex-row justify-end p-2'>
                                <TouchableOpacity
                                    onPress={() => setOpenCloseMenu(false)}
                                    className='rounded-full border border-red justify-center items-center'
                                    style={{ width: 30, height: 30 }}
                                >
                                    <FontAwesome name='times' color={COLORS.red} size={20} />
                                </TouchableOpacity>
                            </View>
                            <View className='w-full'>
                                <Text className='text-sm text-green-600' style={{ fontFamily: 'roboto-medium' }}>
                                    If the order is ready, please start off now in order to notify the person receiving.
                                </Text>
                            </View>
                            <TouchableOpacity
                                className='justify-center items-center bg-purple-700 py-4 mt-4 rounded-md'
                                style={{ height: 50 }}
                                onPress={handleStartOff}
                            >
                                <Text className='text-xl text-white' style={{ fontFamily: 'roboto-medium' }}>
                                    Start off
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            )}

            <MapView
                initialRegion={{
                    latitude: midLat,
                    longitude: midLng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                ref={mapRef}
                style={{ flex: 1, marginTop: 10, zIndex: 0 }}
                showsUserLocation
                mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
            >
                <Marker
                    coordinate={destination}
                    identifier='destination'
                    pinColor='green'
                    title={assigned_store_name}
                />
                <Marker
                    coordinate={transporterLocation}
                    identifier='origin'
                    pinColor='red'
                    title={`${first_name} ${last_name}`}
                />
                <MapViewDirections
                    origin={transporterLocation}
                    destination={destination}
                    apikey={GOOGLE_MAP_API_KEY}
                    strokeWidth={5}
                    strokeColor='blue'
                    optimizeWaypoints
                />
            </MapView>

            <SafeAreaView className='pt-1'>
                <View
                    className='bg-white z-40'
                    style={{ paddingHorizontal: 10, borderRadius: SIZES.radius, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
                >
                    <View className='flex-row justify-between items-center'>
                        <View>
                            <Text className='text-green2 text-base' style={{ fontFamily: 'roboto-medium' }}>
                                Distance & Time
                            </Text>
                            <Text className='text-black text-base' style={{ fontFamily: 'roboto-medium' }}>
                                {calculateDistance(transporterLocation, destination)} • {estimateTime(transporterLocation, destination, 40)}
                            </Text>
                        </View>
                        <TouchableOpacity
                            className='justify-center items-center'
                            onPress={() => setOpenCloseMenu(true)}
                        >
                            <FontAwesome5 name='caret-up' size={18} />
                            <Text className='text-sm' style={{ fontFamily: 'roboto-bold' }}>
                                Menu
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className='bg-white flex-row justify-between items-center px-[5px]' style={{ height: 60 }}>
                    <View className='border-2 border-lavender rounded-full' style={{ height: 45, width: 45, marginLeft: 5 }}>
                        <Image
                            source={{ uri: `${STORES_IMAGE_URI}${store_profileImage}` }}
                            className='rounded-full h-full w-full'
                        />
                    </View>
                    <View className='flex-1 justify-center' style={{ paddingLeft: 7 }}>
                        <Text numberOfLines={1} style={{ fontFamily: 'maven-bold' }}>
                            {assigned_store_name}
                        </Text>
                        <Text className='text-slate text-sm' style={{ fontFamily: 'roboto-medium' }}>
                            {calculateDistance(transporterLocation, destination)}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => MakeCall(phone_num)}
                        style={{ height: 45, width: 45 }}
                        className='justify-center rounded-full items-center p-1 bg-green2 mr-2 h-11 w-11'
                    >
                        <FontAwesome5 name='phone' style={{ color: COLORS.white, fontSize: 15 }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => router.back()}
                        style={{ justifyContent: 'center', borderRadius: SIZES.round, alignItems: 'center', padding: 4, backgroundColor: 'red', height: 45, width: 45, marginRight: 7 }}
                    >
                        <FontAwesome5 name='times' style={{ color: COLORS.white, fontSize: 20 }} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default AssignementMapStore;
