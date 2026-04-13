import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import useApi from '../../../../hook/useApi';
import { toast } from '../../../../utils/toast';

const FindTransporterModal = ({ custom_order_id, onClose }) => {
    const { isLoading, patch: deliverOrder } = useApi(`/customorders/update`);

    const deliverOrderByRunner = async () => {
        try {
            const response = await deliverOrder({
                custom_order_id,
                order_status: 'in_Progress'
            });

            if (response?.status) {
                toast.success("Order In Transit", "Marked as in_Transit");
                onClose();
            }
        } catch (err) {
            toast.error("Error", err.message);
        }
    };

    return (
        <View className="absolute inset-0">
            {/* OVERLAY */}
            <Pressable
                className="absolute inset-0"
                style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
                onPress={!isLoading ? onClose : undefined}
            />

            {/* MODAL */}
            <View className="absolute top-0 w-full bg-white rounded-md pb-6">
                
                {/* DRAG HANDLE */}
                <TouchableOpacity
                    className="pt-3 items-center"
                    onPress={!isLoading ? onClose : undefined}
                    activeOpacity={0.6}
                >
                    <View
                        className="h-1.5 w-1/3 rounded-full bg-lavender"
                    />
                </TouchableOpacity>

                {/* SECTION 1 */}
                <View className="px-4 my-4">
                    <Text
                        className="text-base text-slate-600"
                        style={{ fontFamily: "roboto-medium" }}
                    >
                        The distance from where you are and the destination is short,
                        you can also deliver.
                    </Text>

                    <Text
                        className="text-base mt-2"
                        style={{ fontFamily: "roboto" }}
                    >
                        Would you want to deliver this order by yourself?
                    </Text>

                    <TouchableOpacity
                        className="mt-4 bg-green-700 py-4 rounded-lg items-center"
                        onPress={deliverOrderByRunner}
                        disabled={isLoading}
                    >
                        <Text
                            className="text-white text-lg"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            {isLoading ? "Starting..." : "Deliver Now"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* SECTION 2 */}
                <View className="px-4">
                    <Text
                        className="text-base text-slate-600"
                        style={{ fontFamily: "roboto-medium" }}
                    >
                        Or you can find a transporter to deliver this order
                    </Text>

                    <TouchableOpacity className="mt-4 bg-violet-600 py-4 rounded-lg items-center">
                        <Text
                            className="text-white text-lg"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            Find Transporter
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
};

export default FindTransporterModal;
