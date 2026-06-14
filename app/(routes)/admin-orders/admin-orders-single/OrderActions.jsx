import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../../constants/constants";
import useApi from "../../../../hook/useApi";
import { toast } from "../../../../utils/toast";
import LoadingIndicator from "../../../LoadingIndicator";

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
    courier_type,
    onUpdate,
    onTransporterAssigned
}) => {
    const [loading, setLoading] = useState(false);

    const { data: updateOrder, isLoading: loadingUpdateOrder, error: errorUpdateOrder, patch } = useApi(`/orders/admin/update`);
    const { data, isLoading, error, post: findTransporter } = useApi("/transporter/find");

    

    // --- Update order status locally ---
    const handleUpdate = async (newStatus, resumeStatus = null) => {
        console.log(newStatus)

        try {
            setLoading(true);

            const payload = { order_id: orderId, order_status: newStatus, store_order_id: store_order_id };
            if (status === "delayed" && resumeStatus) payload.resume = resumeStatus;

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

    // --- Find transporter and notify (wait for driver to accept) ---
    const handleFindTransporter = async () => {
        try {
            setLoading(true);

            const payload = {
                order_id: orderId,
                store_id: params?.store?.store_id,
                latitude: params?.store?.store_latitude,
                longitude: params?.store?.store_longitude,
                courier_type: 'Biker'
            };

            const res = await findTransporter(payload);

            console.log("SERVER RESPONSE:", JSON.stringify(res, null, 2));

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
                toast.error("No transporter available");
                return;
            }

            await sendPushNotification(transporter.user_id, {
                type: "NEW_ORDER",
                order_id: orderId,
                courier_type,
                pickup_lat: params?.store?.store_latitude,
                pickup_lng: params?.store?.store_longitude
            });

            toast.success(
                `Transporter notified: ${transporter.first_name} ${transporter.last_name}`
            );

            onTransporterAssigned?.(transporter);

        } catch (err) {
            toast.error("Unexpected error while finding transporter");
            console.error(err);
        } finally {
            setLoading(false);
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

    if (loading) return <LoadingIndicator loading_text="Processing..." />;

    return (
        <View className="absolute bottom-4 left-3 right-3 flex-row">
            {/* Pending: admin must accept */}
            {status === "pending" && (
                <>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => handleUpdate("accepted")}
                        className="flex-1 mx-1 py-3 rounded elevation-sm"
                        style={{ backgroundColor: COLORS.green2 }}
                    >
                        <Text
                            className="text-center text-white text-lg"
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            ACCEPT
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => handleUpdate("cancelled")}
                        className="flex-1 mx-1 py-3 rounded elevation-sm"
                        style={{ backgroundColor: COLORS.red }}
                    >
                        <Text
                            className="text-center text-white text-lg"
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
                        className="flex-1 mx-1 py-3 rounded elevation-sm"
                        style={{ backgroundColor: COLORS.green2 }}
                    >
                        <Text
                            className="text-center text-white text-lg"
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            PROCESS
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => handleUpdate("delayed")}
                        className="flex-1 mx-1 py-3 rounded elevation-sm"
                        style={{ backgroundColor: COLORS.red }}
                    >
                        <Text
                            className="text-center text-white text-lg"
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
                        className="flex-1 mx-1 py-3 rounded elevation-sm"
                        style={{ backgroundColor: COLORS.green2 }}
                    >
                        <Text style={{fontFamily: 'roboto-medium'}} className="text-center text-white text-lg">
                            READY
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => handleUpdate("delayed")}
                        className="flex-1 mx-1 py-3 rounded elevation-sm"
                        style={{ backgroundColor: COLORS.red }}
                    >
                        <Text style={{fontFamily: 'roboto-medium'}} className="text-center text-white text-lg">
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
                        className="flex-1 mx-1 py-3 rounded elevation-sm"
                        style={{ backgroundColor: COLORS.green2 }}
                    >
                        <Text className="text-center text-white text-lg" style={{fontFamily: 'roboto-medium'}}>
                            Processing
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => handleUpdate("ready", "ready")}
                        className="flex-1 mx-1 py-3 rounded elevation-sm bg-purple-600"
                    >
                        <Text className="text-center text-white text-lg" style={{fontFamily: 'roboto-medium'}}>Ready</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => handleUpdate("cancelled")}
                        className="flex-1 mx-1 py-3 rounded elevation-sm"
                        style={{ backgroundColor: COLORS.red }}
                    >
                        <Text className="text-center text-white text-lg" style={{fontFamily: 'roboto-medium'}}>Cancel</Text>
                    </TouchableOpacity>
                </>
            )}

            {/* Ready: find transporter */}
            {status === "ready" && (
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
            )}

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