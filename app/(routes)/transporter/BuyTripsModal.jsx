import { FontAwesome5 } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../../constants/constants";
import useApi from "../../../hook/useApi";
import { toast } from "../../../utils/toast";

const BuyTripsModal = ({ visible, setBuyRides, transporter_id }) => {
    const {
        data: buyRidesApi,
        isLoading: loading,
        error: errorgetRides,
        get
    } = useApi(
        `/trips/all_trips?trip_type=transporter&page=1&limit=10`
    );

    const {
        post: buyTrip
    } = useApi("/trips/transporter/purchase");

    const [activeRides, setActiveRides] = useState(null);

    useEffect(() => {
        if (visible) {
            get();
        }
    }, [visible]);

    const rides = buyRidesApi?.data ?? [];

    const handleBuyTrip = async (errand) => {
        if (!transporter_id) {
            return toast.error("Transporter ID is missing.");
        }

        if (activeRides) return;
        
        setActiveRides(errand.trip_id);
        
        try {
            const res = await buyTrip({
                transporter_id,
                trip_id: errand.trip_id,
                trip_number: errand.trip_number,
                trip_amount: errand.trip_amount,
            });

            if (res?.data?.success === true) {
                toast.success(
                    res?.data?.message ||
                    "Trips purchased successfully 🎉"
                );
                setBuyRides(false);
            } else {
                toast.error(
                    res?.data?.message ||
                    "Purchase could not be completed."
                );
            }
        } catch (err) {
            console.error("handleBuyTrip error:", err);
            toast.error(
                "Unable to complete purchase"
            );
        } finally {
            setActiveRides(null);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => setBuyRides(false)}
        >
            <Pressable
                className="flex-1 bg-transparentBlack justify-end"
                onPress={() => setBuyRides(false)}
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
                            <View className="flex-row justify-between items-center">
                                <Text
                                    className="text-2xl"
                                    style={{ fontFamily: "outfit-medium" }}
                                >
                                    Buy Trips
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setBuyRides(false)}
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

                            {loading ? (
                                <View className='justify-center items-center mt-6'>
                                    <ActivityIndicator size={33} color={COLORS.primary}/>
                                    <Text
                                        style={{fontFamily: 'roboto-medium'}}
                                    >Loading trips...</Text>
                                </View>
                            ) : rides?.length === 0 ? (
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
                            ) : errorgetRides ? (
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
                                    data={rides}
                                    keyExtractor={(item) =>
                                        item.trip_id.toString()
                                    }
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
                                                        activeRides === item.trip_id
                                                    }

                                                    className={`rounded py-2 w-full ${
                                                        activeRides === item.trip_id
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
                                                            activeRides === item.trip_id
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
                    </MotiView>
                    </SafeAreaView>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default BuyTripsModal;