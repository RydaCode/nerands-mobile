import { FontAwesome5 } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, TouchableOpacity, View } from "react-native";
import useApi from "../../../hook/useApi";
import { toast } from "../../../utils/toast";

const BuyTripsModal = ({ visible, setBuyRides, transporter_id }) => {

    const buyRidesApi = useApi(
        `/trips/all_trips?trip_type=transporter&page=1&limit=10`
    );

    const { data:buyRides, isLoading, error, post: buyTrip } = useApi("/trips/transporter/purchase");
    const [activeRides, setActiveRides] = useState(null);

    useEffect(() => {
        buyRidesApi.get();
    }, []);

    const rides = buyRidesApi.data;

    // console.log("BUY RIDE",buyRidesApi.data)

    if (!visible) return null;

    const handleBuyTrip = async (errand) => {
        if (!transporter_id) return toast.error("Trasporter ID is missing.");
        if (activeRides) return; // prevent multiple clicks

        setActiveRides(errand.trip_id);

        try {
            const res = await buyTrip({
                transporter_id,
                trip_id: errand.trip_id,
                trip_number: errand.trip_number,
                trip_amount: errand.trip_amount,
            });

            if (res?.data?.success === true) {
                toast.success(`${res?.data?.message}` || "Trips purchased successfully, a prompt has been sent 🎉");
                setBuyRides(false);
            } else if (res?.data?.success === false) {
                toast.error(res?.data?.message || "Purchase could not be completed.");
            } else {
                toast.error(res?.data?.message || "Something went wrong");
            }
        } catch (err) {
            console.error("handleBuyTrip error:", err);
            toast.error("Network / Error", err?.message || "Unable to complete purchase");
        } finally {
            setActiveRides(null);
        }
    };

    return (
        <Pressable
            style={{ width: '100%', inset: 0, height: '100%', zIndex: 50 }}
            className=" bg-transparentBlack absolute justify-center items-center px-4"
            onPress={() => setBuyRides(false)}
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
                            <Text className="text-2xl" style={{ fontFamily: 'ubuntu-medium' }}>
                                Buy Trips
                            </Text>
                            <TouchableOpacity
                                className="flex-row justify-center items-center rounded-full"
                                onPress={() => setBuyRides(false)}
                            >
                                <View className="rounded-full bg-red justify-center items-center" style={{ height: 25, width: 25 }}>
                                    <FontAwesome5 name="times" color="white" size={15} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View className='bg-lavender my-2' style={{height: 1}} />
                        {/* Divider */}
                        <View className="bg-lavender w-full" style={{ height: 1 }} />

                        {/* Trips List */}
                        <FlatList
                            data={rides.data ?? []}
                            keyExtractor={(item) => item.trip_id.toString()}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            renderItem={({ item }) => (
                                <View
                                    className="mt-4"
                                    style={{ width: '48%', height: 110 }}
                                >
                                    <View className="bg-grey_bg rounded p-2 border border-lavender items-center elevation-sm flex-1 justify-between">
                                        <View className="w-full justify-center items-center">
                                            <Text className='text-xl text-primary' style={{fontFamily: 'roboto-bold'}}>K{item.trip_amount}</Text>
                                            
                                            <Text className='justify-center items-center'>
                                                <Text style={{fontFamily: 'roboto-bold'}}>{item.trip_number}</Text>
                                                    <Text className="text-base"
                                                        style={{ fontFamily: 'roboto-medium' }}
                                                    > {item.trip_number < 2 ? 'Trp' : 'Trips'}
                                                </Text>
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            disabled={activeRides === item.trip_id}
                                            className={`rounded elevation-md py-2 w-full ${
                                                activeRides === item.trip_id
                                                    ? 'bg-gray-400' : 'bg-green2'
                                            }`}
                                            onPress={() => handleBuyTrip(item)}
                                        >
                                            <Text
                                                className="text-center text-white"
                                                style={{ fontFamily: 'roboto-medium' }}
                                            >
                                                {activeRides === item.trip_id ? 'Buying...' : 'Buy now'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            ListHeaderComponent={() => (
                                <View className="px-2">
                                    <Text
                                        className="text-base"
                                        style={{ fontFamily: 'roboto-medium' }}
                                    >
                                        You can choose a package of trips that suits your budget.
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