import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { toast } from '../../../utils/toast';

const FindTransporter = ({params, pointA, data}) => {
    const { data: findtransporter, isLoading, error, post } = useApi('/transporter/find');
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    if (!data?.amount_spent) return null;

    // Placeholder push function — replace with real FCM / WebSocket
    const sendPushNotification = async (userId, payload) => {
        console.log(`Sending push to user ${userId}:`, payload);
        return true;
    };

    // --- Find transporter and notify (wait for driver to accept) ---
    const handleFindTransporter = async () => {
        try {
            setLoading(true);

            const payload = {
                order_id: data?.custom_order_id,
                store_id: params?.runner_id,
                latitude: pointA?.latitude,
                longitude: pointA?.longitude,
                courier_type: data?.delivery_mode?.[0] === 'custom' ? 'any' : data?.delivery_mode?.[0]?.mode || 'any'
            };

            const res = await post(payload);

            if (res.canceled) {
                toast.info("Transporter search was interrupted. Try again.");
                return;
            }

            if (!res.data?.success) {
                toast.error(res.data?.message || "Transporter search failed");
                return;
            }

            const transporter = res.transporter;

            if (!transporter) {
                toast.error(findtransporter?.message);
                return;
            }

            await sendPushNotification(transporter.user_id, {
                type: "NEW_ORDER",
                order_id: data?.custom_order_id,
                courier_type: data?.delivery_mode?.[0] === 'custom' ? 'any' : data?.delivery_mode?.[0]?.mode || 'any',
                pickup_lat: params?.user_lat,
                pickup_lng: params?.user_lng
            });

            toast.success(
                `Transporter notified`, `${transporter.first_name} ${transporter.last_name}`
            );

            onTransporterAssigned?.(transporter);

        } catch (err) {
            toast.error("Unexpected error while finding transporter");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View
            className='elevation-sm w-full border border-lavender rounded mb-8 p-2 pt-6 bg-white relative'
        >
            <View className='absolute px-1 bg-white' style={{top: -13, left: 4}}>
                <Text className='text-xl font-semibold' style={{fontFamily: 'roboto-medium'}}>Find Transporter</Text>
            </View>

            <View style={{ }}>
                {isLoading ?
                    <View className='w-full justify-center items-center'>
                        <ActivityIndicator size={40} color={COLORS.primary}/>
                        <Text className='text-slate text-base mt-3' style={{fontFamily: 'roboto-medium'}}>
                            {findtransporter?.message}
                        </Text>
                    </View> :
                    <View className='w-full justify-center items-center'>
                        <FontAwesome name='search' size={30} color={COLORS.slate}/>
                        <Text className='text-slate text-base mt-3' style={{fontFamily: 'roboto-medium'}}>
                            {findtransporter?.message || 'Search for transporter'}
                        </Text>
                    </View>
                }

                {!isLoading && (
                    <TouchableOpacity
                        className='justify-center items-center bg-primary mt-4 elevation-sm rounded py-2'
                        onPress={handleFindTransporter}
                        disabled={isLoading}
                    >
                        <Text className='text-white text-2xl' style={{fontFamily: 'maven-medium'}}>
                            {isLoading ? 'Searching...' : 'Search'}
                        </Text>
                    </TouchableOpacity>
                )}

                <View className='w-full mt-6' style={{borderTopWidth: 1, borderTopColor: COLORS.lavender}}>
                    <View className='justify-center items-center w-full my-6'>
                        <Text className="justify-center items-center text-red" style={{ fontFamily: "roboto-medium" }}>
                            Or if transporter search takes too long, you can try using your own custom transporter.
                        </Text>
                    </View>
                    <TouchableOpacity
                        className='justify-center items-center bg-green2 mb-4 elevation-sm rounded py-2'
                        onPress={() => router.push({
                            pathname: './find-transporter',
                            params: {
                                created_by: params?.runner_id,
                                custom_order_id: data?.custom_order_id,
                                order_type: 'Custom',
                                store_order_id: null,
                                is_runner: true
                            }
                        })}
                    >
                        <Text className='text-white text-2xl' style={{fontFamily: 'maven-medium'}}>Use Custom</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default FindTransporter