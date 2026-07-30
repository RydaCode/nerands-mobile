import { FontAwesome5 } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../../constants/constants";
import useApi from "../../../hook/useApi";
import { toast } from "../../../utils/toast";

const BuyTripsModal = ({ visible, setBuyErrands, runner_id }) => {
    const { width, height } = Dimensions.get("window");

    const {data: buyErrandsApi, isLoading, error, get} = useApi(
        `/trips/all_trips?trip_type=runner&page=1&limit=10`
    );

    const { post: buyTrip } = useApi("/trips/runner/purchase/");
    const [activeErrand, setActiveErrand] = useState(null);

    useEffect(() => {
        get();
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
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => setBuyErrands(false)}
        >
            <Pressable
                className="flex-1 bg-transparentBlack justify-end"
                onPress={() => setBuyErrands(false)}
            >
                <MotiView
                        from={{
                            opacity: 0,
                            translateY: 500
                        }}
                        animate={{
                            opacity: 1,
                            translateY: 0
                        }}
                        transition={{
                            type: "timing",
                            duration: 500
                        }}
                        style={{ width: '100%', justifyContent: 'center', alignItems: 'center'}}
                    >
                {/* Prevent closing when pressing inside */}
                <Pressable
                    className="w-full justify-end"
                    onPress={(e) => e.stopPropagation()}
                >
                    <SafeAreaView
                        className="bg-white"
                        edges={["bottom"]}
                        style={{
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        }}
                    >
                        <View className="w-full bg-white px-4 rounded"
                            style={{
                                maxHeight: '90%',
                                minHeight: 250,
                                marginBottom: 0,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                            }}
                        >
                            {/* Header */}
                            <View className="flex-row justify-between items-center mt-4">
                                <Text
                                    className="text-2xl"
                                    style={{ fontFamily: "outfit-medium" }}
                                >
                                    Buy Trips
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setBuyErrands(false)}
                                >
                                    <View
                                        className="rounded-full bg-grey_bg justify-center items-center"
                                        style={{ height: 30, width: 30 }}
                                    >
                                        <FontAwesome5 name="times" color={COLORS.red} size={17} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View className="bg-lavender my-2" style={{ height: 1 }} />

                            {isLoading ? (
                                <View className='justify-center items-center mt-6'>
                                    <ActivityIndicator size={33} color={COLORS.primary}/>
                                    <Text
                                        style={{fontFamily: 'roboto-medium'}}
                                    >Loading trips...</Text>
                                </View>
                            ) : errands?.length === 0 ? (
                                <View className='justify-center items-center mt-4'>
                                    <FontAwesome5 name='search' size={25} color={COLORS.slate}/>
                                    <Text
                                        className='mt-4'
                                        style={{fontFamily: 'roboto-medium'}}
                                    >There are no trips to purchase</Text>
                                    <TouchableOpacity
                                        className='bg-primary py-3 mt-4 justify-center items-center rounded'
                                        style={{width: '40%'}}
                                        onPress={() => get()}
                                    >
                                        <Text
                                            className='text-white'
                                            style={{fontFamily: 'roboto-medium'}}
                                        >Reload</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : error ? (
                                <View className='justify-center items-center mt-6'>
                                    <Text
                                        style={{fontFamily: 'roboto-medium'}}
                                    >Error loading trips...</Text>
                                    <TouchableOpacity
                                        className='bg-primary py-3 mt-4 justify-center items-center rounded'
                                        style={{width: '40%'}}
                                        onPress={() => get()}
                                    >
                                        <Text
                                            className='text-white'
                                            style={{fontFamily: 'roboto-medium'}}
                                        >Reload</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <FlatList
                                    data={errands?.data ?? []}
                                    keyExtractor={(item) => item.trip_id.toString()}
                                    style={{maxHeight: 500}}

                                    numColumns={2}
                                    columnWrapperStyle={{
                                        justifyContent: "space-between"
                                    }}

                                    renderItem={({ item }) => (
                                        <View
                                            className="mt-4"
                                            style={{width: "48%", height: 110}}
                                        >
                                            <View
                                                className="bg-grey_bg rounded p-2 border border-lavender items-center elevation-sm flex-1 justify-between"
                                            >
                                                <Text
                                                    className="text-xl text-primary"
                                                    style={{fontFamily: "roboto-bold"}}
                                                >
                                                    K{item.trip_amount}
                                                </Text>
                                                <Text>
                                                    <Text
                                                        style={{fontFamily: "roboto-bold"}}
                                                    >
                                                        {item.trip_number}
                                                    </Text>

                                                    {" "}
                                                    <Text>
                                                        {item.trip_number < 2 ? "Trip" : "Trips"}
                                                    </Text>
                                                </Text>

                                                <TouchableOpacity
                                                    disabled={
                                                        activeErrand === item.trip_id
                                                    }

                                                    className={`rounded py-2 w-full ${
                                                        activeErrand === item.trip_id
                                                        ? "bg-gray-400"
                                                        : "bg-green2"
                                                    }`}

                                                    onPress={() =>
                                                        handleBuyTrip(item)
                                                    }
                                                >
                                                    <Text
                                                        className="text-center text-white"
                                                    >
                                                        {
                                                            activeErrand === item.trip_id
                                                            ? "Buying..."
                                                            : "Buy now"
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}

                                    ListHeaderComponent={() => (
                                        <Text className="text-base px-2" >
                                            Choose a package of trips that suits your budget.
                                        </Text>
                                    )}
                                    showsVerticalScrollIndicator={false}
                                />
                            )}
                        </View>
                        </SafeAreaView>
                    
                    
                </Pressable>
                </MotiView>
            </Pressable>
        </Modal>
    );
};

export default BuyTripsModal;