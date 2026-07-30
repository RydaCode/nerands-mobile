import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainHeader from '../../../components/MainHeader';
import useApi from '../../../hook/useApi';
import { USER_IMAGE_URI } from '../../../RequestMethods';
import { startBackgroundTracking, startForegroundTracking, stopBackgroundTracking, stopForegroundTracking } from '../../../services/LocationServices';

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
    const {data, isLoading, error, get} =useApi(
        '/transporter/user/dashboard'
    );

    // Fetch data
    useEffect(() => {
        if (!user_id) return;
        get();
    }, [user_id]);

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

    const dashboard = data?.data?.transporter;
    const tripSummary = data?.data?.tripSummary;
    const availableTrips = data?.data?.availableTrips;
    const currentOrder = data?.data?.currentOrder || {};
    const dailyTripsCount = data?.data?.daily_trips?.count || 0;

    // console.log("COORDS", currentOrder);

    <LocationComponent role="transporter" userId={runner_id} />

    return (
        <SafeAreaView className="flex-1 bg-white items-center relative">
            <View className="px-2">
                <MainHeader fontFamily="ubuntu-medium" textStyles='text-2xl' header_name="Transporter" />
            </View>

            {!is_transporter ? (
                <CreateTransporterAcc router={router}/>
            ) : (
                isLoading ? (
                    <View className='w-full h-full justify-center items-center'>
                        <ActivityIndicator size={35} color={COLORS.primary}/>
                        <Text
                            className='text-slate mt-2'
                            style={{fontFamily: 'roboto-medium'}}
                        >Loading transporter data...</Text>
                    </View>
                ) : data?.length === 0 ? (
                    <View className='w-full h-full justify-center items-center'>
                        <Text
                            className='text-slate mt-2'
                            style={{fontFamily: 'roboto-medium'}}
                        >Transpoter data not found</Text>
                    </View>
                ) : error ? (
                    <View className='w-full h-full justify-center items-center'>
                        <Text
                            className='text-slate mt-2'
                            style={{fontFamily: 'roboto-medium'}}
                        >An error occured, please try again</Text>
                    </View>
                ) : (
                    <>
                        <BuyTripsModal
                            visible={buyrides}
                            setBuyRides={setBuyRides}
                            transporter_id={transporter_id}
                        />
                        <SettingsModal visible={settings} onClose={() => setSettings(false)} />
                        <CompleteAccountSetupModal transporter={dashboard} />
                        <AssignmentModal visible={assignment} onClose={() => setAssignment(false)} />

                        <FlatList
                            ListHeaderComponent={() => (
                                <View className="w-full mb-10">
                                    {/* Top Info */}
                                    <View className="mt-2 px-2 w-full flex-row justify-between items-center">
                                        <View className="rounded-full border-2 border-lavender" style={{ height: 70, width: 70 }}>
                                            <Image className="h-full w-full rounded-full" source={{ uri: `${USER_IMAGE_URI}${dashboard?.profile_image}` }} />
                                        </View>
                                        <View className="mx-2" style={{ width: '60%' }}>
                                            <Text className="text-lg" style={{ fontFamily: 'roboto-medium' }}>{dashboard?.first_name} {dashboard?.last_name}</Text>
                                            <Text className="text-base text-slate" style={{ fontFamily: 'roboto-medium' }}>{dashboard?.phone_num}</Text>
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
                                            <Text className='text-xl' style={{fontFamily: 'roboto-bold'}}>{tripSummary?.paid_trips}</Text>
                                            <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>Available Trips</Text>
                                        </View>
                                        <View className='bg-grey_bg rounded-md justify-center items-center' style={{width: '48%', height: 100}}>
                                            <Text className='text-xl' style={{fontFamily: 'roboto-bold'}}>5</Text>
                                            <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>Completed Trips</Text>
                                        </View>
                                    </View>
                                    <View className='w-full px-4'>
                                        <View className='bg-grey_bg rounded-md justify-center items-center mt-4 w-full' style={{height: 90}}>
                                            <Text className='text-xl' style={{fontFamily: 'roboto-bold'}}>K{dashboard?.transporter_actual_bonus || 0}</Text>
                                            <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>Total Bonus</Text>
                                        </View>
                                    </View>
                                    <View className="w-full flex-row justify-between items-center px-4 mt-8">
                                        <View className="bg-grey_bg rounded-md justify-center items-center" style={{ width: '48%', height: 100 }}>
                                            <Text className="text-xl" style={{ fontFamily: 'roboto-bold' }}>{dailyTripsCount}</Text>
                                            <Text className="text-base" style={{ fontFamily: 'roboto-medium' }}>Daily Trips</Text>
                                        </View>
                                        <View className="bg-grey_bg rounded-md justify-center items-center" style={{ width: '48%', height: 100 }}>
                                            <Text className="text-xl" style={{ fontFamily: 'roboto-bold' }}>5</Text>
                                            <Text className="text-base" style={{ fontFamily: 'roboto-medium' }}>Cancelled Trips</Text>
                                        </View>
                                    </View>
                                    {/* Assignments */}
                                    <View className="w-full px-4 mt-4">
                                        {dashboard?.is_assigned ? (
                                            <TouchableOpacity
                                                className="bg-indigo-600 rounded-md justify-center items-center mt-4 w-full"
                                                style={{ height: 90 }}
                                                onPress={() => {
                                                    router.push({
                                                        pathname: currentOrder?.order_status !== 'in_progress'
                                                            ? '../(routes)/maps/transporter/AssignementMapStore/'
                                                            : '../(routes)/maps/transporter/AssignementMapUser/',
                                                        params: {
                                                            transporter_id: transporter_id,
                                                            assigned_store_id: currentOrder?.assigned_store_id,
                                                            assign_order_id: currentOrder?.order_id,
                                                            assigned_order_number: currentOrder?.order_number,
                                                            assigned_store_name: currentOrder?.assigned_store_name,
                                                            assign_store_latitude: currentOrder.order_store_longitude,
                                                            assign_store_longitude: currentOrder.order_store_longitude,
                                                            destination_latitude: currentOrder?.user_latitude,
                                                            destination_longitude: currentOrder.user_longitude,
                                                            destination_phone: currentOrder?.destination_phone,
                                                            first_name: dashboard?.first_name,
                                                            last_name: dashboard?.last_name,
                                                            profile_image: currentOrder?.profile_image,
                                                            store_profileimage: currentOrder?.store_profileimage,
                                                            phone_num: currentOrder?.phone_num,
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
                                                backgroundColor: dashboard?.is_available === 'YES' || isActive ? 'red' : COLORS.green2,
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
                )
            )}
        </SafeAreaView>
    );
};

export default TransporterDashboard;