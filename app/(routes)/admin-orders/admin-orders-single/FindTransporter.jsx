import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS } from '../../../../constants/constants';
import { useTransporterSearch } from '../../../../hook/useTransporterSearch';
import { toast } from '../../../../utils/toast';
import TransporterModal from './TransporterModal';

const FindTransporter = ({
    isRunnerActive,
    params,
    data,
    searching,
    searchFailed,
    transporter,
    searchResults
}) => {
    const { latitude, longitude } = useSelector(state => state.location);
    const pointA = { latitude: latitude, longitude: longitude }; // User
    const router = useRouter();
    const { searchTransporter } = useTransporterSearch();
    const [loading, setLoading] = useState(false);
    const [openTransporterModal, setOpenTransporterModal] = useState(false);


    if (isRunnerActive || data?.status === 'in_transit') return null;

    // Placeholder push function — replace with real FCM / WebSocket
    const sendPushNotification = async (userId, payload) => {
        console.log(`Sending push to user ${userId}:`, payload);
        return true;
    };

    const payload = {
        order_id: params?.store_order_id,
        store_id: data?.store_id,
        latitude: pointA?.latitude,
        longitude: pointA?.longitude,
        courier_type: data?.shipping_mode
    };

    // --- Find transporter and notify (wait for driver to accept) ---
    const handleFindTransporter = async () => {
        const payload = {
            order_id: params?.store_order_id,
            store_id: data?.store_id,
            latitude: pointA?.latitude,
            longitude: pointA?.longitude,
            courier_type: data?.shipping_mode
        };

        try {
            // setSearching(true);

            const res = await searchTransporter(payload);

            console.log("SERVER RESPONSE:", JSON.stringify(res, null, 2));

            if (!res.data?.success) {
                toast.error(res.data?.message || "Transporter search failed");
                // setSearching(false);
                return;
            }

            // Socket.IO will notify when search finishes
        } catch (err) {
            // setSearching(false);
            toast.error("Unexpected error while finding transporter");
            console.error(err);
        }
    };

    useEffect(() => {
        if (searchFailed) {
            setOpenTransporterModal(true);
        }

        if (transporter) {
            setOpenTransporterModal(true);
        }
    }, [searchFailed, transporter]);

    console.log("PAYLOAD", searchResults)

    return (
        <>
            <View
                className='w-full border border-lavender rounded my-10 p-2 pt-6 bg-white relative'
            >
                <View className='absolute px-1 bg-white' style={{top: -13, left: 4}}>
                    <Text className='text-xl font-semibold' style={{fontFamily: 'roboto-medium'}}>Find Transporter</Text>
                </View>

                <View style={{ }}>
                    {searching ?
                        <View className='w-full justify-center items-center'>
                            <ActivityIndicator size={33} color={COLORS.primary}/>
                            <Text className='text-slate text-base mt-3' style={{fontFamily: 'roboto-medium'}}>
                                Stage {searchResults.stage} / {searchResults.totalStages}
                            </Text>
                            <Text className='text-slate text-base mt-3' style={{fontFamily: 'roboto-medium'}}>
                                {searchResults.message}
                            </Text>
                            
                        </View> :
                        <View className='w-full justify-center items-center'>
                            <FontAwesome name='search' size={30} color={COLORS.slate}/>
                            <Text className='text-slate text-base mt-3' style={{fontFamily: 'roboto-medium'}}>
                                Search for transporter
                            </Text>
                        </View>
                    }

                    <TouchableOpacity
                        className='justify-center items-center bg-primary mt-4 elevation-sm rounded py-2'
                        onPress={handleFindTransporter}
                        disabled={searching}
                    >
                        <Text className='text-white text-xl'>
                            {searching ? 'Searching...' : 'Search again'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {searchFailed && (
                <View
                    className='w-full border border-lavender rounded my-10 p-2 pt-6 bg-white relative'
                >
                    <View className='absolute px-1 bg-white' style={{top: -13, left: 4}}>
                        <Text className='text-xl font-semibold' style={{fontFamily: 'roboto-medium'}}>
                            Use Custom Transporter
                        </Text>
                    </View>
                    <View style={{ }}>
                        <View className='w-full' style={{}}>
                            <View className='justify-center items-center w-full mb-6'>
                                <Text className="justify-center items-center text-red" style={{ fontFamily: "roboto-medium" }}>
                                    if no transporter was found, you can try using your own custom transporter.
                                </Text>
                            </View>
                            <TouchableOpacity
                                className='justify-center items-center bg-green2 mb-4 elevation-sm rounded py-2'
                                onPress={() => router.push({
                                    pathname: '../find-transporter',
                                    params: {
                                        created_by: data?.store_id,
                                        custom_order_id: data?.order_id,
                                        store_order_id: data?.store_order_id || null,
                                        order_type: 'Normal',
                                        is_runner: false
                                    }
                                })}
                            >
                                <Text className='text-white text-2xl' style={{fontFamily: 'maven-medium'}}>Use Custom</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            <TransporterModal
                openTransporterModal={openTransporterModal}
                setOpenTransporterModal={setOpenTransporterModal}
            />
        </>
    )
}

export default FindTransporter