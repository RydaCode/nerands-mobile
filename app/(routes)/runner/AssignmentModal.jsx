import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, TouchableOpacity, View } from "react-native";
import useApi from "../../../hook/useApi";
import { toast } from "../../../utils/toast";

const AssignmentModal = ({ runner_id, onClose, stopLoopSound }) => {
    const router = useRouter();
    const {data: pendingApi, pendingLoading, pendingError, get} = useApi();

    useEffect(() => {
        if (runner_id) {
            get(`/trips/runner/errands?runner_id=${runner_id}&order_status=Pending&page=1&limit=1`);
        }
    }, [runner_id]);

    const [activeAction, setActiveAction] = useState(null);
    const { data, isLoading, error, post } = useApi("/runner/accept_errand");
    
    const customorder = pendingApi?.data?.[0] ?? null;
    const status = customorder?.order_status;
    if (!customorder || status !== 'Pending') return null;
    
    const fee = 50/100 * customorder?.service_fee;

    // Map backend state to mobile UI
    const getUIState = (orderStatus, orderProgress) => {
        if (orderStatus === 'Pending') return 'ACTION_REQUIRED';
        if (orderStatus === 'Processing' && orderProgress === 'Processing') return 'ACTIVE';
        if (orderStatus === 'Cancelled') return 'CANCELLED';
        if (orderStatus === 'Completed') return 'COMPLETED';
        return 'UNKNOWN';
    };

    const handleAction = async (actionStatus) => {
        if (isLoading) return;
        await stopLoopSound();
        setActiveAction(actionStatus);

        try {
            const res = await post({
                runner_id: customorder?.runner_id,
                order_id: customorder?.custom_order_id,
                order_number: customorder?.custom_order_num,
                runner_location: customorder?.runner_location,
                destination_location: customorder?.custom_order_location,
                destination_phone_number: customorder?.receipients_phone_number || null,
                order_status: actionStatus,
                order_type: 'custom',
                order_progress: actionStatus === 'Accepted' ? 'Processing' : 'Cancelled',
                errand_price: fee
            });

            if (res?.success) {
                toast.success(
                    `Errand ${actionStatus} successful!`, res?.message || 'Operation completed'
                );

                // Update UI based on backend state
                const uiState = getUIState(
                    res.data?.updatedOrder?.order_status,
                    res.data?.runnerErrand?.order_progress
                );

                if (uiState === 'ACTIVE') {
                    // Optional: navigate to active task screen
                    router.push('ActiveErrand', { order: res?.data });
                }

                onClose(false);
                return;
            }

            // Handle backend conflicts
            if (res?.code === 409) {
                toast.info(
                    res.message || 'This order has already been taken by another runner.'
                );
                onClose(false);
                return;
            }

            // Generic failure
            toast.error(
                `Errand ${actionStatus} failed, ${res?.message || 'Something went wrong.'}`
            );

        } catch (err) {
            toast.error(
                'Network Error',
                err?.message || 'Unable to reach server'
            );
        } finally {
            setActiveAction(null); // reset loading state
        }
    };

    return (
        <>
            <Pressable className="absolute flex-1 inset-0 z-40 bg-transparentBlack"/>
            <View className="absolute bottom-0 top-0 left-0 right-0 z-50 justify-center items-center">
                <View className="bg-white p-6 rounded w-[90%] elevation-md">
                    <Text className="text-2xl mb-4" style={{ fontFamily: 'maven-medium' }}>🚚 New Errand</Text>
                    <Text className="mb-4" style={{fontFamily: 'roboto-medium'}}>
                        You have received a new errand to run. You can either accept or decline it.
                    </Text>
                    <View className="flex-row justify-between">
                        <TouchableOpacity
                            className="bg-green2 w-[48%] elevation-md p-3 rounded flex-row justify-center items-center"
                            disabled={isLoading || activeAction === 'Cancelled'}
                            onPress={() => handleAction('Accepted')}
                        >
                            {activeAction === 'Accepted' ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Text className="text-white text-center text-lg" style={{ fontFamily: 'roboto-medium' }}>
                                    Accept
                                </Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-red w-[48%] elevation-md p-3 rounded flex-row justify-center items-center"
                            disabled={isLoading || activeAction === 'Accepted'}
                            onPress={() => handleAction('Cancelled')}
                        >
                            {activeAction === 'Cancelled' ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Text className="text-white text-center text-lg" style={{ fontFamily: 'roboto-medium' }}>
                                    Decline
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
};

export default AssignmentModal;