import { FontAwesome5 } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, Pressable, Text, TouchableOpacity, View } from "react-native";
import useApi from "../../../hook/useApi";
import { toast } from "../../../utils/toast";

const BuyTripsModal = ({ visible, setBuyErrands, runner_id }) => {
    const { width, height } = Dimensions.get("window");

    const buyErrandsApi = useApi(
        `/trips/all_trips?trip_type=runner&page=1&limit=10`
    );

    const { post: buyTrip } = useApi("/trips/runner/purchase/");
    const [activeErrand, setActiveErrand] = useState(null);

    useEffect(() => {
        buyErrandsApi.get();
    }, []);

    const errands = buyErrandsApi?.data;

    if (!visible) return null;

    const handleBuyTrip = async (errand) => {
        if (!runner_id) return toast.error("Runner ID is missing.");
        if (activeErrand) return; // prevent multiple clicks

        setActiveErrand(errand.trip_id);

        try {
            const res = await buyTrip({
                runner_id,
                trip_id: errand.trip_id,
                trip_number: errand.trip_number,
                trip_amount: errand.trip_amount,
            });

            if (res?.data?.success === true) {
                toast.success(`${res?.message} a prompt has been sent` || "Errands purchased successfully, a prompt has been sent 🎉");
                setBuyErrands(false);
            } else if (res?.data?.success === false) {
                toast.error(res?.data?.message || "Purchase could not be completed.");
            } else {
                toast.error(res?.message || "Something went wrong");
            }
        } catch (err) {
            console.error("handleBuyTrip error:", err);
            toast.error("Network / Error", err?.message || "Unable to complete purchase");
        } finally {
            setActiveErrand(null);
        }
    };

    return (
        <Pressable
            style={{ width: '100%', inset: 0, height: '100%', zIndex: 50 }}
            className=" bg-transparentBlack absolute justify-center items-center px-4"
            onPress={() => setBuyErrands(false)}
        >
            <Pressable onPress={() => {}}>
                <MotiView
                    className="w-full items-center"
                    from={{ opacity: 0, translateY: 50 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ duration: 700 }}
                >
                    <View className="w-full bg-white z-50 p-4 rounded elevation-lg">
                        {/* Header */}
                        <View className="flex-row justify-between items-center">
                            <Text className="text-2xl" style={{ fontFamily: 'maven-medium' }}>
                                Buy Errands
                            </Text>
                            <TouchableOpacity
                                className="flex-row justify-center items-center rounded-full"
                                onPress={() => setBuyErrands(false)}
                            >
                                <View className="rounded-full bg-red justify-center items-center" style={{ height: 20, width: 20 }}>
                                    <FontAwesome5 name="times" color="white" size={15} />
                                </View>
                                <Text className="text-red text-base ml-1 text-center">Close</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Divider */}
                        <View className="bg-lavender w-full my-2" style={{ height: 1 }} />

                        {/* Trips List */}
                        <FlatList
                            data={errands.data ?? []}
                            keyExtractor={(item) => item.trip_id.toString()}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            renderItem={({ item }) => (
                                <View
                                    className="mt-4"
                                    style={{ width: '48%', height: 110 }}
                                >
                                    <View className="bg-grey_bg rounded p-2 border border-grey_bg elevation-md justify-center items-center">
                                        <View className="w-full justify-center items-center">
                                            <Text className='text-xl text-primary' style={{fontFamily: 'roboto-bold'}}>K{item.trip_amount}</Text>
                                            <Text style={{fontFamily: 'roboto-bold'}}>
                                                {item.trip_number} {item.trip_number < 2 ? 'Errand' : 'Errands'}
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            disabled={activeErrand === item.trip_id}
                                            className={`w-full mt-2 rounded elevation-md py-2 ${
                                                activeErrand === item.trip_id ? 'bg-gray-400' : 'bg-green2'
                                            }`}
                                            onPress={() => handleBuyTrip(item)}
                                        >
                                            <Text
                                                className="text-center text-white"
                                                style={{ fontFamily: 'roboto-medium' }}
                                            >
                                                {activeErrand === item.trip_id ? 'Buying...' : 'Buy now'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            ListHeaderComponent={() => (
                                <View className="px-2">
                                    <Text
                                        className="text-sm text-slate"
                                        style={{ fontFamily: 'roboto-medium' }}
                                    >
                                        You can choose a package of errands that suits your budget.
                                    </Text>
                                </View>
                            )}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </MotiView>
            </Pressable>
        </Pressable>
    );
};

export default BuyTripsModal;