import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import polyline from '@mapbox/polyline';
import { useLocalSearchParams, useRouter } from 'expo-router';
import haversine from 'haversine-distance';
import { useEffect, useRef, useState } from 'react';
import { Image, Linking, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import FormInputs from '../../../../components/FormFields/FormInputs';
import { COLORS, SIZES } from '../../../../constants/constants';
import useApi from '../../../../hook/useApi';
import { GOOGLE_MAP_API_KEY, USER_IMAGE_URI } from '../../../../RequestMethods';

const AssignementMapUser = () => {
    const {
        user_id,
        is_transporter
    } = useSelector(state => state.auth);
    const { latitude, longitude, displayCurrentLocation, locationServicesEnabled } = useSelector(state => state.location);
    const router = useRouter();
    const {
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
        profile_image
    } = useLocalSearchParams();

    const origine_lat = parseFloat(latitude);
    const origine_lng = parseFloat(longitude);
    const destination_lat = parseFloat(destination_latitude);
    const destination_lng = parseFloat(destination_longitude);

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

    const params = useLocalSearchParams();
    console.log(params)

    let phone_num = '0973304006';

    const MakeCall = (phone_num) => {
        let phoneNumber = '';
        if (Platform.OS === 'android') {phoneNumber = `tel: +260${phone_num}`; }
        else {phoneNumber = `telprompt: +260${phone_num}`; }
        Linking.openURL(phoneNumber);
     };

    const [openclosemenu, setOpenCloseMenu] = useState(false);

    const calculateDistance = (pointA, pointB) => {
        const distanceKm = haversine(pointA, pointB) / 1000; // Convert meters to km
        return distanceKm < 1 ? `${Math.round(distanceKm * 1000) || ''} meters` : `${distanceKm.toFixed(2) || 0}Km`;
    };

    const pointA = directions[0]; // Transporter
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
            try {
                const origin = `${origine_lat},${origine_lng}`;
                const destination = `${destination_lat},${destination_lng}`;
                const key = GOOGLE_MAP_API_KEY;
        
                const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving&key=${key}`;
                const response = await fetch(url);
                const data = await response.json();
        
                if (data.routes && data.routes.length > 0) {
                    const points = polyline.decode(data.routes[0].overview_polyline.points);
                    const routeCoords = points.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
                    setCoords(routeCoords);
                } else {
                    console.warn("⚠️ No routes found from Google Directions API:", data);
                }
            } catch (error) {
                console.error("❌ Error fetching route:", error);
            }
        };
    
        fetchRoute();
    }, [origine_lat, origine_lng, destination_lat, destination_lng]);

    const [ordernumber, setOrderNumber] = useState('');

    const parameters = {
        assigned_order_number:ordernumber,
        user_id:user_id,
        order_id: assign_order_id,
        order_status: 'completed'
    }
    

    // Initialize the useSend hook at the component level
    const { data:deliverParcel, error:errorDeliverParcel, patch } = useApi(`/transporter/deliverparcel`)

    // console.log("PARAMS",parameters)
    
    // Deliver parcel function
    const handleDeliverParcel = async () => {
        if (ordernumber === '') {
            Toast.show({
                type: 'error',
                text1: 'Empty order number',
                text2: 'Please provide order number',
                position: 'bottom'
            });
            return;
        }
        if (assigned_order_number !== ordernumber) {
            Toast.show({
                type: 'error',
                text1: 'Incorrect Order',
                text2: 'The entered order number does not match the assigned one.',
                position: 'bottom'
            });
            return;
        }
        try {
            // const response = await resenddeliver(); // Await the call and get result
            // setLoading(true)
            const response = await patch(parameters);

            console.log(response)
    
            if (response?.message === 'Success') {
                Toast.show({
                    type: 'success',
                    text1: 'Delivered!',
                    text2: 'Parcel delivered successfully.',
                    position: 'bottom'
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Delivery Failed',
                    text2: response?.message || 'Something went wrong during delivery.',
                    position: 'bottom'
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Network Error',
                text2: error?.message || 'Could not complete delivery. Please try again.',
                position: 'bottom'
            });
        }
    };    
         
    return (
        <View className='flex-1 bg-white relative'>
            {openclosemenu === false ? <></>:
                <Pressable onPress={() => setOpenCloseMenu(false)} className='absolute w-full h-full z-50'>
                    <View className='bg-transparentBlack w-full justify-center items-center h-full relative px-4'>
                        <View className='absolute bg-white w-full rounded-md p-2 pb-4'>
                            <View className='flex-row justify-end p-2'>
                                <TouchableOpacity
                                    onPress={() => setOpenCloseMenu(false)}
                                    className='rounded-full border border-red justify-center items-center' style={{width: 30, height: 30}}>
                                    <FontAwesome name='times' color={COLORS.red} size={20}/>
                                </TouchableOpacity>
                            </View>
                            <View className='w-full mb-6'>
                                <Text className='text-sm text-red' style={{fontFamily: 'roboto-medium'}}>
                                    Enter the order number provided by the person receiving this package and comfirm the items before you handing over.
                                </Text>
                            </View>
                            <FormInputs
                                title='Enter Order Number'
                                borderStyle='border-slate'
                                keyboardType='numeric'
                                autoFocus={true}
                                handleChangeText={(value) => setOrderNumber(value)}
                                // desc='Enter the order provided by the person receiving this package and comfirm before you hand it over.'
                            />
                            <TouchableOpacity
                                className='justify-center items-center bg-green-700 py-4 mt-4 rounded-md' style={{height: 50}}
                                onPress={handleDeliverParcel}
                            >
                                <Text className='text-xl text-white' style={{fontFamily: 'roboto-medium'}}>Deliver Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Toast/>
                </Pressable>
            }
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
                        [
                            { latitude: origine_lat, longitude: origine_lng },
                            { latitude: destination_lat, longitude: destination_lng }
                        ],
                        {
                            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                            animated: true,
                        }
                    );
                }}
                style={{ flex: 1, zIndex: 0 }}
                showsUserLocation={true}
                mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
            >
                <Marker
                    coordinate={directions[0]}
                    identifier="origin"
                    pinColor="red"
                    title={first_name+ ' ' +last_name}
                />
                <Marker
                    coordinate={directions[1]}
                    identifier="destination"
                    pinColor="red"
                    title={assigned_store_name}
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
            <SafeAreaView className='pt-1'>
                <View
                    className='bg-white  z-40'
                    style={{ paddingHorizontal: 10, borderRadius: SIZES.radius, borderTopLeftRadius: 15, borderTopRightRadius: 15, }} >
                    <View className='flex-row justify-between items-center'>
                        <View>
                            <Text className='text-green2 text-base' style={{ fontFamily: 'roboto-medium' }}>Distance & Time</Text>
                            <Text className='text-black text-lg' style={{ fontFamily: 'roboto-medium' }}>{calculateDistance(pointA, pointB)} • {estimateTime(pointA, pointB)}</Text>
                        </View>
                        <TouchableOpacity
                            className='justify-center items-center'
                            onPress={() => setOpenCloseMenu(true)}
                        >
                            <FontAwesome5 name='caret-up' size={18}/>
                            <Text className='text-sm' style={{ fontFamily: 'roboto-bold' }}>Menu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className='bg-white flex-row justify-between items-center px-[5px]' style={{ height: 60 }} >
                    <View className='border-2 border-lavender rounded-full' style={{ height: 45, width: 45, marginLeft: 5 }}>
                        <Image
                            source={{uri: `${USER_IMAGE_URI}${profile_image}`}}
                            className='rounded-full h-full w-full'
                        />
                    </View>
                    <View className='flex-1 justify-center' style={{paddingLeft: 7}}>
                        <Text numberOfLines={1} style={{ fontFamily: 'roboto-medium' }} >{first_name+ ' ' +last_name}</Text>
                        <Text className='text-slate text-sm' style={{fontFamily: 'roboto-medium' }} >{destination_phone}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => MakeCall(phone_num)}
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
            </SafeAreaView>
        </View>
    )
}

export default AssignementMapUser