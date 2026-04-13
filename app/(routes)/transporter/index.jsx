import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainHeader from '../../../components/MainHeader';
import useApi from '../../../hook/useApi';
import { USER_IMAGE_URI } from '../../../RequestMethods';
import { startBackgroundTracking, startForegroundTracking, stopBackgroundTracking, stopForegroundTracking } from '../../../services/LocationServices';
import LoadingIndicator from '../../LoadingIndicator';

// Modals
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { COLORS } from '../../../constants/constants';
import LocationComponent from '../../../services/LocationComponent';
import { toast } from '../../../utils/toast';
import AssignmentModal from './AssignmentModal';
import BuyTripsModal from './BuyTripsModal';
import CompleteAccountSetupModal from './CompleteAccountSetupModal';
import CreateTransporterAcc from './CreateTransporterAcc';
import SettingsModal from './SettingsModal';

const TransporterDashboard = () => {
    const router = useRouter();
    const {
        user_id,
        transporter_id,
        is_transporter
    } = useSelector(state => state.auth);

    const [isActive, setIsActive] = useState(false);
    const [settings, setSettings] = useState(false);
    const [assignment, setAssignment] = useState(false);
    const [buyrides, setBuyRides] = useState(false);

    // ========== API Hooks ==========
    const transporterApi = useApi(user_id ? `/transporter/${user_id}` : null);
    const paidRidesApi = useApi(transporter_id ? `/trips/get_trips/${transporter_id}?req_type=paid` : null);
    const dailyTripsApi = useApi(transporter_id ? `/trips/transporter/daily/${transporter_id}` : null);
    const {data:getAllTrips, error:errorAllTrips, isLoading:loadingAllTrips, get: allTripsApi } = useApi(`/trips/all_trips?trip_type=transporter&page=1&limit=5`);
    const orderApi = useApi(transporterApi.data?.assign_order_id ? `/orders/${transporterApi.data.assign_order_id}/` : null);

    // Fetch data
    useEffect(() => {
        if (!user_id) return;
        transporterApi.get();
    }, [user_id]);

    useEffect(() => {
        if (!transporterApi.data) return;
        if (transporter_id) {
            paidRidesApi.get();
            dailyTripsApi.get();
            allTripsApi();
        }
        if (transporterApi.data.assign_order_id) orderApi.get();
    }, [transporterApi.data]);

    // Foreground location tracking while screen is open
    useEffect(() => {
        (async () => {
            await startForegroundTracking();
        })();

        return () => stopForegroundTracking(); // properly stop subscription on unmount
    }, []);

    // Toggle availability
    const handleEnableDisableAvailableStatus = async () => {
        try {
            if (isActive) {
                await stopBackgroundTracking();
                toast.success('Success', 'Tracking stopped');
            } else {
                await startBackgroundTracking();
                toast.success('Success', 'Tracking started');
            }
            setIsActive(!isActive);
        } catch (err) {
            toast.error('Error', 'Could not change availability');
        }
    };

    if (transporterApi.isLoading || paidRidesApi.isLoading || allTripsApi.isLoading) {
        return <LoadingIndicator loading_text="Loading transporter data..." />;
    }

    const transporter = transporterApi.data;
    const paidRides = paidRidesApi.data?.trips?.tripsCount || 0;
    const dailyTrips = dailyTripsApi.data?.count || 0;
    const allTrips = getAllTrips?.data || [];
    const orderData = orderApi.data || {};

    // console.log("COORDS", orderData)

    <LocationComponent role="transporter" userId={runner_id} />

    return (
        <SafeAreaView className="flex-1 bg-white items-center relative">
            <View className="px-2">
                <MainHeader fontFamily="ubuntu-medium" textStyles='text-2xl' header_name="Transporter" />
            </View>

            {!is_transporter ? (
                <CreateTransporterAcc router={router}/>
            ) : (
                <>
                    <BuyTripsModal
                        visible={buyrides}
                        setBuyRides={setBuyRides}
                        transporter_id={transporter_id}
                    />
                    <SettingsModal visible={settings} onClose={() => setSettings(false)} />
                    <CompleteAccountSetupModal transporter={transporter} />
                    <AssignmentModal visible={assignment} onClose={() => setAssignment(false)} />

                    <FlatList
                        ListHeaderComponent={() => (
                            <View className="w-full mb-10">
                                {/* Top Info */}
                                <View className="mt-2 px-2 w-full flex-row justify-between items-center">
                                    <View className="rounded-full border-2 border-lavender" style={{ height: 70, width: 70 }}>
                                        <Image className="h-full w-full rounded-full" source={{ uri: `${USER_IMAGE_URI}${transporter?.profile_image}` }} />
                                    </View>
                                    <View className="mx-2" style={{ width: '60%' }}>
                                        <Text className="text-lg" style={{ fontFamily: 'roboto-medium' }}>{transporter?.first_name} {transporter?.last_name}</Text>
                                        <Text className="text-base text-slate" style={{ fontFamily: 'roboto-medium' }}>{transporter?.phone_num}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => setSettings(!settings)} className="border-2 border-lavender rounded-full justify-center items-center" style={{ height: 47, width: 47 }}>
                                        <View className="w-full h-full bg-grey_bg rounded-full border-2 border-white items-center justify-center">
                                            <FontAwesome name="gear" size={22} color={COLORS.black} />
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                {/* Stats */}
                                <View className='w-full flex-row justify-between items-center px-4 mt-8'>
                                    <View className='bg-grey_bg rounded-md justify-center items-center' style={{width: '48%', height: 100}}>
                                        <Text className='text-xl' style={{fontFamily: 'roboto-bold'}}>{paidRides}</Text>
                                        <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>Available Trips</Text>
                                    </View>
                                    <View className='bg-grey_bg rounded-md justify-center items-center' style={{width: '48%', height: 100}}>
                                        <Text className='text-xl' style={{fontFamily: 'roboto-bold'}}>5</Text>
                                        <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>Completed Trips</Text>
                                    </View>
                                </View>
                                <View className='w-full px-4'>
                                    <View className='bg-grey_bg rounded-md justify-center items-center mt-4 w-full' style={{height: 90}}>
                                        <Text className='text-xl' style={{fontFamily: 'roboto-bold'}}>K{transporter?.transporter_actual_bonus || 0}</Text>
                                        <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>Total Bonus</Text>
                                    </View>
                                </View>
                                <View className="w-full flex-row justify-between items-center px-4 mt-8">
                                    <View className="bg-grey_bg rounded-md justify-center items-center" style={{ width: '48%', height: 100 }}>
                                        <Text className="text-xl" style={{ fontFamily: 'roboto-bold' }}>{dailyTrips}</Text>
                                        <Text className="text-base" style={{ fontFamily: 'roboto-medium' }}>Daily Trips</Text>
                                    </View>
                                    <View className="bg-grey_bg rounded-md justify-center items-center" style={{ width: '48%', height: 100 }}>
                                        <Text className="text-xl" style={{ fontFamily: 'roboto-bold' }}>5</Text>
                                        <Text className="text-base" style={{ fontFamily: 'roboto-medium' }}>Cancelled Trips</Text>
                                    </View>
                                </View>
                                {/* Assignments */}
                                <View className="w-full px-4 mt-4">
                                    {transporter?.is_assigned ? (
                                        <TouchableOpacity
                                            className="bg-indigo-600 rounded-md justify-center items-center mt-4 w-full"
                                            style={{ height: 90 }}
                                            onPress={() => {
                                                router.push({
                                                    pathname: orderData?.order_status !== 'in_progress'
                                                        ? '../(routes)/maps/transporter/AssignementMapStore/'
                                                        : '../(routes)/maps/transporter/AssignementMapUser/',
                                                    params: {
                                                        transporter_id: transporter_id,
                                                        assigned_store_id: orderData?.assigned_store_id,
                                                        assign_order_id: orderData?.order_id,
                                                        assigned_order_number: orderData?.order_number,
                                                        assigned_store_name: orderData?.assigned_store_name,
                                                        assign_store_latitude: orderData.order_store_longitude,
                                                        assign_store_longitude: orderData.order_store_longitude,
                                                        destination_latitude: orderData?.user_latitude,
                                                        destination_longitude: orderData.user_longitude,
                                                        destination_phone: orderData?.destination_phone,
                                                        first_name: transporter?.first_name,
                                                        last_name: transporter?.last_name,
                                                        profile_image: orderData?.profile_image,
                                                        store_profileimage: orderData?.store_profileimage,
                                                        phone_num: orderData?.phone_num,
                                                    },
                                                });
                                            }}
                                        >
                                            <FontAwesome5 name="arrow-right" color={COLORS.white} size={25} />
                                            <Text className="text-xl text-white" style={{ fontFamily: 'roboto-medium' }}>Goto Assignment</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <View className="my-4 border border-gray-300 rounded-md w-full justify-center items-center py-4">
                                            <Text className="text-lg text-red" style={{ fontFamily: 'roboto-bold' }}>You have no assignment</Text>
                                            <Text className="text-base" style={{ fontFamily: 'roboto-medium' }}>Ensure that your transporter account is enabled</Text>
                                        </View>
                                    )}
                                </View>

                                <View className="w-full px-4 mt-4 flex-row justify-between items-center">
                                    <TouchableOpacity className="bg-green2 rounded-md justify-center items-center" style={{ width: '32%', height: 70 }} onPress={() => setBuyRides(true)}>
                                        <MaterialCommunityIcons name="bike-fast" color="red" size={20} />
                                        <Text className="text-base text-white" style={{ fontFamily: 'roboto-medium' }}>Buy Trips</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="bg-green2 rounded-md justify-center items-center" style={{ width: '32%', height: 70 }}>
                                        <Text className="text-xl">📍</Text>
                                        <Text className="text-base text-white" style={{ fontFamily: 'roboto-medium' }}>Goto Maps</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: transporter?.is_available === 'YES' || isActive ? 'red' : COLORS.green2,
                                            borderRadius: 8,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '32%',
                                            height: 70,
                                        }}
                                        onPress={handleEnableDisableAvailableStatus}
                                    >
                                        <MaterialCommunityIcons name="bike-fast" color="#fff" size={20} />
                                        <Text className="text-base text-white" style={{ fontFamily: 'roboto-medium' }}>{isActive ? 'Disable' : 'Enable'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                </>
            )}
        </SafeAreaView>
    );
};

export default TransporterDashboard;