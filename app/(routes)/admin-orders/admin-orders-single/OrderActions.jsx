import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../../constants/constants";
import useApi from "../../../../hook/useApi";
import { useTransporterSearch } from "../../../../hook/useTransporterSearch";
import { toast } from "../../../../utils/toast";

// Placeholder push function — replace with real FCM / WebSocket
const sendPushNotification = async (userId, payload) => {
    console.log(`Sending push to user ${userId}:`, payload);
    return true;
};

const OrderActions = ({
    orderId,
    store_order_id,
    status,
    grandTotal,
    params,
    store,
    courier_type,
    onUpdate,
    onTransporterAssigned
}) => {
    const [loading, setLoading] = useState(false);
    const { searchTransporter } = useTransporterSearch();
    const [searching, setSearching] = useState(false);

    const { data: updateOrder, isLoading: loadingUpdateOrder, error: errorUpdateOrder, patch } = useApi(`/orders/admin/update`);
    // const { data, isLoading, error, post: findTransporter } = useApi("/transporter/find");

    // --- Update order status locally ---
    const handleUpdate = async (newStatus, resumeStatus = null) => {
        try {

            const payload = {
                order_id: orderId,
                order_status: newStatus,
                store_order_id: store_order_id
            };

            if (status === "delayed" && resumeStatus) {
                payload.resume = resumeStatus;
            }


            const res = await patch(payload);


            if (res?.success) {

                toast.success(`Order updated: ${newStatus}`);

                onUpdate?.(newStatus);

            } else {

                toast.error(res?.message || "Update failed");

            }

        } catch (err) {

            toast.error("Something went wrong");

        } finally {

            setLoading(false);

        }
    };

    const handleFindTransporter = async () => {
        const payload = {
            order_id: orderId,
            store_id: store?.store_id,
            latitude: store?.store_latitude,
            longitude: store?.store_longitude,
            courier_type: courier_type
        };

        try {
            setSearching(true);

            const res = await searchTransporter(payload);

            console.log("SERVER RESPONSE:", JSON.stringify(res, null, 2));

            if (!res.data?.success) {
                toast.error(res.data?.message || "Transporter search failed");
                setSearching(false);
                return;
            }

            // Socket.IO will notify when search finishes
        } catch (err) {
            setSearching(false);
            toast.error("Unexpected error while finding transporter");
            console.error(err);
        }
    };

    // --- Placeholder for waiting for acceptance ---
    // Replace this with WebSocket or polling the order DB
    const waitForTransporterAcceptance = async (orderId, transporterId, timeoutMs = 30000) => {
        return new Promise((resolve) => {
            // Simulate backend response after some delay
            setTimeout(() => {
                const accepted = Math.random() > 0.3; // 70% chance driver accepts
                if (accepted) resolve({ transporter_id: transporterId, first_name: "John", last_name: "Doe" });
                else resolve(null);
            }, Math.min(timeoutMs, 5000));
        });
    };

    // if (loading) return <LoadingIndicator loading_text="Processing..." />;

    return (
        <View className="mb-3 flex-row">
            {/* Pending: admin must accept */}
            {status === "pending" && (
                <>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => {
                            handleUpdate("accepted");
                            handleFindTransporter();
                        }}
                        className="flex-1 mx-1 py-1 rounded elevation justify-center items-center"
                        style={{ backgroundColor: COLORS.green2 }}
                    >
                        <Text
                            className="text-center text-white text-base"
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            ACCEPT
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => handleUpdate("cancelled")}
                        className="flex-1 mx-1 py-3 rounded elevation justify-center items-center"
                        style={{ backgroundColor: COLORS.red }}
                    >
                        <Text
                            className="text-center text-white text-base"
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            REJECT
                        </Text>
                    </TouchableOpacity>
                </>
            )}

            {/* Accepted: start processing */}
            {status === "accepted" && (
                <>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => handleUpdate("processing")}
                        className="flex-1 mx-1 py-3 rounded elevation justify-center items-center"
                        style={{ backgroundColor: COLORS.green2 }}
                    >
                        <Text
                            className="text-center text-white text-base"
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            PROCESS
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => handleUpdate("delayed")}
                        className="flex-1 mx-1 py-3 rounded elevation justify-center items-center"
                        style={{ backgroundColor: COLORS.red }}
                    >
                        <Text
                            className="text-center text-white text-base"
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            DELAYED
                        </Text>
                    </TouchableOpacity>
                </>
            )}

            {/* Processing: ready for transporter */}
            {status === "processing" && (
                <>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => handleUpdate("ready")}
                        className="flex-1 mx-1 py-3 rounded elevation justify-center items-center"
                        style={{ backgroundColor: COLORS.green2 }}
                    >
                        <Text style={{fontFamily: 'roboto-medium'}} className="text-center text-white text-base">
                            READY
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => handleUpdate("delayed")}
                        className="flex-1 mx-1 py-3 rounded elevation justify-center items-center"
                        style={{ backgroundColor: COLORS.red }}
                    >
                        <Text style={{fontFamily: 'roboto-medium'}} className="text-center text-white text-base">
                            DELAYED
                        </Text>
                    </TouchableOpacity>
                </>
            )}

            {/* Delayed: resume or cancel */}
            {status === "delayed" && (
                <>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => handleUpdate("processing", "processing")}
                        className="flex-1 mx-1 py-3 rounded elevation justify-center items-center"
                        style={{ backgroundColor: COLORS.green2 }}
                    >
                        <Text className="text-center text-white text-base" style={{fontFamily: 'roboto-medium'}}>
                            Processing
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => handleUpdate("ready", "ready")}
                        className="flex-1 mx-1 py-3 rounded elevation justify-center items-center bg-purple-600"
                    >
                        <Text className="text-center text-white text-base" style={{fontFamily: 'roboto-medium'}}>Ready</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => handleUpdate("cancelled")}
                        className="flex-1 mx-1 py-3 rounded elevation justify-center items-center"
                        style={{ backgroundColor: COLORS.red }}
                    >
                        <Text className="text-center text-white text-base" style={{fontFamily: 'roboto-medium'}}>Cancel</Text>
                    </TouchableOpacity>
                </>
            )}

            {/* Ready: find transporter */}
            {/* {status === "ready" && (
                <View className='w-full'>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={handleFindTransporter}
                        className="py-4 rounded-sm"
                        style={{ backgroundColor: COLORS.primary }}
                    >
                        <Text className="text-center text-2xl text-white" style={{fontFamily: 'roboto-medium'}}>Find Transporter</Text>
                    </TouchableOpacity>
                </View>
            )} */}

            {/* Completed */}
            {status === "completed" && (
                <View className="flex-1 p-3 rounded-2xl bg-grey_bg">
                    <Text className="text-center text-slate" style={{fontFamily: 'roboto-medium'}}>✅ Order Completed (Total: K{grandTotal})</Text>
                </View>
            )}

            {/* Cancelled */}
            {status === "cancelled" && (
                <View className="flex-1 p-3 rounded-2xl bg-red">
                    <Text className="text-center text-white" style={{fontFamily: 'roboto-medium'}}>❌ Order Cancelled</Text>
                </View>
            )}
        </View>
    );
};

export default OrderActions;