import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { COLORS, SIZES } from '../../../../constants/constants'
import useApi from '../../../../hook/useApi'
import { makeCall } from '../../../../utils/getDistance'
import { toast } from '../../../../utils/toast'

const CustomTransporter = ({ trans_data, orderId, store_order_id, status }) => {
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    const { data: updateOrder, isLoading: loadingUpdateOrder, error: errorUpdateOrder, patch } = useApi(`/orders/admin/update`);
    // const { data, isLoading, error, post: findTransporter } = useApi("/transporter/find");

    // --- Update order status locally ---
    const handleUpdate = async (resumeStatus = null) => {
        try {

            const payload = {
                order_id: orderId,
                order_status: 'completed',
                store_order_id: store_order_id
            };

            console.log("PAYLOAD", payload)

            const res = await patch(payload);

            if (res?.success) {
                toast.success(`Order Delivered`);

            } else {
                toast.error(res?.message || "Update failed");
                return;
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    };





    return (
        <View className="my-10">
            {/* Store Details */}
            <View className="relative">
                <View className="w-full border pt-4 pb-1 px-2 rounded-md border-lavender ">
                    <View className="px-1 absolute left-1 -top-5 bg-white rounded-full justify-center items-center p-1">
                        <Text
                            className="text-lg"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            Transporter Details
                        </Text>
                    </View>

                    <View className="w-full flex-row justify-between items-center">
                        <TouchableOpacity className="w-[83%] flex-row justify-start items-center mb-3">
                            <View className=''>
                                <FontAwesome name="user-circle-o" size={52} color={COLORS.slate} />
                            </View>
                            <View className="ml-2">
                                <Text
                                    className="text-base"
                                    style={{ fontFamily: "roboto-medium" }}
                                >
                                    {trans_data?.first_name} {trans_data?.last_name}
                                </Text>
                                <Text
                                    className="text-slate text-sm"
                                    style={{
                                        fontFamily: "roboto",
                                        fontSize: SIZES.small,
                                    }}
                                >
                                    {trans_data?.phone_number}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="w-[15%] items-center justify-center"
                            onPress={() => makeCall(trans_data?.phone_number)}
                        >
                            <View
                                className="border border-lavender bg-[#DFF6E6] items-center justify-center rounded-full"
                                style={{ height: 42, width: 42 }}
                            >
                                <FontAwesome5
                                    name="phone"
                                    color={COLORS.green2}
                                    size={15}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {status !== 'completed' && (
                        <TouchableOpacity
                            className='justify-center items-center bg-primary mt-4 elevation-sm rounded py-3'
                            onPress={handleUpdate}
                            disabled={loadingUpdateOrder}
                            style={{opacity: loadingUpdateOrder ? 0.6 : 1}}
                        >
                            {loadingUpdateOrder ? (
                                <ActivityIndicator color={COLORS.white}/>
                            ) : (
                                <Text className="text-white"
                                    style={{ fontFamily: "roboto-medium" }}
                                >Mark as delivered</Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    )
}

export default CustomTransporter;