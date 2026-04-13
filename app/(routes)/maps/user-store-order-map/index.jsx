import { Text, View, Image, TouchableOpacity, Platform, Linking, Pressable } from 'react-native'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../../../constants/constants';
import MapView, {Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { USER_IMAGE_URI, STORES_IMAGE_URI, GOOGLE_MAP_API_KEY } from '../../../../RequestMethods';
import haversine from 'haversine-distance';
import { useSelector } from 'react-redux';
import MapViewDirections from 'react-native-maps-directions';
import polyline from '@mapbox/polyline';
import FormInputs from '../../../../components/FormFields/FormInputs';
import useSend from '../../../../hook/useSend';
import Toast from 'react-native-toast-message';

const index = () => {
    const { latitude, longitude } = useSelector(state => state.location);
    const router = useRouter();
    const {
        store_latitude,
        store_longitude,
        store_name,
        store_profileImage,
        store_phone_num
    } = useLocalSearchParams();

    const origine_lat = parseFloat(latitude);
    const origine_lng = parseFloat(longitude);
    const destination_lat = parseFloat(store_latitude);
    const destination_lng = parseFloat(store_longitude);

    const directions = [
        {
            latitude: origine_lat,
            longitude: origine_lng,
        },
        {
            latitude: destination_lat,
            longitude: destination_lng,
        }
    ]

    // const params = useLocalSearchParams();
    // console.log(params)

    const MakeCall = (phone_num) => {
        let phoneNumber = '';
        if (Platform.OS === 'android') {phoneNumber = `tel: +260${phone_num}`; }
        else {phoneNumber = `telprompt: +260${phone_num}`; }
        Linking.openURL(phoneNumber);
     };

    const calculateDistance = (pointA, pointB) => {
        const distanceKm = haversine(pointA, pointB) / 1000; // Convert meters to km
        return distanceKm < 1 ? `${Math.round(distanceKm * 1000) || ''} meters` : `${distanceKm.toFixed(2) || 0}Km`;
    };

    const pointA = directions[0]; // User
    const pointB = directions[1]; //Store

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

    const mapRef = useRef();

    useEffect(() => {
    if (mapRef.current) {
        mapRef.current.fitToCoordinates([pointA, pointB], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
        });
    }
    }, []);
    
    const midLat = (origine_lat + destination_lat) / 2;
    const midLng = (origine_lng + destination_lng) / 2;

    const origin = { latitude: origine_lat, longitude: origine_lng };
    const destination = { latitude: destination_lat, longitude: destination_lng };

    useEffect(() => {
    const fetchRoute = async () => {
        const origin = `${origine_lat},${origine_lng}`;
        const destination = `${destination_lat},${destination_lng}`;
        const key = GOOGLE_MAP_API_KEY;

        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving&key=${key}`;

        const response = await fetch(url);
        const data = await response.json();
        const points = polyline.decode(data.routes[0].overview_polyline.points);

        const routeCoords = points.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
        setCoords(routeCoords);
    };

    fetchRoute();
    }, []);
    
    return (
        <View className='flex-1 bg-white relative'>
            <MapView
                initialRegion={{
                    latitude: midLat,
                    longitude: midLng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                ref={mapRef}
                onMapReady={() => {
                    mapRef.current?.fitToCoordinates(
                        [origin, destination],
                        {edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true, }
                    );
                }}
                style={{ flex: 1, marginTop: 10, zIndex: 0 }}
                showsUserLocation={true}
                mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
            >
                <Marker
                    coordinate={directions[0]}
                    identifier="origin"
                    pinColor="green"
                    // title={orderdata[0]?.store_name}
                />
                <Marker
                    coordinate={directions[1]}
                    identifier="destination"
                    pinColor="red"
                    title={store_name}
                    // description='Good Store'
                />
                <MapViewDirections
                    origin={directions[0]}
                    destination={directions[1]}
                    apikey={GOOGLE_MAP_API_KEY}
                    strokeWidth={5}
                    strokeColor="blue"
                    optimizeWaypoints={true}
                />
            </MapView>
            <View>
                <View
                    className='bg-white  z-40'
                    style={{ paddingHorizontal: 10, borderRadius: SIZES.radius, borderTopLeftRadius: 15, borderTopRightRadius: 15, }} >
                    <View className='flex-row justify-between items-center'>
                        <View>
                            <Text className='text-green2 text-base' style={{ fontFamily: 'maven-medium' }}>Distance & Time</Text>
                            <Text className='text-black text-lg' style={{ fontFamily: 'maven-bold' }}>{calculateDistance(pointA, pointB)} • {estimateTime(pointA, pointB)}</Text>
                        </View>
                    </View>
                </View>
                <View className='bg-white flex-row justify-between items-center px-[5px]' style={{ height: 60 }} >
                    <View className='border-2 border-lavender rounded-full' style={{ height: 45, width: 45, marginLeft: 5 }}>
                        <Image
                            source={{uri: `${STORES_IMAGE_URI}${store_profileImage}`}}
                            className='rounded-full h-full w-full'
                        />
                    </View>
                    <View className='flex-1 justify-center' style={{paddingLeft: 7}}>
                        <Text numberOfLines={1} style={{ fontFamily: 'maven-bold' }} >{store_name}</Text>
                        <Text className='text-slate text-sm' style={{fontFamily: 'roboto-medium' }} >{store_phone_num}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => MakeCall(store_phone_num)}
                        style={{ height: 45, width: 45}}
                        className='justify-center rounded-full items-center p-1 bg-green2 mr-2 h-11 w-11'
                    >
                        <FontAwesome5 name='phone' style={{ color: COLORS.white, fontSize: 15, }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => router.back()}
                        style={{ justifyContent:'center', borderRadius: SIZES.round, alignItems: 'center', padding: 4, backgroundColor: 'red', height: 45, width: 45, marginRight: 7, }} >
                        <FontAwesome5 name='times' style={{ color: COLORS.white, fontSize: 20, }} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default index